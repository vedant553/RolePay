"use client";
import React, { useState } from "react";
import { PlayCircle, X } from "lucide-react";

export function RunPayrollModal({ open, onClose, onSuccess, context }: { open: boolean, onClose: () => void, onSuccess: () => void, context: "bulk" | "individual" | null }) {
  const [running, setRunning] = useState(false);

  if (!open) return null;

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
         <div className="px-6 py-4 border-b border-[#e2e8f0] flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xl font-bold text-[#0f172b]">Confirm Payroll Run</h2>
              <button onClick={onClose} className="p-1 hover:bg-[#f1f5f9] rounded-md text-[#64748b]">
                <X className="size-5" />
              </button>
            </div>
            <p className="text-[12px] text-[#64748b]">Cycle: February 2026</p>
         </div>
         
         <div className="p-6">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 flex flex-col items-center justify-center text-center">
               <p className="text-[13px] font-bold text-[#0f172b] mb-1">
                 {context === "bulk" ? "Global Dispersal" : "Individual Dispersal"}
               </p>
               <p className="text-[11px] text-[#64748b]">
                 {context === "bulk" ? "Initiating for exactly 248 verified profiles." : "Bypassing standard queue for chosen profile."}
               </p>
            </div>
            <p className="text-[12px] mt-4 text-[#ef4444] font-medium flex items-center gap-1.5 justify-center">
              *Irreversible ledger commit sequence.
            </p>
         </div>

         <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center gap-3">
             <button onClick={onClose} disabled={running} className="flex-1 py-2 hover:bg-[#e2e8f0] border border-[#e2e8f0] rounded-lg text-[14px] font-bold text-[#64748b]">Cancel</button>
             <button onClick={handleRun} disabled={running} className="flex-1 py-2 bg-[#10b981] hover:bg-[#0ea370] text-white rounded-lg text-[14px] font-bold flex justify-center items-center gap-2">
                 {running ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PlayCircle className="size-4" />}
                 {running ? "Processing..." : "Commit Run"}
             </button>
         </div>
      </div>
    </div>
  );
}
