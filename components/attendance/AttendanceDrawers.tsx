"use client";
import React from "react";
import { X, CheckCircle, AlertOctagon, User, Clock, Check, Info } from "lucide-react";

export function AnomalyDrawer({ open, onClose, anomaly, onResolve }: any) {
  if (!open || !anomaly) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-50 transform transition-transform overflow-y-auto flex flex-col border-l border-[#e2e8f0]">
        
        <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10 transition-colors">
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {anomaly.employee.substring(0, 2).toUpperCase()}
             </div>
             <div>
                <h2 className="text-[16px] font-bold text-[#0f172b] leading-tight pr-4">{anomaly.employee}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-[11px] text-[#64748b] font-mono">ID: {anomaly.id}</p>
                   <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${anomaly.resolvedStatus === "Auto-Resolved" ? "bg-[#d1fae5] text-[#065f46]" : anomaly.resolvedStatus === "Rejected" ? "bg-red-100 text-red-700" : "bg-[#fef3c7] text-[#92400e]"}`}>{anomaly.resolvedStatus}</span>
                </div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-md text-[#64748b] transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
           <div className={`border rounded-xl p-4 ${anomaly.risk==="High" ? "bg-[#fef2f2] border-[#fecaca]" : anomaly.risk==="Medium" ? "bg-[#fffbeb] border-[#fcd34d]" : "bg-[#ecfdf5] border-[#a7f3d0]"}`}>
              <div className="flex items-center gap-2 mb-2">
                 <AlertOctagon className={`size-4 ${anomaly.risk==="High" ? "text-red-500" : anomaly.risk==="Medium" ? "text-amber-500" : "text-[#10b981]"}`} />
                 <h3 className={`text-[12px] font-bold uppercase tracking-wider ${anomaly.risk==="High" ? "text-red-600" : anomaly.risk==="Medium" ? "text-amber-600" : "text-[#059669]"}`}>Detected Flag ({anomaly.risk} Risk)</h3>
              </div>
              <p className="font-bold text-[#0f172b] text-[14px] leading-relaxed">{anomaly.issue}</p>
           </div>
           
           <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-1.5"><Info className="size-3.5"/> AI Intelligence Logic</h3>
              <ul className="text-[13px] text-[#475569] space-y-2 list-disc pl-4 marker:text-[#10b981]">
                 <li>Employee pattern historically averages exactly 40.0 hours mapping over 90 sequential days natively.</li>
                 <li>Current week payload registers 62.4 hours logged simultaneously across multiple remote geolocation IPs.</li>
                 <li>Algorithm confidence rating: <span className="font-bold text-[#f59e0b]">94% Critical Variance Alert</span>.</li>
              </ul>
           </div>

           <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3">Target Node Meta</h3>
              <div className="space-y-4 text-[13px]">
                 <div className="flex justify-between items-center"><span className="text-[#64748b] font-medium flex items-center gap-1.5"><User className="size-3.5"/> Structural Dept:</span><span className="font-bold text-[#0f172b]">Engineering Subnet</span></div>
                 <div className="flex justify-between items-center"><span className="text-[#64748b] font-medium flex items-center gap-1.5"><Clock className="size-3.5"/> Exact Range:</span><span className="font-bold text-[#0f172b]">Mar 12 - Mar 14</span></div>
              </div>
           </div>
        </div>

        <div className="p-5 border-t border-[#e2e8f0] bg-[#f8fafc] flex gap-3">
           <button disabled={anomaly.resolvedStatus !== "Action Required"} onClick={() => {onClose(); onResolve(anomaly.id, "Rejected"); }} className="flex-[0.6] py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 flex justify-center items-center">
             Reject Matrix
           </button>
           <button disabled={anomaly.resolvedStatus !== "Action Required"} onClick={() => {onClose(); onResolve(anomaly.id, "Auto-Resolved"); }} className="flex-1 py-2.5 bg-[#10b981] text-white rounded-lg text-[13px] font-bold hover:bg-[#0ea872] shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
             <CheckCircle className="size-4" /> {anomaly.resolvedStatus !== "Action Required" ? "Ledger Secured" : "Resolve AI Overlaps"}
           </button>
        </div>
      </div>
    </>
  );
}
