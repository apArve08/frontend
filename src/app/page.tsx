import Link from "next/link";
import { Activity, Apple, HeartPulse, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto pt-20">
        <div className="text-center mb-20 space-y-6">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 tracking-tighter">
            Running Analyzer
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            AI-powered performance insights, Malaysian-context meal tracking, and comprehensive health metrics for serious runners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Run Analyzer */}
          <Link href="/analyze-run" className="group block">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-full transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Activity size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Run Analyzer</h2>
              <p className="text-gray-400 mb-6 text-sm">
                Upload your Strava JSON data. Get AI insights on pace trends, fatigue detection, and training load.
              </p>
              <div className="flex items-center text-blue-500 font-semibold text-sm">
                Start Analysis &rarr;
              </div>
            </div>
          </Link>

          {/* Meal AI */}
          <Link href="/analyze-meal" className="group block">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-full transition-all duration-300 hover:scale-105 hover:border-orange-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Apple size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Meal AI</h2>
              <p className="text-gray-400 mb-6 text-sm">
                Snap a photo of your Nasi Lemak or Roti Canai. Get instant nutritional breakdown & recovery advice.
              </p>
              <div className="flex items-center text-orange-500 font-semibold text-sm">
                Analyze Meal &rarr;
              </div>
            </div>
          </Link>

          {/* Health Checker */}
          <Link href="/health-checker" className="group block">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-full transition-all duration-300 hover:scale-105 hover:border-green-500 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)]">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <HeartPulse size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Athlete Profile</h2>
              <p className="text-gray-400 mb-6 text-sm">
                Track your VO2 Max, weekly mileage, and recovery score. Generate personalized fitness/meal plans.
              </p>
              <div className="flex items-center text-green-500 font-semibold text-sm">
                View Dashboard &rarr;
              </div>
            </div>
          </Link>

          {/* Schedules */}
          <Link href="/schedules" className="group block">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-full transition-all duration-300 hover:scale-105 hover:border-purple-500 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)]">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Calendar size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Schedules</h2>
              <p className="text-gray-400 mb-6 text-sm">
                Add AI suggested activities, track your calendar, complete tasks, and view your mileage trends.
              </p>
              <div className="flex items-center text-purple-500 font-semibold text-sm">
                Open Calendar &rarr;
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
