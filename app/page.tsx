"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Sparkles,
  Calendar,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  globalEntities,
  activityTimeline,
  automationSnapshot,
  financialOverview,
  payrollTrendData,
  aiInsights,
  payrollHealthScore,
} from "@/lib/data/dashboard";

function AISystemStatus() {
  return (
    <div className="bg-gradient-to-r from-[rgba(16,185,129,0.08)] to-[rgba(16,185,129,0.02)] border border-[rgba(16,185,129,0.2)] rounded-2xl p-4 mb-6 flex items-center justify-between shadow-[0px_0px_20px_0px_rgba(16,185,129,0.1)]">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[#10b981] rounded-full opacity-20 animate-pulse" />
          <div className="relative bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full p-2.5">
            <Sparkles className="size-5 text-white" strokeWidth={1.75} />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-[#0f172b] text-[15px]">AI Engine Status</p>
            <div className="flex items-center gap-1.5 bg-[#10b981] rounded px-2 py-1">
              <div className="size-1.5 bg-white rounded-full animate-pulse" />
              <p className="font-bold text-white text-[10px] uppercase tracking-[0.5px]">Live</p>
            </div>
          </div>
          <p className="text-[#62748e] text-[12px]">Real-time monitoring active across all entities</p>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="font-bold text-[#62748e] text-[10px] tracking-[0.5px] uppercase mb-1">Learning Mode</p>
          <div className="flex items-center gap-2 justify-end">
            <div className="w-[120px] bg-[#e5e7eb] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full" style={{ width: "72%" }} />
            </div>
            <p className="font-bold text-[#10b981] text-[14px]">72%</p>
          </div>
          <p className="text-[#90a1b9] text-[10px] mt-0.5">Optimized</p>
        </div>
        <div className="bg-white/60 rounded-lg px-4 py-2.5">
          <p className="font-bold text-[#0f172b] text-[18px] mb-0.5">247</p>
          <p className="text-[#62748e] text-[9px]">Decisions Today</p>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
}

function MetricCard({ title, value, trend, trendDirection, subtitle, icon, iconBg }: MetricCardProps) {
  return (
    <div className="relative bg-white rounded-2xl p-6 flex-1 min-w-[200px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[rgba(226,232,240,0.6)] overflow-hidden">
      <div className="absolute top-4 right-4 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded px-1.5 py-0.5">
        <p className="text-[8px] font-bold text-[#10b981] tracking-[0.5px] uppercase">AI</p>
      </div>
      <div className={`${iconBg} rounded-xl size-10 flex items-center justify-center mb-4`}>{icon}</div>
      <p className="text-[10px] font-bold text-[#62748e] tracking-[0.5px] uppercase mb-2">{title}</p>
      <p className="text-[28px] font-bold text-[#0f172b] tracking-tight mb-2">{value}</p>
      {(trend || subtitle) && (
        <div className="flex items-center gap-2">
          {trend && (
            <div className={`flex items-center gap-1 rounded px-2 py-1 ${trendDirection === "up" ? "bg-[#ecfdf5] text-[#009966]" : "bg-[#fef2f2] text-[#dc2626]"}`}>
              <TrendingUp className="size-3" strokeWidth={2} />
              <span className="text-[10px] font-bold">{trend}</span>
            </div>
          )}
          {subtitle && <p className="text-[10px] text-[#90a1b9]">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}

function CircularGauge({ value }: { value: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  return (
    <div className="relative bg-white rounded-2xl p-6 flex-1 min-w-[200px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[rgba(226,232,240,0.6)]">
      <div className="absolute top-4 right-4 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded px-1.5 py-0.5">
        <p className="text-[8px] font-bold text-[#10b981] tracking-[0.5px] uppercase">AI</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle cx="60" cy="60" r={radius} stroke="#f0f0f0" strokeWidth="8" fill="none" />
            <circle cx="60" cy="60" r={radius} stroke="#10b981" strokeWidth="8" fill="none"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
              style={{ filter: "drop-shadow(0px 0px 6px rgba(16,185,129,0.5))", transition: "stroke-dashoffset 1s ease-in-out" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[32px] font-bold text-[#0f172b] tracking-tight">{value}%</p>
            <p className="text-[#90a1b9] text-[10px]">Healthy</p>
          </div>
        </div>
        <p className="font-bold text-[#62748e] text-[10px] tracking-[0.5px] uppercase text-center mb-2">
          Global Payroll Health Score
        </p>
        <div className="bg-[#ecfdf5] border border-[#10b981]/20 rounded-lg px-3 py-1.5 mb-1">
          <p className="font-bold text-[#10b981] text-[11px] text-center">Within Safe Threshold</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#f8fafc] rounded px-2.5 py-1">
          <CheckCircle className="size-3 text-[#10b981]" strokeWidth={2} />
          <p className="text-[#62748e] text-[10px]">3 risks auto-mitigated this cycle</p>
        </div>
        <p className="text-[#90a1b9] text-[9px] text-center mt-2">AI Confidence Level</p>
      </div>
    </div>
  );
}

function AIInsightsPanel() {
  const iconMap = {
    warning: <AlertTriangle className="size-3 text-[#f59e0b]" strokeWidth={2} />,
    alert: <AlertTriangle className="size-3 text-[#ef4444]" strokeWidth={2} />,
    success: <CheckCircle className="size-3 text-[#10b981]" strokeWidth={2} />,
  };
  const bgMap = { warning: "bg-[#fef3c7]", alert: "bg-[#fee2e2]", success: "bg-[#d1fae5]" };
  return (
    <div className="bg-white relative rounded-2xl p-6 shadow-[0px_0px_20px_rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.15)]">
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <div className="absolute inset-0 bg-[#10b981] rounded-full opacity-20 animate-ping" />
          <div className="relative bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full p-2">
            <Sparkles className="size-4 text-white" strokeWidth={1.75} />
          </div>
        </div>
        <h3 className="font-bold text-[#0f172b] text-[18px]">AI Executive Insights</h3>
        <div className="bg-[#10b981] rounded px-2 py-1 flex items-center gap-1">
          <div className="size-1.5 bg-white rounded-full animate-pulse" />
          <p className="font-bold text-white text-[9px] tracking-[0.5px] uppercase">AI Engine Live</p>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        {aiInsights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`shrink-0 size-6 rounded-full flex items-center justify-center mt-0.5 ${bgMap[insight.type]}`}>
              {iconMap[insight.type]}
            </div>
            <p className="text-[#0f172b] text-[14px] leading-5 flex-1">{insight.text}</p>
          </div>
        ))}
      </div>
      <button className="w-full bg-[#0f172b] hover:bg-[#1e293b] transition-colors rounded-xl py-3 px-5">
        <p className="font-bold text-white text-[14px]">Open AI Risk Breakdown</p>
      </button>
    </div>
  );
}

function FinancialOverview() {
  return (
    <div className="bg-white relative rounded-2xl p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[rgba(226,232,240,0.6)]">
      <h3 className="font-bold text-[#0f172b] text-[18px] mb-5">Financial Intelligence</h3>
      <div className="space-y-3 mb-6">
        {financialOverview.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              <p className="text-[#62748e] text-[13px]">{item.label}</p>
            </div>
            <p className="font-bold text-[#0f172b] text-[15px]">{item.value}</p>
          </div>
        ))}
      </div>
      <p className="font-bold text-[#62748e] text-[10px] tracking-[0.5px] uppercase mb-3">Payroll Trend (Last 6 Months)</p>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={payrollTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#90a1b9" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#payrollGrad)" dot={{ fill: "#10b981", strokeWidth: 2, r: 4, stroke: "white" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="border-t border-[#e5e7eb] pt-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Overtime Impact", value: "+$12,400", trend: "+2.2%" },
            { label: "Compliance Deduction", value: "7.6%", trend: "Normal" },
            { label: "Forecast Next Cycle", value: "$582,100", trend: "+3.0%" },
          ].map((metric, index) => (
            <div key={index} className="bg-[#f8fafc] rounded-lg p-3">
              <p className="text-[#62748e] text-[10px] mb-1">{metric.label}</p>
              <p className="font-bold text-[#0f172b] text-[14px] mb-0.5">{metric.value}</p>
              <p className="text-[#10b981] text-[9px]">{metric.trend}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  green: "#10b981",
  yellow: "#f59e0b",
  orange: "#fb923c",
  red: "#ef4444",
};

function EntityCard({ entity }: { entity: typeof globalEntities[0] }) {
  const color = statusColors[entity.statusColor];
  return (
    <div className="relative bg-white rounded-2xl p-5 flex-1 min-w-[240px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[rgba(226,232,240,0.6)] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: color }} />
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-[#0f172b] text-[16px]">{entity.country}</h4>
        <div className="px-2.5 py-1 rounded-md" style={{ backgroundColor: `${color}20` }}>
          <p className="font-bold text-[11px]" style={{ color }}>{entity.riskLevel}</p>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { label: "Risk Level", value: entity.riskPercentage, color },
          { label: "Compliance", value: entity.compliancePercentage, color: "#10b981" },
          { label: "AI Confidence", value: entity.aiConfidence, color: "#10b981" },
        ].map((metric, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[#62748e] text-[11px]">{metric.label}</p>
              <p className="font-bold text-[#0f172b] text-[12px]">{metric.value}%</p>
            </div>
            <div className="w-full bg-[#f0f0f0] h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${metric.value}%`, backgroundColor: metric.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const actTypeColors = { completed: "#10b981", alert: "#fb923c", sync: "#3b82f6", critical: "#ef4444" };
const actTypeLabels = { completed: "Completed", alert: "AI Alert", sync: "Sync", critical: "Critical" };

function AutomationSnapshot() {
  const statusConfig = {
    active: { bg: "#d1fae5", color: "#10b981", text: "Active" },
    enabled: { bg: "#dbeafe", color: "#3b82f6", text: "Enabled" },
    on: { bg: "#d1fae5", color: "#10b981", text: "On" },
    connected: { bg: "#dbeafe", color: "#3b82f6", text: "Connected" },
  };
  return (
    <div className="bg-white relative rounded-2xl p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[rgba(226,232,240,0.6)]">
      <h3 className="font-bold text-[#0f172b] text-[18px] mb-5">Automation Snapshot</h3>
      <div className="grid grid-cols-2 gap-3">
        {automationSnapshot.map((item, idx) => {
          const cfg = statusConfig[item.status];
          return (
            <div key={idx} className="bg-white border border-[rgba(226,232,240,0.6)] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                  <div className="size-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                </div>
                <p className="font-bold text-[#0f172b] text-[13px]">{item.label}</p>
              </div>
              <div className="px-2.5 py-1 rounded-md" style={{ backgroundColor: cfg.bg }}>
                <p className="font-bold text-[11px]" style={{ color: cfg.color }}>{cfg.text}</p>
              </div>
            </div>
          );
        })}
        <div className="bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)] rounded-xl p-4 flex items-center gap-3">
          <Zap className="size-8 text-[#10b981]" strokeWidth={1.5} />
          <div>
            <p className="font-bold text-[#10b981] text-[13px]">98.5% Uptime</p>
            <p className="text-[#62748e] text-[10px]">Last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityTimeline() {
  return (
    <div className="bg-white relative rounded-2xl p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[rgba(226,232,240,0.6)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[#0f172b] text-[18px]">Recent Activity</h3>
        <div className="flex items-center gap-3">
          {(["completed", "alert", "sync", "critical"] as const).map((type) => (
            <div key={type} className="flex items-center gap-1">
              <div className="size-2 rounded-full" style={{ backgroundColor: actTypeColors[type] }} />
              <p className="text-[#62748e] text-[9px]">{actTypeLabels[type]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        {activityTimeline.map((activity, index) => (
          <div key={index} className="flex gap-4 relative">
            {index < activityTimeline.length - 1 && (
              <div className="absolute left-[11px] top-7 w-0.5 h-[calc(100%+4px)] bg-[#e5e7eb]" />
            )}
            <div className="shrink-0 size-6 rounded-full flex items-center justify-center z-10 border-[3px] border-white shadow-sm" style={{ backgroundColor: actTypeColors[activity.type] }}>
              <div className="size-2 bg-white rounded-full" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-[#62748e] text-[11px]">{activity.time}</p>
                <div className="px-1.5 py-0.5 rounded" style={{ backgroundColor: `${actTypeColors[activity.type]}20` }}>
                  <p className="font-bold text-[8px] uppercase" style={{ color: actTypeColors[activity.type] }}>{actTypeLabels[activity.type]}</p>
                </div>
              </div>
              <p className="text-[#0f172b] text-[14px] leading-5">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <AISystemStatus />

      {/* Top Metrics Row */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-1">
        <CircularGauge value={payrollHealthScore} />
        <MetricCard title="Active Payroll Cycle" value="March 2026" subtitle="Audit in Progress" icon={<Calendar className="size-5 text-white" strokeWidth={1.75} />} iconBg="bg-[#3b82f6]" />
        <MetricCard title="Total Global Payroll This Month" value="$565,240" trend="+12.5%" trendDirection="up" subtitle="vs Last Month" icon={<DollarSign className="size-5 text-white" strokeWidth={1.75} />} iconBg="bg-[#10b981]" />
        <MetricCard title="Compliance Status" value="98%" subtitle="2 filings pending" icon={<Shield className="size-5 text-white" strokeWidth={1.75} />} iconBg="bg-[#10b981]" />
        <MetricCard title="Risk Alerts" value="3 Medium" subtitle="1 Critical" icon={<AlertTriangle className="size-5 text-white" strokeWidth={1.75} />} iconBg="bg-[#f59e0b]" />
      </div>

      {/* AI Insights + Financial */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <AIInsightsPanel />
        <FinancialOverview />
      </div>

      {/* Global Entity Overview */}
      <div className="mb-6">
        <h2 className="font-bold text-[#0f172b] text-[20px] mb-4">Global Entity Overview</h2>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {globalEntities.map((entity, i) => (
            <EntityCard key={i} entity={entity} />
          ))}
        </div>
      </div>

      {/* Automation + Activity */}
      <div className="grid grid-cols-2 gap-6">
        <AutomationSnapshot />
        <ActivityTimeline />
      </div>
    </div>
  );
}
