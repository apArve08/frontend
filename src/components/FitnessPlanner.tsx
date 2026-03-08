"use client";

import { useState } from "react";
import { Target, Loader2, Dumbbell, HeartPulse } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FitnessPlanner() {
    const [targetVision, setTargetVision] = useState("");
    const [fitnessLevel, setFitnessLevel] = useState("beginner");
    const [healthLevel, setHealthLevel] = useState("");

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!targetVision || !healthLevel) {
            setError("Please fill in all fields to get an accurate plan.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const response = await fetch(`${apiUrl}/generate-plan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    target_vision: targetVision,
                    fitness_level: fitnessLevel,
                    health_level: healthLevel
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.detail || "Failed to generate plan");
            }

            const data = await response.json();
            setResult(data.plan);

            // Save to Supabase
            try {
                const { error: dbError } = await supabase
                    .from('fitness_plans')
                    .insert([{
                        target: targetVision,
                        fitness_level: fitnessLevel,
                        health_level: healthLevel,
                        plan: data.plan
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
        <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden mt-8">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500 pointer-events-none">
                <Target size={120} />
            </div>

            <h2 className="text-2xl font-bold flex items-center text-white mb-6">
                <Target className="w-8 h-8 text-indigo-500 mr-3" />
                AI Fitness & Nutrition Planner
            </h2>
            <p className="text-gray-400 mb-8">
                Tell the AI Coach your goals and current health status, and it will generate a personalized fitness activity and meal plan (with Malaysian context) just for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-1" /> What is your Target / Vision?
                    </label>
                    <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="e.g. Lose 5kg in 2 months, Train for a half marathon..."
                        value={targetVision}
                        onChange={(e) => setTargetVision(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                            <Dumbbell className="w-4 h-4 mr-1" /> Current Fitness Level
                        </label>
                        <select
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                            value={fitnessLevel}
                            onChange={(e) => setFitnessLevel(e.target.value)}
                        >
                            <option value="beginner">Beginner (Sedentary / New to exercise)</option>
                            <option value="intermediate">Intermediate (Exercise 2-3 times a week)</option>
                            <option value="advanced">Advanced (Athlete / Exercise 5+ times a week)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                            <HeartPulse className="w-4 h-4 mr-1" /> Health Level / Status
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="e.g. Healthy, slight asthma, knee pain..."
                            value={healthLevel}
                            onChange={(e) => setHealthLevel(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !targetVision || !healthLevel}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-indigo-500/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Drafting your master plan...
                        </>
                    ) : (
                        "Generate Custom Plan"
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="bg-indigo-500 w-2 h-6 rounded-full mr-3 text-transparent">-</span>
                        Your AI Master Plan
                    </h3>
                    <div className="bg-gray-800/80 rounded-xl p-6 text-gray-300 border border-gray-700 leading-relaxed whitespace-pre-wrap shadow-inner overflow-hidden">
                        {result}
                    </div>

                    <div className="mt-8 bg-black/40 p-6 rounded-xl border border-indigo-500/30">
                        <h4 className="font-bold text-white mb-4">Quick Add to Schedule</h4>
                        <p className="text-gray-400 text-sm mb-4">Pick an activity suggested above and add it directly to your upcoming schedule.</p>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const title = formData.get('title') as string;
                            const dist = formData.get('dist') as string;
                            const date = formData.get('date') as string;
                            if (!title || !date) return;

                            await supabase.from('schedules').insert([{
                                title: title,
                                distance_km: Number(dist) || 0,
                                activity_date: date,
                                completed: false
                            }]);

                            alert("Added to schedule successfully!");
                            (e.target as HTMLFormElement).reset();
                        }} className="flex flex-col md:flex-row gap-3">
                            <input name="title" required placeholder="Activity (e.g. 5K easy run)" className="flex-2 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                            <input name="dist" type="number" step="0.1" placeholder="Dist (km)" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                            <input name="date" required type="date" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all">
                                Add
                            </button>
                        </form>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => setResult(null)}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
                        >
                            Create Another Plan
                        </button>
                        <a href="/schedules" className="flex-1 text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all">
                            View My Schedules
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
