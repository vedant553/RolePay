"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Download, ChevronRight, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

const monthlyData = [
  { month: "Oct", gross: 540, net: 455, tax: 85 },
  { month: "Nov", gross: 520, net: 438, tax: 82 },
  { month: "Dec", gross: 580, net: 489, tax: 91 },
  { month: "Jan", gross: 550, net: 463, tax: 87 },
  { month: "Feb", gross: 560, net: 472, tax: 88 },
  { month: "Mar", gross: 565, net: 480, tax: 85 },
];

const entityBreakdown = [
  { name: "USA", value: 38.6 },
  { name: "India", value: 15.8 },
  { name: "Germany", value: 28.1 },
  { name: "Singapore", value: 17.5 },
];

const reports = [
  { name: "Payroll Summary Report – March 2026", type: "PDF", size: "2.4 MB", date: "Apr 1, 2026" },
  { name: "Tax Withholding Report Q1 2026", type: "XLSX", size: "1.1 MB", date: "Apr 1, 2026" },
  { name: "Entity-wise Payroll Breakdown", type: "CSV", size: "840 KB", date: "Apr 1, 2026" },
  { name: "Compliance Audit Trail", type: "PDF", size: "3.2 MB", date: "Apr 1, 2026" },
  { name: "Year-to-Date Payroll Analysis", type: "XLSX", size: "1.8 MB", date: "Apr 1, 2026" },
];

export default function ReportingPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-[12px] text-[#90a1b9] mb-4">
        <Link href="/payroll-run" className="hover:text-[#10b981]">Payroll Run</Link>
        <ChevronRight className="size-3" strokeWidth={2} />
        <span className="text-[#0f172b] font-bold">Reporting</span>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172b] mb-2">Payroll Reporting Dashboard</h1>
          <p className="text-[#62748e] text-[14px]">Analytics, downloads, and audit reports across all entities</p>
        </div>
        <button className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[14px] px-5 py-2.5 rounded-xl shadow-sm transition-colors">
          <Download className="size-4" strokeWidth={2} /> Export All Reports
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Gross YTD", value: "$1.62M", sub: "+8.2% vs prior year", icon: TrendingUp, color: "bg-[#10b981]" },
          { label: "Reports Generated", value: "48", sub: "This quarter", icon: FileText, color: "bg-[#3b82f6]" },
          { label: "Compliance Reports", value: "12", sub: "All filed", icon: FileText, color: "bg-[#8b5cf6]" },
          { label: "Data Accuracy", value: "99.8%", sub: "AI-validated", icon: TrendingUp, color: "bg-[#f59e0b]" },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-5 shadow-sm">
            <div className={`${card.color} rounded-xl size-9 flex items-center justify-center mb-3`}>
              <card.icon className="size-4 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[10px] font-bold text-[#62748e] uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-[24px] font-bold text-[#0f172b] mb-0.5">{card.value}</p>
            <p className="text-[11px] text-[#90a1b9]">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">6-Month Payroll Trends</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#90a1b9" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v) => [`$${v}K`, ""]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="gross" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Gross" />
                <Bar dataKey="net" fill="#10b981" radius={[4, 4, 0, 0]} name="Net" />
                <Bar dataKey="tax" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tax" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Entity Payroll Distribution</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={entityBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {entityBreakdown.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="font-bold text-[#0f172b] text-[16px]">Available Reports</h2>
        </div>
        <div className="divide-y divide-[#e2e8f0]">
          {reports.map((report) => (
            <div key={report.name} className="flex items-center justify-between px-6 py-4 hover:bg-[#f8fafc] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`size-9 rounded-lg flex items-center justify-center font-bold text-[11px] text-white ${report.type === "PDF" ? "bg-[#ef4444]" : report.type === "XLSX" ? "bg-[#10b981]" : "bg-[#3b82f6]"}`}>
                  {report.type}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#0f172b]">{report.name}</p>
                  <p className="text-[12px] text-[#90a1b9]">{report.size} · Generated {report.date}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-[#10b981] font-bold text-[13px] hover:opacity-80">
                <Download className="size-4" strokeWidth={2} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
