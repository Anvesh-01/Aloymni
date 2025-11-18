"use client";
import Dragger from "antd/es/upload/Dragger";
import { UploadProps } from "antd";

import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"

type UpProps = {
    onCsvUpload?: (buffer: ArrayBuffer) => void;
    setUploadedCsvName?: (name: string | null) => void;
    onCsvRemove?: () => void;
};

export default function Upload({ onCsvUpload, setUploadedCsvName, onCsvRemove }: UpProps) {
    const [csvName, setCsvName] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const { toast } = useToast();

    const saveFileLocally = (file: File) => {
        // Store file in browser's local storage (for demo purposes)
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                localStorage.setItem('uploadedCsv', reader.result as string);
                localStorage.setItem('uploadedCsvName', file.name);
            }
        };
        reader.readAsDataURL(file);
    };

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            const isCsv = file.type === "text/csv" || file.name.endsWith(".csv");
            if (!isCsv) {
                alert("You can only upload CSV files!");
                toast({
                    variant: "destructive",
                    title: "Upload Error",
                    description: "You can only upload CSV files!",
                });
                return false;
            }

            setCsvName(file.name);
            setUploadedFile(file);
            
            // Save file locally
            saveFileLocally(file);

            if (onCsvUpload) {
                const bufferReader = new FileReader();
                bufferReader.onload = () => {
                    if (bufferReader.result instanceof ArrayBuffer) {
                        onCsvUpload(bufferReader.result);
                    }
                };
                bufferReader.readAsArrayBuffer(file);
            }

            if (setUploadedCsvName) {
                setUploadedCsvName(file.name);
            }

            return false;
        },
        showUploadList: false,
    };

    const handleReset = () => {
        setCsvName(null);
        setUploadedFile(null);
        
        // Remove from local storage
        localStorage.removeItem('uploadedCsv');
        localStorage.removeItem('uploadedCsvName');
        
        if (onCsvRemove) onCsvRemove();
        if (setUploadedCsvName) setUploadedCsvName(null);
    };

    return (
        <div className="flex flex-col items-center justify-center px-4 sm:w-1/3 md:w-1/2  lg:w-2/3 xl:w-1/2 mx-auto my-8">
            <h1 className="text-blue-600 p-2 text-2xl sm:text-3xl md:text-4xl font-bold text-center">Upload CSV</h1>
            {!csvName ? (
            <Dragger {...props} className="w-full sm:w-2/4 h-48 sm:h-64 md:h-3/4 opacity-100" accept=".csv,text/csv">
                <div className="flex flex-col items-center justify-center h-full">
                <p className="text-black p-2 text-sm sm:text-base text-center">Click or drag CSV file here.</p>
                </div>
            </Dragger>
            ) : (
            <div className="relative flex flex-col items-center w-full max-w-md">
                <div className="flex items-center border-2 border-gray-950 rounded-lg bg-white bg-opacity-20 px-4 py-4 sm:py-8 w-full">
                <span className="text-blue-600 text-sm sm:text-base break-all">{csvName}</span>
                </div>
                <button
                onClick={handleReset}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center"
                aria-label="Remove CSV"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                </button>
            </div>
            )}
        </div>
    );
}
