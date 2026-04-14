"use client";
import React, { useState } from "react";
import { Settings, X } from "lucide-react";

export function OverrideModal({ open, onClose, onSubmit, employee }: { open: boolean, onClose: () => void, onSubmit: (val: any) => void, employee: any }) {
  const [val, setVal] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open || !employee) return null;

  const handleSubmit = () => {
    if(!val || !reason) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmit({ val, reason });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
         <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0f172b]">Override Payroll</h2>
            <p className="text-[12px] text-[#64748b]">Target: {employee.name} ({employee.id})</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#f1f5f9] rounded-md text-[#64748b]">
            <X className="size-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
           <div>
              <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Adjustment Amount (+ / -)</label>
               <input type="text" value={val} onChange={e=>setVal(e.target.value)} placeholder="e.g. +500 or -200" className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:border-[#10b981] outline-none" />
           </div>
           <div>
              <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Override Reason</label>
               <select value={reason} onChange={e=>setReason(e.target.value)} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px]">
                 <option value="">Select official reason</option>
                 <option value="Attendance deduction">Attendance deduction</option>
                 <option value="Performance bonus">Performance bonus</option>
                 <option value="Retroactive adjustment">Retroactive adjustment</option>
                 <option value="Manual exception">Manual exception</option>
               </select>
           </div>
        </div>

         <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3 bg-[#f8fafc]">
            <button onClick={onClose} className="px-4 py-2 hover:bg-[#e2e8f0] rounded-lg text-[14px] font-bold text-[#64748b]">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting || !val || !reason} className="px-6 py-2 bg-[#10b981] disabled:opacity-50 text-white rounded-lg text-[14px] font-bold flex items-center gap-2">
               {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Authorize Override"}
            </button>
        </div>
      </div>
    </div>
  );
}
