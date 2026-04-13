"use client";

import { Shield, AlertTriangle, CheckCircle, Zap, Globe, FileText, Plus, ChevronRight } from "lucide-react";
import { complianceFilings, complianceMetrics, jurisdictionRisk } from "@/lib/data/compliance";
import Link from "next/link";
import RiskBar from "@/components/ui/RiskBar";

function FilingStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    Filed: { bg: "bg-[#d1fae5]", text: "text-[#065f46]" },
    Pending: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
    Automated: { bg: "bg-[#dbeafe]", text: "text-[#1e40af]" },
    Overdue: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  };
  const s = config[status] || { bg: "bg-[#f1f5f9]", text: "text-[#475569]" };
  return (
    <span className={`${s.bg} ${s.text} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold`}>
      {status === "Filed" && <CheckCircle className="size-3" strokeWidth={2.5} />}
      {status === "Automated" && <Zap className="size-3" strokeWidth={2} />}
      {status === "Pending" && <AlertTriangle className="size-3" strokeWidth={2} />}
      {status === "Overdue" && <AlertTriangle className="size-3" strokeWidth={2} />}
      {status}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const color = priority === "high" ? "bg-[#ef4444]" : priority === "medium" ? "bg-[#f59e0b]" : "bg-[#10b981]";
  return <div className={`size-2 rounded-full ${color}`} />;
}

export default function CompliancePage() {
  const filedCount = complianceFilings.filter((f) => f.status === "Filed" || f.status === "Automated").length;
  const pendingCount = complianceFilings.filter((f) => f.status === "Pending").length;
  const overdueCount = complianceFilings.filter((f) => f.status === "Overdue").length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[24px] font-bold text-[#0f172b]">AI Compliance Intelligence</h1>
            <div className="flex items-center gap-1.5 bg-[#ecfdf5] border border-[#10b981]/20 rounded-lg px-2 py-1">
              <div className="size-1.5 bg-[#10b981] rounded-full animate-pulse" />
              <span className="text-[#10b981] font-bold text-[10px] uppercase tracking-[0.5px]">AI Engine Active</span>
            </div>
          </div>
          <p className="text-[#62748e] text-[14px]">Multi-jurisdiction compliance monitoring and automated filing management</p>
        </div>
        <Link href="/compliance/create">
          <button className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[14px] px-5 py-2.5 rounded-xl shadow-sm transition-colors">
            <Plus className="size-4" strokeWidth={2.5} /> Create Rule
          </button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {complianceMetrics.map((metric, i) => (
          <div key={i} className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-[#62748e] uppercase tracking-wider mb-2">{metric.label}</p>
            <p className="text-[28px] font-bold text-[#0f172b] mb-1">{metric.value}</p>
            {metric.trend && (
              <div className={`flex items-center gap-1 text-[11px] font-bold ${metric.trendDirection === "up" ? "text-[#10b981]" : metric.trendDirection === "down" ? "text-[#3b82f6]" : "text-[#62748e]"}`}>
                {metric.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Filing Table */}
        <div className="col-span-2 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-[#0f172b] text-[16px]">Compliance Filings</h2>
              <div className="flex items-center gap-2">
                <span className="bg-[#fee2e2] text-[#991b1b] text-[11px] font-bold px-2 py-0.5 rounded">{overdueCount} Overdue</span>
                <span className="bg-[#fef3c7] text-[#92400e] text-[11px] font-bold px-2 py-0.5 rounded">{pendingCount} Pending</span>
                <span className="bg-[#d1fae5] text-[#065f46] text-[11px] font-bold px-2 py-0.5 rounded">{filedCount} Filed/Auto</span>
              </div>
            </div>
            <button className="text-[#10b981] font-bold text-[12px] flex items-center gap-1">
              View All <ChevronRight className="size-3" strokeWidth={2} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>
                  {["", "Filing", "Type", "Country", "Due Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-[#64748b] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {complianceFilings.map((filing) => (
                  <tr key={filing.id} className={`hover:bg-[#f8fafc] transition-colors ${filing.status === "Overdue" ? "bg-[#fef2f2]/30" : ""}`}>
                    <td className="px-4 py-3"><PriorityDot priority={filing.priority} /></td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-[13px] text-[#0f172b]">{filing.name}</p>
                      <p className="text-[11px] text-[#90a1b9]">{filing.entity}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#475569]">{filing.type}</td>
                    <td className="px-4 py-3 text-[12px] text-[#475569]">{filing.country}</td>
                    <td className="px-4 py-3">
                      <p className={`text-[12px] font-bold ${filing.daysLeft < 0 ? "text-[#ef4444]" : filing.daysLeft <= 5 ? "text-[#f59e0b]" : "text-[#0f172b]"}`}>
                        {filing.dueDate}
                      </p>
                      <p className="text-[10px] text-[#90a1b9]">{filing.daysLeft < 0 ? `${Math.abs(filing.daysLeft)}d overdue` : `${filing.daysLeft}d left`}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-[13px] text-[#0f172b]">{filing.amount}</td>
                    <td className="px-4 py-3"><FilingStatusBadge status={filing.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-4">
          {/* Jurisdiction Risk */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0f172b] text-[15px] mb-4">Jurisdiction Risk</h3>
            <div className="space-y-4">
              {jurisdictionRisk.map((j) => (
                <div key={j.jurisdiction}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Globe className="size-3.5 text-[#90a1b9]" strokeWidth={2} />
                      <span className="text-[12px] font-bold text-[#0f172b]">{j.jurisdiction}</span>
                    </div>
                    <span className={`text-[11px] font-bold ${j.riskScore > 50 ? "text-[#ef4444]" : j.riskScore > 30 ? "text-[#f59e0b]" : "text-[#10b981]"}`}>{j.riskScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${j.riskScore > 50 ? "bg-[#ef4444]" : j.riskScore > 30 ? "bg-[#f59e0b]" : "bg-[#10b981]"}`} style={{ width: `${j.riskScore}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-[#0f172b] rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-1.5 bg-[#10b981] rounded-full animate-pulse" />
              <span className="text-[#10b981] font-bold text-[12px]">AI Compliance Advisor</span>
            </div>
            <div className="space-y-3">
              {[
                { text: "File PAYE before April 19 to avoid HMRC penalties", type: "warning" },
                { text: "Germany Lohnsteuer is 2 days overdue — immediate action required", type: "critical" },
                { text: "Auto-automation can handle 3 more India filings", type: "info" },
              ].map((rec, i) => (
                <div key={i} className={`rounded-lg p-3 ${rec.type === "critical" ? "bg-[#ef4444]/10 border border-[#ef4444]/20" : rec.type === "warning" ? "bg-amber-400/10 border border-amber-400/20" : "bg-[#10b981]/10 border border-[#10b981]/20"}`}>
                  <p className="text-[12px] text-white/80">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
