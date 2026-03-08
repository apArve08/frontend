"use client";

import { useEffect, useState } from "react";
import { HeartPulse, Award, TrendingUp, Activity, AlertCircle, RefreshCw } from "lucide-react";

interface HealthData {
    vo2_max_estimate: number;
    weekly_mileage: string;
    recovery_score: number;
    insights: string;
}

export default function HealthDashboard() {
    const [data, setData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const response = await fetch(`${apiUrl}/health-summary`);
            if (!response.ok) throw new Error("Failed to fetch health data");
            const result = await response.json();
            setData(result);
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

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center h-64 border border-gray-800 rounded-xl bg-gray-900 border-dashed">
                <RefreshCw className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-500">
                <AlertCircle className="w-6 h-6 mr-3" />
                {error || "No data available."}
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <h2 className="text-2xl font-bold flex items-center text-white">
                    <HeartPulse className="w-8 h-8 text-green-500 mr-3" />
                    Health & Metrics
                </h2>
                <button onClick={fetchData} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* VO2 Max */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden group hover:border-green-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-green-500 group-hover:opacity-10 transition-opacity">
                        <TrendingUp strokeWidth={3} size={84} />
                    </div>
                    <p className="text-gray-400 font-medium mb-1 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" /> V02 Max Estimate
                    </p>
                    <div className="text-5xl font-extrabold text-white mt-4">{data.vo2_max_estimate}</div>
                    <div className="mt-4 flex items-center">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold font-mono">Top 15%</span>
                    </div>
                </div>

                {/* Weekly Mileage */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-yellow-500 group-hover:opacity-10 transition-opacity">
                        <Activity strokeWidth={3} size={84} />
                    </div>
                    <p className="text-gray-400 font-medium mb-1 flex items-center">
                        <Activity className="w-4 h-4 mr-2" /> Weekly Mileage
                    </p>
                    <div className="text-5xl font-extrabold text-white mt-4">{data.weekly_mileage}</div>
                    <div className="mt-4 flex items-center">
                        <span className="text-yellow-400 text-sm font-semibold">+12% vs last week</span>
                    </div>
                </div>

                {/* Recovery Score */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-purple-500 group-hover:opacity-10 transition-opacity">
                        <Award strokeWidth={3} size={84} />
                    </div>
                    <p className="text-gray-400 font-medium mb-1 flex items-center">
                        <Award className="w-4 h-4 mr-2" /> Recovery Score
                    </p>
                    <div className="text-5xl font-extrabold text-white mt-4">{data.recovery_score}<span className="text-xl text-gray-500">/100</span></div>
                    <div className="mt-4 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-purple-500 h-2 rounded-full w-[85%]"></div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-3">AI Coach Insights</h3>
                <p className="text-gray-300 leading-relaxed font-medium bg-gray-800 p-4 rounded-xl border border-gray-700">
                    {data.insights}
                </p>
            </div>
        </div>
    );
}
