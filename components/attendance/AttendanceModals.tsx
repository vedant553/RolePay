"use client";
import React, { useState } from "react";
import { X, RefreshCw, AlertTriangle, FileText } from "lucide-react";

export function SourceLogModal({ open, onClose, sourceName, onRetry }: any) {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex justify-between items-center bg-[#f8fafc]">
           <div className="flex items-center gap-2">
             <AlertTriangle className="size-5 text-red-500" />
             <h2 className="text-[16px] font-bold text-[#0f172b]">Integration Log: {sourceName}</h2>
           </div>
           <button onClick={onClose} className="hover:bg-slate-200 p-1 rounded transition-colors"><X className="size-5 text-[#64748b]"/></button>
        </div>
        <div className="p-6 bg-[#0f172b] text-green-400 font-mono text-[12px] h-64 overflow-y-auto w-full flex flex-col gap-2 shadow-inner">
           <p className="text-white/50">[{new Date().toISOString()}] Initializing secure connection to {sourceName} API endpoint...</p>
           <p className="text-white/50">[{new Date().toISOString()}] Handshake successful. Access token granted.</p>
           <p className="text-white/50">[{new Date().toISOString()}] Fetching attendance block (chunk_id: 9942)...</p>
           <p className="text-red-400 font-bold">[{new Date().toISOString()}] FATAL: Header timeout. Payload refused (ERR_503) due to structural endpoint failure or rate limits.</p>
           <p className="text-red-400 font-bold">[{new Date().toISOString()}] Sync pipeline aborted locally to prevent corrupted ledger injection.</p>
        </div>
        <div className="px-6 py-4 bg-[#f8fafc] border-t flex justify-end gap-3 items-center">
           <button onClick={onClose} className="px-5 py-2 text-[#64748b] font-bold text-[13px] bg-white border border-[#e2e8f0] hover:bg-slate-50 rounded-lg transition-colors">Dismiss Details</button>
           <button onClick={()=>{ setLoading(true); setTimeout(()=>{setLoading(false); onRetry(); onClose(); }, 2000); }} className="px-5 py-2 bg-red-500 hover:bg-red-600 transition-colors text-white font-bold rounded-lg text-[13px] flex items-center justify-center min-w-[190px] gap-2 shadow-sm">
             {loading ? <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <RefreshCw className="size-4" />}
             {loading ? "Re-establishing bounds..." : "Force Retry Connection"}
           </button>
        </div>
      </div>
    </div>
  );
}
