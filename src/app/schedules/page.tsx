import SchedulesDash from "@/components/SchedulesDash";

export const metadata = {
    title: "Schedules & Overview | Running Analyzer",
};

export default function SchedulesPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto pt-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-4 tracking-tight">
                        Schedules & Activity
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Track upcoming goals, manage custom fitness activities, and view your mileage trend.
                    </p>
                </div>

                <div className="space-y-12">
                    <SchedulesDash />
                </div>
            </div>
        </div>
    );
}
