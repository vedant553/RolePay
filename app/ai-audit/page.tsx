"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Sparkles, AlertTriangle, Shield, TrendingUp, TrendingDown, Eye } from "lucide-react";
import AIConsolePanel from "@/components/ui/AIConsolePanel";
import RiskBar from "@/components/ui/RiskBar";

const riskTrendData = [
  { month: "Oct", score: 28 },
  { month: "Nov", score: 32 },
  { month: "Dec", score: 22 },
  { month: "Jan", score: 38 },
  { month: "Feb", score: 30 },
  { month: "Mar", score: 25 },
];

const fraudData = [
  { week: "W1", flagged: 3, cleared: 2 },
  { week: "W2", flagged: 5, cleared: 5 },
  { week: "W3", flagged: 2, cleared: 2 },
  { week: "W4", flagged: 4, cleared: 3 },
];

const riskItems = [
  { category: "Overtime Anomalies", score: 72, entities: "Germany, Ireland", severity: "High" },
  { category: "Tax Calculation Variance", score: 45, entities: "India", severity: "Medium" },
  { category: "Duplicate Payments", score: 12, entities: "USA", severity: "Low" },
  { category: "Missing Timesheets", score: 38, entities: "UK, Spain", severity: "Medium" },
  { category: "Benefits Over-allocation", score: 18, entities: "Singapore", severity: "Low" },
];

const severityColor: Record<string, string> = {
  High: "text-[#ef4444] bg-[#fee2e2]",
  Medium: "text-[#f59e0b] bg-[#fef3c7]",
  Low: "text-[#10b981] bg-[#d1fae5]",
};

export default function AIAuditPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="relative">
          <div className="absolute inset-0 bg-[#10b981] rounded-full opacity-20 animate-ping" />
          <div className="relative bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full p-2">
            <Sparkles className="size-5 text-white" strokeWidth={1.75} />
          </div>
        </div>
        <h1 className="text-[24px] font-bold text-[#0f172b]">AI Payroll Risk Dashboard</h1>
        <div className="flex items-center gap-1.5 bg-[#ecfdf5] border border-[#10b981]/20 rounded-lg px-2 py-1">
          <div className="size-1.5 bg-[#10b981] rounded-full animate-pulse" />
          <span className="text-[#10b981] font-bold text-[10px] uppercase tracking-[0.5px]">AI Risk Engine v3.1 Live</span>
        </div>
      </div>
      <p className="text-[#62748e] text-[14px] mb-6">Real-time fraud detection, anomaly identification, and risk mitigation across all payroll entities</p>

      {/* Risk Score Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Overall Risk Score", value: "25", sub: "Low Risk", trend: "▼ 5pts", direction: "good", icon: Shield, color: "bg-[#10b981]" },
          { label: "Anomalies Detected", value: "12", sub: "This cycle", trend: "+3 vs last", direction: "bad", icon: AlertTriangle, color: "bg-[#f59e0b]" },
          { label: "Fraud Probability", value: "6%", sub: "Below threshold", trend: "▼ 2%", direction: "good", icon: Eye, color: "bg-[#10b981]" },
          { label: "Penalties Avoided", value: "₹48,000", sub: "AI-mitigated", trend: "This cycle", direction: "good", icon: TrendingUp, color: "bg-[#3b82f6]" },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-5 shadow-sm">
            <div className={`${card.color} rounded-xl size-9 flex items-center justify-center mb-3`}>
              <card.icon className="size-4 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[10px] font-bold text-[#62748e] uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-[28px] font-bold text-[#0f172b] mb-1">{card.value}</p>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-bold ${card.direction === "good" ? "text-[#10b981]" : "text-[#ef4444]"}`}>{card.trend}</span>
              <span className="text-[11px] text-[#90a1b9]">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Risk Trend */}
        <div className="col-span-2 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Risk Score Trend – 6 Months</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#90a1b9" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2.5} fill="url(#riskGrad)" dot={{ fill: "#ef4444", strokeWidth: 2, r: 4, stroke: "white" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Console */}
        <AIConsolePanel
          title="Risk Monitoring Engine"
          version="v3.1"
          alerts={[
            { type: "critical", title: "Germany Overtime Spike", body: "72% risk score — 3 employees flagged for excess overtime (>60 hrs/week)", action: "Review Now" },
            { type: "warning", title: "Ireland Variance", body: "Payroll variance of +14% detected vs last cycle in IE entity", action: "Analyze" },
            { type: "success", title: "Fraud Scan Complete", body: "No fraudulent patterns detected in USA, Singapore, India payrolls" },
          ]}
          entityHealth={[
            { region: "USA", entity: "SAASA Inc.", risk: "12%", status: "healthy" },
            { region: "IN", entity: "SAASA India", risk: "28%", status: "warning" },
            { region: "DE", entity: "SAASA GmbH", risk: "72%", status: "critical" },
            { region: "SG", entity: "SAASA Asia", risk: "6%", status: "healthy" },
          ]}
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Risk Categories */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Risk Category Breakdown</h3>
          <div className="space-y-4">
            {riskItems.map((risk) => (
              <div key={risk.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#0f172b]">{risk.category}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${severityColor[risk.severity]}`}>{risk.severity}</span>
                  </div>
                  <span className="text-[12px] text-[#90a1b9]">{risk.entities}</span>
                </div>
                <div className="w-full h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${risk.score > 60 ? "bg-[#ef4444]" : risk.score > 35 ? "bg-[#f59e0b]" : "bg-[#10b981]"}`} style={{ width: `${risk.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud Detection */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Fraud Detection – March 2026</h3>
          <div className="h-[180px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fraudData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#90a1b9" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="flagged" fill="#fecaca" radius={[4, 4, 0, 0]} name="Flagged" />
                <Bar dataKey="cleared" fill="#10b981" radius={[4, 4, 0, 0]} name="Cleared" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            <RiskBar label="AI Fraud Confidence" value={94} variant="green" />
            <RiskBar label="False Positive Rate" value={4} variant="green" />
          </div>
        </div>
      </div>
    </div>
  );
}
