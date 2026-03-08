"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Calendar as CalendarIcon, BarChart3, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays, isSameDay } from "date-fns";

type Schedule = {
    id: string;
    created_at: string;
    title: string;
    distance_km: number;
    activity_date: string;
    completed: boolean;
};

type RunRecord = {
    id: string;
    created_at: string;
    raw_data: {
        manual_data?: { distance_km?: number };
        strava_json?: { distance?: number };
    } | null;
};

export default function SchedulesDash() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [runs, setRuns] = useState<RunRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<{ name: string, distance: number }[]>([]);
    // new schedule form
    const [newTitle, setNewTitle] = useState("");
    const [newDist, setNewDist] = useState("");
    const [newDate, setNewDate] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            // Load schedules
            const { data: schedData, error: schedError } = await supabase
                .from('schedules')
                .select('*')
                .order('activity_date', { ascending: true });

            if (!schedError && schedData) setSchedules(schedData);

            // Load runs to build the dashboard graph
            const { data: runsData, error: runsError } = await supabase
                .from('runs')
                .select('*')
                .order('created_at', { ascending: false });

            if (!runsError && runsData) {
                setRuns(runsData);
                buildChartData(runsData);
            }
        } catch (err) {
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    const buildChartData = (runsData: RunRecord[]) => {
        // Build last 7 days chart data
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = subDays(new Date(), i);
            let dayTotal = 0;

            runsData.forEach(run => {
                const runDate = new Date(run.created_at);
                if (isSameDay(d, runDate)) {
                    // Try to get distance
                    const dist = run.raw_data?.manual_data?.distance_km || run.raw_data?.strava_json?.distance ? (run.raw_data?.strava_json?.distance || 0) / 1000 : 0;
                    dayTotal += Number(dist) || 0;
                }
            });

            data.push({
                name: format(d, 'EEE'), // e.g. "Mon"
                distance: parseFloat(dayTotal.toFixed(2))
            });
        }
        setChartData(data);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const markCompleted = async (sched: Schedule) => {
        // Update schedule as completed
        const { error: updErr } = await supabase
            .from('schedules')
            .update({ completed: true })
            .eq('id', sched.id);

        if (!updErr) {
            // Add to runs dashboard! 
            const payload = {
                manual_data: {
                    distance_km: sched.distance_km,
                    time_minutes: (sched.distance_km * 6), // guess 6min/km
                    calculated_pace: "6:00/km",
                    type: "Scheduled Activity",
                    notes: `Completed from schema: ${sched.title}`
                }
            };

            await supabase.from('runs').insert([{
                mode: 'manual',
                raw_data: payload,
                ai_analysis: `User completed scheduled activity: ${sched.title}. Great job sticking to the plan!`
            }]);

            // refresh
            fetchData();
        }
    };

    const addSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newDate) return;

        const { error } = await supabase
            .from('schedules')
            .insert([{
                title: newTitle,
                distance_km: Number(newDist) || 0,
                activity_date: newDate,
                completed: false
            }]);

        if (!error) {
            setNewTitle("");
            setNewDist("");
            setNewDate("");
            fetchData();
        }
    };

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Add New Schedule & Upcoming */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold flex items-center text-white mb-6">
                        <CalendarIcon className="w-6 h-6 text-purple-500 mr-3" />
                        My Schedule
                    </h2>

                    <form onSubmit={addSchedule} className="flex flex-col gap-3 mb-8 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <input
                            type="text"
                            placeholder="Activity Title (e.g. 5km Tempo Run)"
                            className="bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <input
                                type="number"
                                placeholder="Dist. (km)"
                                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
                                value={newDist}
                                onChange={e => setNewDist(e.target.value)}
                            />
                            <input
                                type="date"
                                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
                                value={newDate}
                                onChange={e => setNewDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center">
                            <Plus className="w-4 h-4 mr-1" /> Add to Schedule
                        </button>
                    </form>

                    <div className="space-y-3">
                        <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider">Upcoming Activities</h3>
                        {schedules.filter(s => !s.completed).length === 0 ? (
                            <p className="text-gray-500 text-sm">No scheduled activities. Add one above or from the planner!</p>
                        ) : (
                            schedules.filter(s => !s.completed).map((s) => (
                                <div key={s.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-xl border border-gray-700 group">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">{s.title}</span>
                                        <div className="flex text-xs text-gray-400 gap-3 mt-1">
                                            <span>📅 {s.activity_date}</span>
                                            {s.distance_km > 0 && <span>🏃 {s.distance_km}km</span>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => markCompleted(s)}
                                        className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-500 group-hover:bg-green-500/10 group-hover:border-green-500/50 group-hover:text-green-500 transition-all hover:scale-110"
                                        title="Mark as Completed"
                                    >
                                        <CheckCircle2 className="w-6 h-6" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold flex items-center text-white mb-6">
                        <BarChart3 className="w-6 h-6 text-blue-500 mr-3" />
                        Mileage Trend (Last 7 Days)
                    </h2>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <Bar dataKey="distance" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Distance (km)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 text-center border-t border-gray-800 pt-6">
                        <div className="bg-gray-800 p-4 rounded-xl">
                            <span className="text-gray-400 text-xs block mb-1">Total Logs</span>
                            <span className="text-2xl font-bold text-white">{runs.length}</span>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-xl">
                            <span className="text-gray-400 text-xs block mb-1">Total Scheduled</span>
                            <span className="text-2xl font-bold text-white">{schedules.length}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
