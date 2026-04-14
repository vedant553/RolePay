"use client";
import React, { useState } from "react";
import { Download, X } from "lucide-react";

export function ExportModal({ open, onClose, onSuccess }: { open: boolean, onClose: () => void, onSuccess: (format: string) => void }) {
  const [format, setFormat] = useState("xlsx");
  const [scope, setScope] = useState("filtered");
  const [isExporting, setIsExporting] = useState(false);

  if (!open) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onSuccess(format);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
         <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f172b]">Export Payroll Data</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f1f5f9] rounded-md text-[#64748b]">
            <X className="size-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
           <div>
              <label className="block text-[12px] font-bold text-[#64748b] mb-2 uppercase tracking-wide">Data Scope</label>
               <select value={scope} onChange={(e) => setScope(e.target.value)} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px]">
                 <option value="filtered">Currently Filtered Data</option>
                 <option value="all">Entire Employee Database</option>
               </select>
           </div>
           <div>
              <label className="block text-[12px] font-bold text-[#64748b] mb-2 uppercase tracking-wide">Output Format</label>
               <div className="flex gap-3">
                 {["xlsx", "csv", "pdf"].map(f => (
                   <button key={f} onClick={() => setFormat(f)} className={`flex-1 py-2 text-[14px] font-bold uppercase rounded-lg border transition-all ${format === f ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]" : "border-[#e2e8f0] text-[#64748b]"}`}>
                      {f}
                   </button>
                 ))}
               </div>
           </div>
        </div>

         <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3 bg-[#f8fafc]">
            <button onClick={onClose} className="px-4 py-2 hover:bg-[#e2e8f0] rounded-lg text-[14px] font-bold text-[#64748b]">Cancel</button>
            <button 
              onClick={handleExport} disabled={isExporting}
              className="px-6 py-2 bg-[#10b981] hover:bg-[#0ea370] text-white rounded-lg text-[14px] font-bold flex items-center gap-2"
            >
               {isExporting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="size-4" />}
               {isExporting ? "Generating..." : "Export"}
            </button>
        </div>
      </div>
    </div>
  );
}
