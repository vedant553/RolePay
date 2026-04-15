"use client";

import { CheckCircle, AlertTriangle, ChevronRight, TrendingUp, RefreshCw, Lock, AlertCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import RiskBar from "@/components/ui/RiskBar";
import { usePayroll } from "@/lib/context/PayrollContext";
import { useState } from "react";

const auditEvents = [
  { time: "09:00 AM", event: "Bank feed logic requested natively across subset.", type: "info" as const },
  { time: "09:15 AM", event: "AI mathematical bounds initialized for cross-referencing.", type: "info" as const },
  { time: "09:22 AM", event: "Target USA subset closed accurately at 100%.", type: "success" as const },
  { time: "09:31 AM", event: "EU Subset returned artificial flag due to structural float offset.", type: "warning" as const },
  { time: "09:45 AM", event: "APAC endpoints resolved independently natively securely.", type: "success" as const },
];

export default function ReconciliationPage() {
  const { status, entities, metrics, resolveReconciliation, lockPayroll, bulkResolveReconciliation } = usePayroll();
  const [refreshing, setRefreshing] = useState(false);

  const matched = entities.filter((r) => r.reconciliationStatus === "matched").length;
  const totalVariances = entities.reduce((acc, e) => e.reconciliationStatus === "review" ? acc + e.variance : acc, 0);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="pb-20">
      <div className="flex items-center gap-2 text-[12px] text-[#90a1b9] mb-4">
        <Link href="/payroll-run" className="hover:text-[#10b981]">Payroll Run</Link>
        <ChevronRight className="size-3" strokeWidth={2} />
        <span className="text-[#0f172b] font-bold">Banking Validation Hooks</span>
      </div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172b] mb-2">Automated Meta Reconciliation</h1>
          <p className="text-[#62748e] text-[14px]">Mathematical bank ledger validation scaling universally comparing payload floats.</p>
        </div>
        <div className="flex items-center gap-2">
          {status === "reconciliation" && matched !== entities.length && (
             <button onClick={bulkResolveReconciliation} className="flex items-center gap-2 bg-white border border-[#10b981]/40 text-[#10b981] hover:bg-[#ecfdf5] transition-colors font-bold text-[14px] px-4 py-2.5 rounded-xl shadow-sm mr-2">
                 <ShieldCheck className="size-4"/> Force Global Ledger Match
             </button>
          )}
          <button onClick={handleRefresh} disabled={refreshing || status !== "reconciliation"} className="flex items-center gap-2 bg-white border border-[#e2e8f0] text-[#0f172b] font-bold text-[14px] px-4 py-2.5 rounded-xl hover:bg-[#f8fafc] shadow-sm disabled:opacity-50">
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} strokeWidth={2} /> {refreshing ? "Crawling..." : "Sync Float Sandbox"}
          </button>
          
          <Link href="/payroll-run/reporting"><button disabled={matched !== entities.length || status === "locked" || status === "draft" || status === "processing" || status === "approval" || status === "disbursement"} className="ml-2 flex items-center gap-2 bg-[#10b981] text-white font-bold text-[14px] px-6 py-2.5 rounded-xl hover:bg-[#059669] shadow-sm disabled:opacity-50 transition-colors">
            {status==="locked"?<><Lock className="size-4"/> Mathematical Result Secured</>:"Proceed To Finalizing Node"}
          </button></Link>
        </div>
      </div>

      {status === "reconciliation" && matched !== entities.length && (
         <div className="bg-amber-100 border border-amber-300 text-amber-800 px-5 py-4 rounded-xl mb-6 shadow-sm flex items-start gap-4">
            <AlertTriangle className="size-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
               <p className="font-bold text-[14px] mb-1">Warning: Unresolved Float Variance Active</p>
               <p className="text-[13px]">We discovered an anomaly delta. The API returned a bank float structure mismatching internal data completely precisely scaling exactly <span className="font-bold font-mono text-amber-900 border-b border-amber-900/50 leading-tight block mt-1 w-fit">${totalVariances.toLocaleString("en-US")}</span>. This prevents closing and producing tax files seamlessly. A human logic override is expected below immediately!</p>
            </div>
         </div>
      )}

      {status === "draft" || status === "processing" || status === "approval" || status === "disbursement" ? (
         <div className="bg-white border rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
            <Lock className="size-16 text-[#e2e8f0] mb-4" />
            <p className="font-bold text-[#0f172b] text-[18px]">Ledger Sync Awaiting Complete Disbursement Closure</p>
            <p className="text-[#64748b] text-[14px] max-w-sm mt-2 font-medium">Reconciliation structurally cannot start generating safely without finalized transaction array returns completely. Ensure the preceding logic closes securely!</p>
         </div>
      ) : (
         <>
            {/* Summary Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Target Sync Check Nodes", value: `${matched}/${entities.length} Nodes`, sub: "Successfully tethered globally", icon: TrendingUp, color: "bg-[#10b981]" },
                { label: "Absolute Array Tied", value: `$${metrics.totalNet.toLocaleString("en-US", {maximumFractionDigits:0})}`, sub: "Actual mapped result logic", icon: CheckCircle, color: "bg-[#3b82f6]" },
                { label: "Live System Float Variance", value: `$${totalVariances.toLocaleString("en-US", {minimumFractionDigits:2})}`, sub: "Tethered mapping diff calculated", icon: AlertTriangle, color: totalVariances > 0 ? "bg-[#ef4444]" : "bg-[#10b981]" },
                { label: "Manual Interventions Left", value: `${entities.length - matched} Flagged`, sub: "Awaiting database overrides", icon: AlertCircle, color: matched===entities.length ? "bg-[#10b981]" : "bg-[#ef4444]" },
              ].map((card, i) => (
                <div key={i} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`${card.color} rounded-xl size-10 flex items-center justify-center mb-4`}>
                    <card.icon className="size-5 text-white" strokeWidth={1.75} />
                  </div>
                  <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">{card.label}</p>
                  <p className="text-[24px] font-bold text-[#0f172b] mb-0.5 tracking-tight">{card.value}</p>
                  <p className="text-[11px] text-[#94a3b8] font-medium">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Bank Matching Table */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm mb-6">
              <div className="px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
                <h2 className="font-bold text-[#0f172b] text-[16px]">Core Meta Ledger Entity Validation</h2>
              </div>
              <table className="w-full">
                <thead className="bg-[#f1f5f9] border-b border-[#e2e8f0]">
                  <tr>
                    {["Entity Routing Subset", "Bank Level API Float Matrix", "Core Network Disbursement Math", "Absolute Raw Variance", "Ledger Validation Status", "Control Hooks"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[11px] font-bold text-[#64748b] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {entities.map((item) => (
                    <tr key={item.name} className={`hover:bg-[#f8fafc] transition-colors ${item.reconciliationStatus === "review" ? "bg-red-50/40" : ""}`}>
                      <td className="px-6 py-4 font-bold text-[14px] text-[#0f172b] tracking-tight">{item.name}</td>
                      <td className="px-6 py-4 text-[14px] text-[#475569] font-mono">${(item.net - (item.reconciliationStatus==="review"?item.variance:0)).toLocaleString("en-US", {minimumFractionDigits:2})}</td>
                      <td className="px-6 py-4 text-[14px] text-[#475569] font-mono">${item.net.toLocaleString("en-US", {minimumFractionDigits:2})}</td>
                      <td className={`px-6 py-4 text-[14px] font-bold font-mono ${item.reconciliationStatus === "matched" ? "text-[#10b981]" : "text-[#ef4444]"}`}>${(item.reconciliationStatus==="review"?item.variance:0).toLocaleString("en-US", {minimumFractionDigits:2})}</td>
                      <td className="px-6 py-4">
                        {item.reconciliationStatus === "matched" ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#d1fae5] text-[#065f46] border border-[#10b981]/20 px-2.5 py-1 rounded-md text-[12px] font-bold">
                            <CheckCircle className="size-3" strokeWidth={2.5} /> Matched Safely Natively
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1 items-start">
                             <span className="inline-flex items-center gap-1.5 bg-[#fee2e2] text-[#991b1b] border border-[#ef4444]/20 px-2.5 py-1 rounded-md text-[12px] font-bold shadow-sm">
                               <AlertTriangle className="size-3" strokeWidth={2} /> Check Logic Required Array Broken
                             </span>
                             <p className="text-[10px] text-red-600 font-bold mt-1 bg-white px-1 py-0.5 rounded border border-red-100 uppercase tracking-widest w-fit">Reason: API Bank Return Shortage Meta Data Drop!</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.reconciliationStatus === "review" && (
                           <button onClick={() => resolveReconciliation(item.name)} className="bg-red-600 text-white font-bold text-[12px] px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-[transform,colors] active:scale-95">Accept & Override Meta Float</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Compliance Panel */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-[#0f172b] text-[16px] mb-5 border-b pb-4">Real-time Integrity Logic Parameters</h3>
                <div className="space-y-5 mt-4">
                  <RiskBar label="Mathematical Socket Match Rate Array Consistency" value={matched === entities.length ? 100 : 96} variant={matched === entities.length ? "green" : "amber"} />
                  <RiskBar label="Volume Compliance Bank Logic Scaling Ratio" value={98} variant="green" />
                  <RiskBar label="Native Thread Sandbox Data Check Integrity" value={100} variant="green" />
                </div>
              </div>

              {/* Audit Timeline */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-[#0f172b] text-[16px] mb-5 border-b pb-4">Native Ledger Internal System Triggers</h3>
                <div className="space-y-4 mt-4">
                  {auditEvents.map((event, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`size-2.5 rounded-full mt-1.5 shrink-0 shadow-sm ${event.type === "success" ? "bg-[#10b981]" : event.type === "warning" ? "bg-[#f59e0b]" : "bg-[#3b82f6]"}`} />
                      <div className="flex-1">
                        <p className="text-[11px] text-[#94a3b8] font-bold tracking-widest mb-0.5 uppercase">{event.time}</p>
                        <p className="text-[13px] text-[#0f172b] font-medium leading-relaxed">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
         </>
      )}
    </div>
  );
}
