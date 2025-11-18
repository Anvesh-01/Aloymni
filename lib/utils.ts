import { runImport } from "@/utils/clerk-ids";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractCSV(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Send the csv file to the server for processing
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        body: formData,
      });

      
      if (!response.ok) {
        const error = await response.json();
        reject(new Error(error.error || 'Failed to process CSV'));
        return;
      }

      const result = await response.json();
      resolve(JSON.stringify(result));
    } catch (error: any) {
      console.error('❌ CSV processing failed:', error);
      reject(new Error(`CSV processing failed: ${error.message}`));
    }
  });
}