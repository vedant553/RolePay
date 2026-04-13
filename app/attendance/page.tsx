"use client";

import { Check, Clock, AlertCircle, Zap, ExternalLink } from "lucide-react";

function PipelineStep({ number, title, status }: { number: number; title: string; status: "completed" | "inProgress" | "pending" }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
      <div className={`rounded-full size-10 flex items-center justify-center font-bold text-[14px] relative ${
        status === "completed" ? "bg-[#10b981]" : status === "inProgress" ? "bg-[#3b82f6]" : "bg-[#e2e8f0]"
      } ${status !== "pending" ? "text-white" : "text-[#90a1b9]"}`}>
        {status === "inProgress" && <div className="absolute inset-0 rounded-full bg-[#3b82f6] animate-ping opacity-30" />}
        <span className="relative z-10">
          {status === "completed" ? <Check className="size-4" strokeWidth={2.5} /> : number}
        </span>
      </div>
      <p className="text-[#62748e] text-[10px] text-center leading-tight">{title}</p>
    </div>
  );
}

function SourceStatus({ name, status }: { name: string; status: "connected" | "delayed" | "error" }) {
  const config = {
    connected: { color: "#10b981", bg: "#ecfdf5", text: "Connected" },
    delayed: { color: "#f59e0b", bg: "#fffbeb", text: "Delayed" },
    error: { color: "#dc2626", bg: "#fef2f2", text: "Error" },
  }[status];
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="rounded-full size-2" style={{ backgroundColor: config.color }} />
        <p className="text-[#0f172b] text-[12px]">{name}</p>
      </div>
      <div className="rounded px-2 py-0.5" style={{ backgroundColor: config.bg, color: config.color }}>
        <p className="font-bold text-[10px]">{config.text}</p>
      </div>
    </div>
  );
}

