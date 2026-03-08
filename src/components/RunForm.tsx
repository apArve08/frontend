"use client";

import { useState } from "react";
import { Activity, Loader2, FileJson, Route, Clock, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RunForm() {
    const [mode, setMode] = useState<"manual" | "json">("manual");

    // Manual inputs
    const [distance, setDistance] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [runType, setRunType] = useState<string>("easy");
    const [notes, setNotes] = useState<string>("");

    // JSON input
    const [jsonInput, setJsonInput] = useState("");

    // State
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Auto pace calculation helper
    const calculatePace = (distKm: string, timeMin: string) => {
        const d = parseFloat(distKm);
        const t = parseFloat(timeMin);
        if (d > 0 && t > 0) {
            const paceDec = t / d;
            const minutes = Math.floor(paceDec);
            const seconds = Math.round((paceDec - minutes) * 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
        }
        return "--:--/km";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let payload = {};

        if (mode === "json") {
            if (!jsonInput.trim()) return;
            try {
                payload = { strava_json: JSON.parse(jsonInput) };
            } catch {
                setError("Invalid JSON format. Please ensure you copied the Strava export correctly.");
                return;
            }
        } else {
            if (!distance || !time) {
                setError("Please fill in both distance and time.");
                return;
            }
            payload = {
                manual_data: {
                    distance_km: parseFloat(distance),
                    time_minutes: parseFloat(time),
                    calculated_pace: calculatePace(distance, time),
                    type: runType,
                    notes: notes
                }
            };
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const response = await fetch(`${apiUrl}/analyze-run`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze run data");
            }

            const data = await response.json();
            setResult(data.analysis);

            // Save to Supabase
            try {
                const { error: dbError } = await supabase
                    .from('runs')
                    .insert([{
                        mode,
                        raw_data: payload,
                        ai_analysis: data.analysis
                    }]);
                if (dbError) console.error("Supabase insert error:", dbError);
            } catch (dbErr) {
                console.error("Supabase save failed:", dbErr);
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An error occurred");
            } else {
                setError("An error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl shadow-blue-500/10 mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <Activity className="w-8 h-8 mr-3 text-blue-500" />
                    Analyze Your Run
                </h2>
                <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setMode("manual")}
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors ${mode === "manual" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        Manual Entry
                    </button>
                    <button
                        onClick={() => setMode("json")}
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors ${mode === "json" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        Strava JSON
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {mode === "manual" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                <Route className="w-4 h-4 mr-1" /> Distance (km)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. 5.0"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-1" /> Time (minutes)
                            </label>
                            <input
                                type="number"
                                step="any"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. 25.5"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2 bg-gray-800/50 p-3 rounded-xl border border-gray-700 flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Estimated Pace:</span>
                            <span className="text-blue-400 font-mono font-bold text-lg">{calculatePace(distance, time)}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                <Activity className="w-4 h-4 mr-1" /> Run Type
                            </label>
                            <select
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                                value={runType}
                                onChange={(e) => setRunType(e.target.value)}
                            >
                                <option value="easy">Easy Base Run</option>
                                <option value="tempo">Tempo / Threshold</option>
                                <option value="interval">Intervals / Speedwork</option>
                                <option value="long">Long Run</option>
                                <option value="recovery">Recovery Jog / Walk</option>
                                <option value="race">Race</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                <Zap className="w-4 h-4 mr-1" /> How did it feel? (Optional notes)
                            </label>
                            <textarea
                                className="w-full h-24 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                placeholder="Felt heavy today, weather was humid..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Paste Strava JSON Export
                        </label>
                        <div className="relative">
                            <textarea
                                className="w-full h-48 bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder='{\n  "distance": 10000,\n  "moving_time": 3600,\n  ... \n}'
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                            />
                            <FileJson className="absolute top-4 right-4 w-6 h-6 text-gray-600 pointer-events-none" />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || (mode === "manual" ? (!distance || !time) : !jsonInput.trim())}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing Performance...
                        </>
                    ) : (
                        "Generate AI Insights"
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="bg-blue-500 w-2 h-6 rounded-full mr-3 text-transparent">-</span>
                        AI Coach Analysis
                    </h3>
                    <div className="bg-gray-800 rounded-xl p-6 text-gray-300 border border-gray-700 leading-relaxed whitespace-pre-wrap">
                        {result}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => {
                                setResult(null);
                                setDistance("");
                                setTime("");
                                setNotes("");
                                setJsonInput("");
                            }}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center"
                        >
                            Log Another Run
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
