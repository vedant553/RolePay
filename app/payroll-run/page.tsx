"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, Users, Shield, AlertTriangle, Play, ChevronRight } from "lucide-react";
import {
  payrollSteps,
  currentCycle,
  financialBreakdown,
  payrollEntities,
  monthlyPayrollData,
} from "@/lib/data/payroll";
import StepTracker from "@/components/ui/StepTracker";
import Link from "next/link";

const entityStatusColors: Record<string, string> = {
  approved: "#10b981",
  processing: "#3b82f6",
  review: "#f59e0b",
  ready: "#8b5cf6",
};

const entityStatusBg: Record<string, string> = {
  approved: "#d1fae5",
  processing: "#dbeafe",
  review: "#fef3c7",
  ready: "#ede9fe",
};

function EntityRow({ entity }: { entity: typeof payrollEntities[0] }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-[#0f172b] text-[15px]">{entity.entity}</h3>
            <span className="text-[12px] text-[#90a1b9]">• {entity.country}</span>
          </div>
          <p className="text-[#62748e] text-[12px]">{entity.employees} employees</p>
        </div>
        <span className="px-2.5 py-1 rounded-md text-[12px] font-bold capitalize"
          style={{ backgroundColor: entityStatusBg[entity.status], color: entityStatusColors[entity.status] }}>
          {entity.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-[#90a1b9] uppercase tracking-wider mb-0.5">Gross Payroll</p>
          <p className="font-bold text-[#0f172b] text-[16px]">{entity.grossPayroll}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#90a1b9] uppercase tracking-wider mb-0.5">Net Payroll</p>
          <p className="font-bold text-[#10b981] text-[16px]">{entity.netPayroll}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded ${
          entity.riskLevel === "low" ? "bg-[#d1fae5] text-[#10b981]" :
          entity.riskLevel === "medium" ? "bg-[#fef3c7] text-[#f59e0b]" : "bg-[#fee2e2] text-[#ef4444]"
        }`}>
          <AlertTriangle className="size-3" strokeWidth={2} />
          {entity.riskLevel === "low" ? "Low Risk" : entity.riskLevel === "medium" ? "Medium Risk" : "High Risk"}
        </div>
        <button className="flex items-center gap-1 text-[#10b981] text-[12px] font-bold hover:opacity-80">
          View Details <ChevronRight className="size-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function PayrollRunPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "control">("overview");

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[24px] font-bold text-[#0f172b]">Payroll Run – March 2026</h1>
            <span className="bg-[#0f172b] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Live</span>
          </div>
          <p className="text-[#62748e] text-[14px]">AI-powered reconciliation in progress for 4 global entities.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-1">
          {(["overview", "control"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-colors capitalize ${activeTab === tab ? "bg-white text-[#0f172b] shadow-sm" : "text-[#90a1b9] hover:text-[#0f172b]"}`}>
              {tab === "overview" ? "Global View" : "Control"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Gross Payroll", value: currentCycle.totalGross, sub: "▲ 12.5% vs Last Month", icon: DollarSign, color: "bg-[#10b981]" },
          { title: "Active Headcount", value: currentCycle.employeesCount.toLocaleString(), sub: "▲ 0.4% vs Last Month", icon: Users, color: "bg-[#3b82f6]" },
          { title: "Tax & Compliance", value: currentCycle.taxCompliance, sub: "Optimized", icon: Shield, color: "bg-[#10b981]" },
          { title: "Manual Overrides", value: currentCycle.manualOverrides.toString(), sub: "▼ 24% vs Last Month", icon: AlertTriangle, color: "bg-[#f59e0b]" },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-6 shadow-sm">
            <div className={`${card.color} rounded-xl size-9 flex items-center justify-center mb-4`}>
              <card.icon className="size-4 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[11px] font-bold text-[#62748e] uppercase tracking-[0.55px] mb-1">{card.title}</p>
            <p className="text-[24px] font-bold text-[#0f172b] tracking-tight mb-1">{card.value}</p>
            <p className="text-[10px] text-[#90a1b9]">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Step Tracker */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-[#0f172b] text-[16px] mb-6">Payroll Lifecycle – March 2026</h2>
        <StepTracker steps={payrollSteps} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Financial Breakdown */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Financial Breakdown</h3>
          <div className="space-y-4 mb-6">
            {financialBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[13px] text-[#62748e]">{item.label}</span>
                </div>
                <span className="font-bold text-[#0f172b] text-[15px]">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPayrollData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#90a1b9" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="planned" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Planned" />
                <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: "Run Payroll Simulation", desc: "Test payroll before processing", href: "/payroll-run", color: "bg-[#10b981]", icon: Play },
              { label: "Review Approvals", desc: "2 pending approvals", href: "/payroll-run/approval", color: "bg-[#3b82f6]", icon: Shield },
              { label: "View Disbursement", desc: "Track payment status", href: "/payroll-run/disbursement", color: "bg-[#8b5cf6]", icon: DollarSign },
              { label: "Reconciliation Report", desc: "Bank matching status", href: "/payroll-run/reconciliation", color: "bg-[#f59e0b]", icon: AlertTriangle },
              { label: "Payroll Reports", desc: "Export & analytics", href: "/payroll-run/reporting", color: "bg-[#ec4899]", icon: ChevronRight },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] hover:border-[#10b981]/40 hover:bg-white transition-all cursor-pointer">
                  <div className={`${action.color} rounded-lg size-9 flex items-center justify-center shrink-0`}>
                    <action.icon className="size-4 text-white" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#0f172b] text-[14px]">{action.label}</p>
                    <p className="text-[#62748e] text-[12px]">{action.desc}</p>
                  </div>
                  <ChevronRight className="size-4 text-[#90a1b9]" strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Entity Grid */}
      <div>
        <h2 className="font-bold text-[#0f172b] text-[20px] mb-4">Global Entity Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          {payrollEntities.map((entity, i) => (
            <EntityRow key={i} entity={entity} />
          ))}
        </div>
      </div>
    </div>
  );
}
