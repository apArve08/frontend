import RunForm from "@/components/RunForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "New Run Analysis | Running Analyzer",
};

export default function NewRunPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto pt-6">
                <Link href="/analyze-run" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Run Dashboard
                </Link>
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-4 tracking-tight">
                        Run Data Analysis
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Enter your manual run data or upload a Strava JSON export to get AI-powered insights.
                    </p>
                </div>

                <RunForm />
            </div>
        </div>
    );
}
