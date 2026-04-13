"use client";

import { CheckCircle, AlertTriangle, ChevronRight, TrendingUp, RefreshCw } from "lucide-react";
import Link from "next/link";
import RiskBar from "@/components/ui/RiskBar";

const reconciliationItems = [
  { entity: "SAASA Inc. (USA)", bankBalance: "$218,392.40", payrollTotal: "$218,400.00", variance: "-$7.60", status: "matched" as const },
  { entity: "SAASA India Pvt Ltd", bankBalance: "$89,196.20", payrollTotal: "$89,200.00", variance: "-$3.80", status: "matched" as const },
  { entity: "SAASA GmbH (Germany)", bankBalance: "$156,820.00", payrollTotal: "$158,640.00", variance: "-$1,820.00", status: "review" as const },
  { entity: "SAASA Asia Pte Ltd", bankBalance: "$99,000.00", payrollTotal: "$99,000.00", variance: "$0.00", status: "matched" as const },
];

const auditEvents = [
  { time: "09:00 AM", event: "Bank feed imported from all 4 entities", type: "info" as const },
  { time: "09:15 AM", event: "AI matching started — 1,248 transactions", type: "info" as const },
  { time: "09:22 AM", event: "SAASA Inc. reconciliation complete (99.997%)", type: "success" as const },
  { time: "09:31 AM", event: "SAASA GmbH variance detected: €1,820 — flagged for review", type: "warning" as const },
  { time: "09:45 AM", event: "SAASA India & Singapore reconciliation complete", type: "success" as const },
];

export default function ReconciliationPage() {
  const matched = reconciliationItems.filter((r) => r.status === "matched").length;
  return (
    <div>
      <div className="flex items-center gap-2 text-[12px] text-[#90a1b9] mb-4">
        <Link href="/payroll-run" className="hover:text-[#10b981]">Payroll Run</Link>
        <ChevronRight className="size-3" strokeWidth={2} />
        <span className="text-[#0f172b] font-bold">Reconciliation</span>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172b] mb-2">Payroll Reconciliation – March 2026</h1>
          <p className="text-[#62748e] text-[14px]">AI-powered bank matching and variance analysis across all entities</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#ecfdf5] border border-[#10b981]/20 rounded-xl px-3 py-2">
            <div className="size-1.5 bg-[#10b981] rounded-full animate-pulse" />
            <span className="text-[#10b981] font-bold text-[12px]">AI Reconciliation Active</span>
          </div>
          <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] text-[#0f172b] font-bold text-[14px] px-4 py-2 rounded-xl hover:bg-[#f8fafc]">
            <RefreshCw className="size-4" strokeWidth={2} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Match Rate", value: `${matched}/${reconciliationItems.length} Entities`, sub: "99.2% transaction accuracy", icon: TrendingUp, color: "bg-[#10b981]" },
          { label: "Total Reconciled", value: "$565,240", sub: "Gross payroll", icon: CheckCircle, color: "bg-[#3b82f6]" },
          { label: "Variance Detected", value: "$1,831.40", sub: "Across all entities", icon: AlertTriangle, color: "bg-[#f59e0b]" },
          { label: "Manual Review", value: "1 Entity", sub: "SAASA GmbH flagged", icon: AlertTriangle, color: "bg-[#ef4444]" },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-5 shadow-sm">
            <div className={`${card.color} rounded-xl size-9 flex items-center justify-center mb-3`}>
              <card.icon className="size-4 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[10px] font-bold text-[#62748e] uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-[20px] font-bold text-[#0f172b] mb-0.5">{card.value}</p>
            <p className="text-[11px] text-[#90a1b9]">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Bank Matching Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="font-bold text-[#0f172b] text-[16px]">Bank Matching – Entity Level</h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <tr>
              {["Entity", "Bank Balance", "Payroll Total", "Variance", "Status"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-[11px] font-bold text-[#64748b] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {reconciliationItems.map((item) => (
              <tr key={item.entity} className={`hover:bg-[#f8fafc] transition-colors ${item.status === "review" ? "bg-[#fffbeb]/50" : ""}`}>
                <td className="px-6 py-4 font-bold text-[14px] text-[#0f172b]">{item.entity}</td>
                <td className="px-6 py-4 text-[14px] text-[#475569] font-mono">{item.bankBalance}</td>
                <td className="px-6 py-4 text-[14px] text-[#475569] font-mono">{item.payrollTotal}</td>
                <td className={`px-6 py-4 text-[14px] font-bold font-mono ${item.status === "matched" ? "text-[#10b981]" : "text-[#f59e0b]"}`}>{item.variance}</td>
                <td className="px-6 py-4">
                  {item.status === "matched" ? (
                    <span className="inline-flex items-center gap-1.5 bg-[#d1fae5] text-[#065f46] px-2.5 py-1 rounded-md text-[12px] font-bold">
                      <CheckCircle className="size-3" strokeWidth={2.5} /> Matched
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-[#fef3c7] text-[#92400e] px-2.5 py-1 rounded-md text-[12px] font-bold">
                      <AlertTriangle className="size-3" strokeWidth={2} /> Review Required
                    </span>
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
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Reconciliation Health</h3>
          <div className="space-y-4">
            <RiskBar label="Transaction Match Rate" value={99} variant="green" />
            <RiskBar label="Amount Accuracy" value={96} variant="green" />
            <RiskBar label="Timing Compliance" value={88} variant="amber" />
            <RiskBar label="Entity Coverage" value={100} variant="green" />
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Reconciliation Audit Trail</h3>
          <div className="space-y-4">
            {auditEvents.map((event, i) => (
              <div key={i} className="flex gap-3">
                <div className={`size-2 rounded-full mt-1.5 shrink-0 ${event.type === "success" ? "bg-[#10b981]" : event.type === "warning" ? "bg-[#f59e0b]" : "bg-[#3b82f6]"}`} />
                <div className="flex-1">
                  <p className="text-[11px] text-[#90a1b9] mb-0.5">{event.time}</p>
                  <p className="text-[13px] text-[#0f172b]">{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
