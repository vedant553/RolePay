"use client";

import { CheckCircle, Clock, AlertTriangle, ChevronRight, Download } from "lucide-react";
import { disbursementTransactions } from "@/lib/data/payroll";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  const config = {
    processed: { bg: "bg-[#d1fae5]", text: "text-[#065f46]" },
    pending: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
    failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  }[status] || { bg: "bg-[#f1f5f9]", text: "text-[#475569]" };

  return (
    <span className={`${config.bg} ${config.text} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold`}>
      {status === "processed" && <CheckCircle className="size-3" strokeWidth={2.5} />}
      {status === "pending" && <Clock className="size-3" strokeWidth={2.5} />}
      {status === "failed" && <AlertTriangle className="size-3" strokeWidth={2.5} />}
      <span className="capitalize">{status}</span>
    </span>
  );
}

const processed = disbursementTransactions.filter((t) => t.status === "processed").length;
const pending = disbursementTransactions.filter((t) => t.status === "pending").length;
const failed = disbursementTransactions.filter((t) => t.status === "failed").length;

export default function DisbursementPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-[12px] text-[#90a1b9] mb-4">
        <Link href="/payroll-run" className="hover:text-[#10b981]">Payroll Run</Link>
        <ChevronRight className="size-3" strokeWidth={2} />
        <span className="text-[#0f172b] font-bold">Disbursement</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172b] mb-2">Payroll Disbursement – March 2026</h1>
          <p className="text-[14px] text-[#62748e]">Bank transfer processing and payment tracking across all entities</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] text-[#0f172b] font-bold text-[14px] px-4 py-2.5 rounded-xl hover:bg-[#f8fafc]">
          <Download className="size-4" strokeWidth={2} /> Export Report
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Processed", count: processed, total: disbursementTransactions.length, color: "text-[#10b981]", bg: "bg-[#d1fae5]" },
          { label: "Pending", count: pending, total: disbursementTransactions.length, color: "text-[#f59e0b]", bg: "bg-[#fef3c7]" },
          { label: "Failed", count: failed, total: disbursementTransactions.length, color: "text-[#ef4444]", bg: "bg-[#fee2e2]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
            <div className={`${stat.bg} inline-flex items-center px-3 py-1.5 rounded-lg mb-3`}>
              <span className={`${stat.color} font-bold text-[13px]`}>{stat.label}</span>
            </div>
            <p className={`text-[36px] font-bold ${stat.color} mb-1`}>{stat.count}</p>
            <p className="text-[12px] text-[#90a1b9]">{stat.total} total transactions</p>
          </div>
        ))}
      </div>

      {/* Net Disbursement Card */}
      <div className="bg-gradient-to-r from-[#10b981] to-[#059669] rounded-2xl p-6 mb-6 shadow-lg text-white">
        <p className="text-white/70 text-[12px] uppercase tracking-wider mb-1">Total Net Disbursement</p>
        <p className="text-[40px] font-bold tracking-tight mb-2">$480,454.00</p>
        <p className="text-white/70 text-[13px]">March 2026 · 1,248 employees · 4 entities · Avg. $385.00/employee</p>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="font-bold text-[#0f172b] text-[16px]">Transaction Log</h2>
          <span className="text-[13px] text-[#64748b]">{disbursementTransactions.length} transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                {["Transaction ID", "Employee", "Bank", "Amount", "Status", "Timestamp"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-bold text-[#64748b] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {disbursementTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-4 text-[13px] font-mono text-[#64748b]">{txn.id}</td>
                  <td className="px-6 py-4 font-bold text-[14px] text-[#0f172b]">{txn.employee}</td>
                  <td className="px-6 py-4 text-[14px] text-[#475569]">{txn.bank}</td>
                  <td className="px-6 py-4 font-bold text-[14px] text-[#0f172b]">{txn.amount}</td>
                  <td className="px-6 py-4"><StatusBadge status={txn.status} /></td>
                  <td className="px-6 py-4 text-[13px] text-[#64748b]">{txn.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