function AnomalyRow({ employee, issue, risk, resolvedStatus }: { employee: string; issue: string; risk: "High" | "Medium" | "Low"; resolvedStatus: string }) {
  const riskConfig = {
    High: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
    Medium: { bg: "#fffbeb", color: "#f59e0b", border: "#fde68a" },
    Low: { bg: "#ecfdf5", color: "#10b981", border: "#a7f3d0" },
  }[risk];
  const isResolved = resolvedStatus === "Auto-Resolved";
  return (
    <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
      <div className="flex items-center gap-4 flex-1">
        <div className="rounded px-2.5 py-1 border text-[10px] font-bold uppercase tracking-[0.5px]" style={{ backgroundColor: riskConfig.bg, color: riskConfig.color, borderColor: riskConfig.border }}>
          {risk}
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#0f172b] text-[12px] mb-0.5">{employee}</p>
          <p className="text-[#62748e] text-[11px]">{issue}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold ${isResolved ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fef3c7] text-[#92400e]"}`}>
          {resolvedStatus}
        </span>
      </div>
      <button className="ml-4 bg-white border border-[#e2e8f0] rounded-md px-3 py-1.5 text-[#0f172b] text-[11px] font-bold hover:bg-[#f8fafc]">Review</button>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-[24px] font-bold text-[#0f172b]">Attendance Intelligence – March 2026</h1>
        <div className="bg-[#ecfdf5] border border-[#10b981] rounded px-2 py-1 flex items-center gap-1.5">
          <div className="bg-[#10b981] rounded-full size-1.5 animate-pulse" />
          <p className="font-bold text-[#10b981] text-[10px] uppercase tracking-[0.5px]">AI Engine Active</p>
        </div>
      </div>
      <p className="text-[#62748e] text-[14px] mb-5">AI-powered attendance automation & payroll impact control</p>

      {/* Region Tabs */}
      <div className="flex items-center gap-2 mb-8">
        {["Global View", "US-West", "EU-Region", "APAC"].map((tab, i) => (
          <button key={tab} className={`px-4 py-2 rounded-full text-[12px] font-bold transition-colors ${i === 0 ? "bg-white border border-[#e2e8f0] text-[#0f172b] shadow-sm" : "text-[#90a1b9] hover:text-[#0f172b]"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Employees Synced", value: "1,248", badge: "▲ 100%", badgeStyle: "bg-[#ecfdf5] text-[#10b981]", sub: "All Active", color: "#10b981" },
          { title: "Attendance Records", value: "28,352", badge: "Mar 1-31", badgeStyle: "bg-[#eff6ff] text-[#3b82f6]", sub: "23 Working Days", color: "#3b82f6" },
          { title: "AI Anomalies Detected", value: "47", badge: "12 Resolved", badgeStyle: "bg-[#fffbeb] text-[#f59e0b]", sub: "35 Pending Review", color: "#f59e0b" },
          { title: "Overtime Hours", value: "2,847", badge: "▲ 8.4%", badgeStyle: "bg-[#f3e8ff] text-[#8b5cf6]", sub: "vs Last Month", color: "#8b5cf6" },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5">
              <div className="size-24 rounded-full border-8" style={{ borderColor: card.color }} />
            </div>
            <div className="size-9 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: card.color }}>
              <Zap className="size-4 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[11px] font-bold text-[#62748e] uppercase tracking-[0.55px] mb-1">{card.title}</p>
            <p className="text-[30px] font-bold text-[#0f172b] tracking-tight mb-2">{card.value}</p>
            <div className="flex items-center gap-1.5">
              <span className={`${card.badgeStyle} rounded px-1.5 py-0.5 text-[10px] font-bold`}>{card.badge}</span>
              <span className="text-[10px] text-[#90a1b9]">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* AI Engine Card */}
        <div className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-bold text-[#0f172b] text-[16px] mb-1">AI Attendance Engine</h3>
              <p className="text-[#62748e] text-[12px]">Automated processing pipeline</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-[#62748e] text-[11px]">Auto-Sync Mode</span>
              <div className="relative inline-block w-11 h-6">
                <input className="sr-only peer" type="checkbox" defaultChecked readOnly />
                <div className="w-full h-full bg-[#10b981] rounded-full" />
                <div className="absolute left-[2px] top-[2px] bg-white size-5 rounded-full translate-x-5" />
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between mb-8">
            <PipelineStep number={1} title="Data Ingestion" status="completed" />
            <div className="flex-1 h-0.5 bg-[#10b981] mx-2" />
            <PipelineStep number={2} title="Pattern Detection" status="completed" />
            <div className="flex-1 h-0.5 bg-[#10b981] mx-2" />
            <PipelineStep number={3} title="Policy Validation" status="inProgress" />
            <div className="flex-1 h-0.5 bg-[#e2e8f0] mx-2" />
            <PipelineStep number={4} title="Payroll Mapping" status="pending" />
          </div>
          <div className="border-t border-[#e2e8f0] pt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#62748e] text-[11px] uppercase tracking-[0.55px] font-bold">Last Sync Time</p>
              <p className="text-[#0f172b] text-[12px] font-bold">2 minutes ago</p>
            </div>
            <p className="text-[#62748e] text-[11px] uppercase tracking-[0.55px] font-bold mb-3">Connected Sources</p>
            <div className="space-y-2">
              <SourceStatus name="BambooHR" status="connected" />
              <SourceStatus name="Workday API" status="connected" />
              <SourceStatus name="Azure AD" status="delayed" />
              <SourceStatus name="Custom SFTP" status="error" />
            </div>
          </div>
        </div>

        {/* Payroll Impact Card */}
        <div className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-bold text-[#0f172b] text-[16px] mb-1">Payroll Impact (Live)</h3>
              <p className="text-[#62748e] text-[12px]">Real-time financial impact analysis</p>
            </div>
            <div className="size-3 bg-[#10b981] rounded-full animate-pulse" />
          </div>
          <div className="space-y-5 mb-6">
            {[
              { label: "Estimated Overtime Cost", value: "$142,350", change: "+8.4%", type: "increase" as const },
              { label: "Leave Deduction Impact", value: "$28,450", change: "-2.1%", type: "decrease" as const },
              { label: "Net Payroll Variance %", value: "+2.8%", change: "Within Threshold", type: "neutral" as const },
            ].map((metric) => (
              <div key={metric.label}>
                <p className="text-[#62748e] text-[11px] mb-1">{metric.label}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#0f172b] text-[20px] tracking-tight">{metric.value}</p>
                  <p className={`font-bold text-[12px] ${metric.type === "increase" ? "text-[#f59e0b]" : metric.type === "decrease" ? "text-[#10b981]" : "text-[#62748e]"}`}>{metric.change}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#e2e8f0] pt-4">
            <div className="flex items-center justify-between">
              <p className="text-[#62748e] text-[11px] uppercase tracking-[0.55px] font-bold">Risk Level Indicator</p>
              <div className="flex items-center gap-2">
                <div className="bg-[#ecfdf5] rounded px-2 py-1">
                  <p className="font-bold text-[#10b981] text-[12px]">LOW RISK</p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`w-1 h-5 rounded-sm ${i <= 2 ? "bg-[#10b981]" : "bg-[#e2e8f0]"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Irregularities */}
      <div className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-bold text-[#0f172b] text-[16px] mb-1">AI-Detected Irregularities</h3>
            <p className="text-[#62748e] text-[12px]">47 anomalies detected • 12 auto-resolved • 35 pending</p>
          </div>
          <button className="text-[#3b82f6] font-bold text-[12px] flex items-center gap-1 hover:opacity-80">
            View All <ExternalLink className="size-3" strokeWidth={2} />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { employee: "Sarah Chen", issue: "Consecutive overtime exceeding 20hrs/week", risk: "High" as const, resolvedStatus: "Action Required" },
            { employee: "Marcus Johnson", issue: "Clock-in pattern deviation detected", risk: "Medium" as const, resolvedStatus: "Auto-Resolved" },
            { employee: "Elena Rodriguez", issue: "Missing timesheet for 2 days", risk: "High" as const, resolvedStatus: "Action Required" },
            { employee: "David Park", issue: "Unusual leave overlap with holidays", risk: "Low" as const, resolvedStatus: "Auto-Resolved" },
            { employee: "Lisa Anderson", issue: "Overtime without prior approval", risk: "Medium" as const, resolvedStatus: "Action Required" },
          ].map((anomaly, i) => (
            <AnomalyRow key={i} {...anomaly} />
          ))}
        </div>
      </div>
    </div>
  );
}
