import UploadComponent from "@/components/UploadComponent";

export const metadata = {
    title: "Meal AI | Running Analyzer",
};

export default function AnalyzeMealPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto pt-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-4 tracking-tight">
                        Meal Recovery AI
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Upload a photo of your food (e.g., Nasi Lemak, Roti Canai) to get a nutritional breakdown and recovery advice.
                    </p>
                </div>

                <UploadComponent />
            </div>
        </div>
    );
}
