import HealthDashboard from "@/components/HealthDashboard";

export const metadata = {
    title: "Health Checker | Running Analyzer",
};

export default function HealthCheckerPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto pt-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4 tracking-tight">
                        Athlete Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Track your performance metrics, mileage load, and physical recovery.
                    </p>
                </div>

                <HealthDashboard />
            </div>
        </div>
    );
}
