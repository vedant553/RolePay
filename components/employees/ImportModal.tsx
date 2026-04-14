"use client";
import React, { useState } from "react";
import { UploadCloud, X, File, CheckCircle } from "lucide-react";

export function ImportModal({ open, onClose, onSuccess }: { open: boolean, onClose: () => void, onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [complete, setComplete] = useState(false);

  if (!open) return null;

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setComplete(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setComplete(false);
        setFile(null);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
         {/* Header */}
         <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f172b]">Import Payroll Data</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f1f5f9] rounded-md text-[#64748b] transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6">
          {!complete ? (
            <>
              <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl bg-[#f8fafc] p-8 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setFile(e.target.files[0])} accept=".csv,.xlsx" />
                <UploadCloud className="size-10 text-[#94a3b8] mb-3" />
                <p className="text-[14px] font-bold text-[#0f172b]">Drag & drop file or click to browse</p>
                <p className="text-[12px] text-[#64748b] mt-1">Supports CSV, XLSX up to 10MB</p>
              </div>

              {file && (
                <div className="mt-4 p-3 border border-[#e2e8f0] bg-white rounded-lg flex items-center gap-3">
                  <File className="size-5 text-[#10b981]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#0f172b] truncate">{file.name}</p>
                    <p className="text-[12px] text-[#64748b]">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <CheckCircle className="size-16 text-[#10b981] mb-4" />
              <h3 className="text-xl font-bold text-[#0f172b]">Import Successful</h3>
              <p className="text-[#64748b] mt-2">Data has been successfully pulled into the staging environment.</p>
            </div>
          )}
        </div>

        {!complete && (
          <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
            <button className="text-[12px] font-bold text-[#10b981] hover:underline">Download Template</button>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 hover:bg-[#e2e8f0] rounded-lg text-[14px] font-bold text-[#64748b]">Cancel</button>
              <button 
                disabled={!file || uploading}
                onClick={handleUpload} 
                className="px-6 py-2 bg-[#10b981] hover:bg-[#0ea370] text-white rounded-lg text-[14px] font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {uploading ? "Importing..." : "Confirm Import"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
