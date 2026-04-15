"use client";

import { CheckCircle, Clock, AlertTriangle, ChevronRight, Download, RefreshCw, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePayroll } from "@/lib/context/PayrollContext";

function StatusBadge({ status }: { status: string }) {
  const config = {
    processed: { bg: "bg-[#d1fae5]", text: "text-[#065f46]" },
    pending: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
    failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  }[status] || { bg: "bg-[#f1f5f9]", text: "text-[#475569]" };

  return (
    <span className={`${config.bg} ${config.text} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold`}>
      {status === "processed" && <CheckCircle className="size-3.5" strokeWidth={2.5} />}
      {status === "pending" && <Clock className="size-3.5" strokeWidth={2.5} />}
      {status === "failed" && <AlertTriangle className="size-3.5" strokeWidth={2.5} />}
      <span className="capitalize">{status}</span>
    </span>
  );
}

export default function DisbursementPage() {
  const { status, metrics, transactions, isProcessing, processDisbursements, retryTransaction, bulkRetryTransactions, setActiveEmployeeId } = usePayroll();

  const processed = transactions.filter((t) => t.status === "processed").length;
  const pending = transactions.filter((t) => t.status === "pending").length;
  const failed = transactions.filter((t) => t.status === "failed").length;

  return (
    <div className="pb-20">
      <div className="flex items-center gap-2 text-[12px] text-[#90a1b9] mb-4">
        <Link href="/payroll-run" className="hover:text-[#10b981]">Payroll Run</Link>
        <ChevronRight className="size-3" strokeWidth={2} />
        <span className="text-[#0f172b] font-bold">Disbursement</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172b] mb-2">Payroll Disbursement Matrix</h1>
          <p className="text-[14px] text-[#62748e]">Automated banking transmission bounds acting across logically scaled subsets.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => alert("Simulation export hook activated!")} className="flex items-center gap-2 bg-white shadow-sm border border-[#e2e8f0] text-[#0f172b] font-bold text-[14px] px-4 py-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors">
             <Download className="size-4" strokeWidth={2} /> Export Manifest
           </button>
           {failed > 0 && status === "reconciliation" && (
             <button onClick={bulkRetryTransactions} className="flex items-center gap-2 bg-white shadow-sm border border-red-200 text-red-600 font-bold text-[14px] px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
               <RefreshCw className="size-4" strokeWidth={2} /> Retry Failed Push
             </button>
           )}
           <button 
             onClick={processDisbursements} 
             disabled={status !== "disbursement" || pending === 0}
             className="flex items-center gap-2 bg-[#3b82f6] shadow-sm text-white font-bold text-[14px] px-6 py-2.5 rounded-xl hover:bg-[#2563eb] transition-colors disabled:opacity-50">
             {isProcessing ? <RefreshCw className="size-4 animate-spin" /> : <Play className="size-4 hidden" />}
             {isProcessing ? "Transmitting Native Packets..." : "Execute Bulk Node Push"}
           </button>
        </div>
      </div>

      {failed > 0 && (
         <div className="bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-xl mb-6 shadow-sm flex items-start gap-4">
            <AlertCircle className="size-6 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
               <p className="font-bold text-[14px] mb-1">Critical Fault: Bank API Timeouts Detected</p>
               <p className="text-[13px] mb-2">There were <span className="font-bold underline">{failed} node failures</span> returning from foreign exchange gateways. The cycle cannot proceed to rigid ledger reconciliation natively until every targeted bank mapping node is addressed or purged from the queue directly below.</p>
            </div>
         </div>
      )}

      {status === "draft" || status === "processing" || status === "approval" ? (
         <div className="bg-white border rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
            <Lock className="size-16 text-[#e2e8f0] mb-4" />
            <p className="font-bold text-[#0f172b] text-[18px]">Upstream Authorization Hooks Required</p>
            <p className="text-[#64748b] text-[14px] max-w-sm mt-2">Disbursement transmission matrix is strictly blocked until all mathematical chains and structural signatures have fired natively securely.</p>
         </div>
      ) : (
         <>
            {/* Status Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Successfully Verified Sockets", count: processed, total: transactions.length, color: "text-[#10b981]", bg: "bg-[#d1fae5]" },
                { label: "Queued for Sandbox Push", count: pending, total: transactions.length, color: "text-[#f59e0b]", bg: "bg-[#fef3c7]" },
                { label: "Timeout API Rejections", count: failed, total: transactions.length, color: "text-[#ef4444]", bg: "bg-[#fee2e2]" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-px">
                  <div className={`${stat.bg} inline-flex items-center px-3 py-1.5 rounded-lg mb-3`}>
                    <span className={`${stat.color} font-bold text-[12px] uppercase tracking-wider`}>{stat.label}</span>
                  </div>
                  <p className={`text-[40px] font-bold ${stat.color} mb-1 tracking-tight`}>{stat.count.toLocaleString("en-US")}</p>
                  <p className="text-[12px] text-[#64748b] font-medium">{stat.total} global target mapping payloads safely detected</p>
                </div>
              ))}
            </div>

            {/* Net Disbursement Card */}
            <div className="bg-[#0f172b] border border-slate-700 rounded-2xl p-6 mb-6 shadow-xl text-white outline outline-1 outline-emerald-900/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-gradient-radial from-emerald-500/20 via-transparent to-transparent opacity-50 blur-xl" />
              <p className="text-white/60 text-[12px] uppercase tracking-wider font-bold mb-1">Normalized Internal Net Meta Result Hook</p>
              <p className="text-[44px] font-bold tracking-tight mb-2">${metrics.totalNet.toLocaleString("en-US", {minimumFractionDigits:2})}</p>
              <p className="text-[#10b981] text-[13px] font-bold uppercase tracking-wider">{metrics.totalEmployees.toLocaleString("en-US")} active network targets globally scaling securely currently tied against {transactions.length} active database float entries natively matching processing ledgers globally mapped parameters strictly.</p>
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
                <h2 className="font-bold text-[#0f172b] text-[16px]">Core Node Transaction Arrays</h2>
                <span className="text-[12px] text-[#64748b] bg-white px-3 py-1.5 rounded-md border font-bold shadow-sm">{transactions.length} target vectors securely tracked</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f1f5f9] border-b border-[#e2e8f0]">
                    <tr>
                      {["Cryptographic Hash ID", "Endpoint Hook Array", "Target Core Ledger", "Native Push Magnitude", "Foreign Check API Status", "Override Protocol"].map((h) => (
                        <th key={h} className="px-6 py-3.5 text-left text-[11px] font-bold text-[#64748b] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-[#f8fafc] transition-colors group">
                        <td className="px-6 py-4 text-[13px] font-mono text-[#94a3b8]">{txn.id}</td>
                        <td className="px-6 py-4">
                           <button onClick={() => setActiveEmployeeId(txn.employeeId)} className="font-bold text-[14px] text-[#0f172b] hover:text-[#3b82f6] hover:underline text-left transition-colors">{txn.employeeName}</button>
                           {txn.status === "failed" && <p className="text-[11px] text-red-500 font-bold tracking-tight mt-1 bg-red-50 w-fit px-1.5 rounded">ERR: DEST_NODE_B9 TIMEOUT BOUND REACHED</p>}
                        </td>
                        <td className="px-6 py-4 text-[14px] text-[#475569]">{txn.bank}</td>
                        <td className="px-6 py-4 font-bold text-[14px] text-[#0f172b] font-mono">{txn.amount.toLocaleString("en-US", {style:"currency",currency:txn.currency})}</td>
                        <td className="px-6 py-4"><StatusBadge status={txn.status} /></td>
                        <td className="px-6 py-4">
                           {txn.status === "failed" ? (
                              <button onClick={() => retryTransaction(txn.id)} className="text-[12px] font-bold bg-white border border-red-200 px-4 py-1.5 rounded-lg text-red-600 shadow-sm hover:bg-red-50 transition-colors">Push Override</button>
                           ) : (
                              <span className="text-[12px] text-[#94a3b8] font-bold">{txn.timestamp || "Sandbox Mode"}</span>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
         </>
      )}
    </div>
  );
}

// Ensure Play icon is imported above
import { Play } from "lucide-react";
