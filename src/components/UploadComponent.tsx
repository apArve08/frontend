"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";

export default function UploadComponent() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze-meal`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to analyze meal");
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
        <div className="w-full max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl shadow-orange-500/10">
            <h2 className="text-2xl font-bold text-white mb-6">Meal Analysis</h2>

            {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer bg-gray-800/50 hover:bg-gray-800 hover:border-orange-500 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 mb-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
                        <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold text-white">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
            ) : (
                <div className="space-y-6">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center border border-gray-700">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="object-contain w-full h-full" />
                        ) : (
                            <ImageIcon className="w-16 h-16 text-gray-600" />
                        )}
                        <button
                            onClick={() => {
                                setFile(null);
                                setPreviewUrl(null);
                                setResult(null);
                            }}
                            className="absolute top-4 right-4 bg-gray-900/80 text-white p-2 text-xs rounded-lg hover:bg-red-500 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Analyzing Meal...
                            </>
                        ) : (
                            "Get AI Insights"
                        )}
                    </button>
                </div>
            )}

            {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="bg-orange-500 w-2 h-6 rounded-full mr-3 text-transparent">-</span>
                        Nutritional AI Insights
                    </h3>
                    <div className="bg-gray-800 rounded-xl p-6 text-gray-300 border border-gray-700 leading-relaxed whitespace-pre-wrap">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
