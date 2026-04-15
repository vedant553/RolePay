"use client";

import { Download, ChevronRight, Lock, LayoutDashboard, FileText, ShieldCheck, CheckCircle2, Server, FolderSync } from "lucide-react";
import Link from "next/link";
import { usePayroll } from "@/lib/context/PayrollContext";

export default function PayrollReportingPage() {
  const { status, metrics, resolvedEntities, auditLogs, activeScenarioId, scenarios } = usePayroll();
  const isLocked = status === "locked";
  const scenario = scenarios.find(s=>s.id===activeScenarioId);

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {isLocked ? (
         <div className="bg-[#0f172b] p-8 rounded-2xl shadow-xl flex items-center justify-between border border-slate-700 mb-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
               <Lock className="size-48" />
            </div>
            <div className="relative z-10">
               <h2 className="text-[20px] font-bold text-emerald-400 tracking-tight flex items-center gap-3 mb-2">
                  <CheckCircle2 className="size-6" /> Immutable Output Validated & Sealed
               </h2>
               <p className="text-slate-300 text-[14px] max-w-2xl leading-relaxed">
                  The computational matrix for <strong>{scenario?.name}</strong> has been secured and pushed out to external gateways securely. Traceable variables are frozen to maintain 100% SEC audit compliance logic passively reporting hashes.
               </p>
               <div className="flex gap-4 mt-5">
                  <span className="bg-slate-800 text-slate-300 font-mono text-[11px] px-3 py-1 rounded">TIMESTAMP: {new Date().toUTCString()}</span>
                  <span className="bg-slate-800 text-slate-300 font-mono text-[11px] px-3 py-1 rounded">MATRIX SHA-256 HASH VERIFIED</span>
               </div>
            </div>
         </div>
      ) : (
         <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-sm">
            <Lock className="size-6 text-amber-500 shrink-0" />
            <div>
               <p className="text-[14px] font-bold text-amber-800 mb-1">State Logic Open</p>
               <p className="text-[13px] text-amber-700">These reports represent current draft-computation mathematics and are technically mutable until the sequence is securely locked by an active Finance Controller globally.</p>
            </div>
         </div>
      )}

      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-sm mb-8">
        <h2 className="text-[18px] font-bold text-[#0f172b] mb-6 flex items-center gap-2"><ShieldCheck className="text-[#3b82f6] size-5" /> Executive Cryptographic Audit Outputs</h2>
        <div className="grid grid-cols-2 gap-6">
           <div className="border border-[#e2e8f0] rounded-xl p-5 hover:border-[#3b82f6] transition-colors group">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg group-hover:scale-105 transition-transform"><FileText className="size-5" /></div>
                    <p className="font-bold text-[15px] text-[#0f172b]">Executive Payroll Index Summary</p>
                 </div>
                 <button className="text-[#3b82f6] hover:bg-blue-50 p-2 rounded-full transition-colors"><Download className="size-5" /></button>
              </div>
              <p className="text-[13px] text-[#64748b] leading-relaxed">Aggregated high-level gross, net, and tax float models normalized across global target matrices for external CFO parsing.</p>
              <div className="mt-4 flex gap-2">
                 <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded">PDF FORMATTING</span>
                 <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded">SIGNED ORIGIN</span>
              </div>
           </div>
           
           <div className="border border-[#e2e8f0] rounded-xl p-5 hover:border-[#8b5cf6] transition-colors group">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg group-hover:scale-105 transition-transform"><Server className="size-5" /></div>
                    <p className="font-bold text-[15px] text-[#0f172b]">Immutable Threat Vector Audit Log</p>
                 </div>
                 <button className="text-[#8b5cf6] hover:bg-purple-50 p-2 rounded-full transition-colors"><Download className="size-5" /></button>
              </div>
              <p className="text-[13px] text-[#64748b] leading-relaxed">Extracted JSON log map of {auditLogs.length} action events capturing overrides, sequence bypasses, and multi-team approvals.</p>
              <div className="mt-4 flex gap-2">
                 <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded">JSON LOGS</span>
                 <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded">CRYPTOGRAPHIC SEAL</span>
              </div>
           </div>

           <div className="border border-[#e2e8f0] rounded-xl p-5 hover:border-[#10b981] transition-colors group">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg group-hover:scale-105 transition-transform"><FolderSync className="size-5" /></div>
                    <p className="font-bold text-[15px] text-[#0f172b]">Rule-Based Tax Matrix Map</p>
                 </div>
                 <button className="text-[#10b981] hover:bg-emerald-50 p-2 rounded-full transition-colors"><Download className="size-5" /></button>
              </div>
              <p className="text-[13px] text-[#64748b] leading-relaxed">Compiled structural breakdowns of exactly mapped tax algorithms isolating IRS Federal logic vs EU VAT logic vs India TDS securely.</p>
              <div className="mt-4 flex gap-2">
                 <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded">CSV ARRAY</span>
                 <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded">COMPLIANCE SECURED</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-sm">
         <h2 className="text-[16px] font-bold text-[#0f172b] mb-4 border-b border-[#e2e8f0] pb-4">Internal Global Accounting Metrics Validation</h2>
         <div className="space-y-4">
            <div className="flex justify-between text-[14px]">
               <span className="text-[#64748b] font-medium">Aggregated Mathematical Gross Array Limit:</span>
               <span className="font-bold text-[#0f172b] font-mono">${metrics.totalGross.toLocaleString("en-US")}</span>
            </div>
            <div className="flex justify-between text-[14px]">
               <span className="text-[#64748b] font-medium">Aggregated Tax Traceability Value:</span>
               <span className="font-bold text-red-600 font-mono">-${metrics.totalTax.toLocaleString("en-US")}</span>
            </div>
            <div className="flex justify-between text-[14px]">
               <span className="text-[#64748b] font-medium">Aggregated Deduction Parameter Trace:</span>
               <span className="font-bold text-red-600 font-mono">-${metrics.totalBenefits.toLocaleString("en-US")}</span>
            </div>
            <div className="flex justify-between text-[16px] bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] mt-4">
               <span className="text-[#0f172b] font-bold uppercase tracking-wider">Final Disbursement Matrix Bound</span>
               <span className="font-bold text-[#10b981] font-mono tracking-tight">${metrics.totalNet.toLocaleString("en-US")}</span>
            </div>
         </div>
         {resolvedEntities.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#e2e8f0] text-[13px] text-[#64748b]">
               <span className="font-bold text-amber-600">Manual Variance Warning:</span> The ledger natively resolves float mismatches for {resolvedEntities.length} targets artificially.
            </div>
         )}
      </div>

      <Link href="/payroll-run">
        <button className="mt-8 text-[#64748b] font-bold text-[13px] hover:text-[#0f172b] transition-colors flex items-center gap-1">
           <ChevronRight className="rotate-180 size-4" /> Return to Decision Dashboard Frame
        </button>
      </Link>
    </div>
  );
}
