"use client";

import { useState } from "react";
import { Activity, Loader2, FileJson } from "lucide-react";

export default function RunForm() {
    const [jsonInput, setJsonInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jsonInput.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        let parsedJson;
        try {
            parsedJson = JSON.parse(jsonInput);
        } catch (err) {
            setError("Invalid JSON format. Please ensure you copied the Strava export correctly.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze-run`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ strava_json: parsedJson }),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze run data");
            }

            const data = await response.json();
            setResult(data.analysis);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl shadow-blue-500/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Activity className="w-8 h-8 mr-3 text-blue-500" />
                Analyze Your Run
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Paste Strava JSON Export
                    </label>
                    <div className="relative">
                        <textarea
                            className="w-full h-48 bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder='{\n  "distance": 10000,\n  "moving_time": 3600,\n  "average_speed": 2.77,\n  "total_elevation_gain": 50,\n  ... \n}'
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                        />
                        <FileJson className="absolute top-4 right-4 w-6 h-6 text-gray-600 pointer-events-none" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        Export a recent run from Strava API or web inspector and paste the JSON payload here.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading || !jsonInput.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing Pace & Fatigue...
                        </>
                    ) : (
                        "Generate Performance Insights"
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="bg-blue-500 w-2 h-6 rounded-full mr-3 text-transparent">-</span>
                        Running AI Analysis
                    </h3>
                    <div className="bg-gray-800 rounded-xl p-6 text-gray-300 border border-gray-700 leading-relaxed whitespace-pre-wrap">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
