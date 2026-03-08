"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Plus, Loader2, Play, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RunDashboardPage() {
    type RunRecord = {
        id: string;
        created_at: string;
        mode: string;
        raw_data: {
            manual_data?: {
                distance_km?: number;
                calculated_pace?: string;
                type?: string;
            }
        } | null;
        ai_analysis: string;
    };
    const [runs, setRuns] = useState<RunRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRuns() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('runs')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setRuns(data);
            } catch (err) {
                console.error("Failed to load runs:", err);
            } finally {
                setLoading(false);
            }
        }
        loadRuns();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-5xl mx-auto pt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gray-800 pb-6 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 tracking-tight flex items-center">
                            <Activity className="w-8 h-8 mr-3 text-blue-500" />
                            Run Dashboard
                        </h1>
                        <p className="text-gray-400 mt-2">
                            View your past runs and AI-generated insights.
                        </p>
                    </div>
                    <Link href="/analyze-run/new">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center shadow-lg shadow-blue-500/20 active:scale-95">
                            <Plus className="w-5 h-5 mr-2" />
                            Log New Run
                        </button>
                    </Link>
                </div>

                {loading ? (
                    <div className="w-full flex items-center justify-center h-64 border border-gray-800 rounded-xl bg-gray-900 border-dashed">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : runs.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center p-12 h-64 border border-gray-800 rounded-xl bg-gray-900 border-dashed text-center">
                        <Activity className="w-12 h-12 text-gray-700 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Runs Logged Yet</h3>
                        <p className="text-gray-500 text-sm max-w-sm mb-6">
                            Start tracking your performance and get AI insights by logging your first run.
                        </p>
                        <Link href="/analyze-run/new" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
                            + Analyze my first run
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {runs.map((run, i) => {
                            const date = new Date(run.created_at).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            });

                            const manualData = run.raw_data?.manual_data;
                            const dist = manualData?.distance_km ? `${manualData.distance_km} km` : 'Strava Sync';
                            const pace = manualData?.calculated_pace || 'Analyzed Data';
                            const type = manualData?.type || 'Imported Run';

                            return (
                                <div key={run.id || i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-blue-500/50 transition-colors group flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center text-gray-400 text-xs font-mono bg-gray-800/80 px-2 py-1 rounded">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {date}
                                        </div>
                                        <div className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded capitalize">
                                            {run.mode === 'manual' ? type : 'Strava JSON'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-6 bg-gray-800/30 p-4 rounded-xl border border-gray-800">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Distance</span>
                                            <span className="text-white font-bold text-lg">{dist}</span>
                                        </div>
                                        <div className="h-8 w-px bg-gray-700"></div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Pace</span>
                                            <span className="text-blue-400 font-mono font-bold text-lg">{pace}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 mt-auto">
                                        <h4 className="text-sm font-bold text-white mb-2 flex items-center">
                                            <Play className="w-3 h-3 text-blue-500 mr-2" fill="currentColor" />
                                            AI Coach Verdict:
                                        </h4>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                                            {run.ai_analysis}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
