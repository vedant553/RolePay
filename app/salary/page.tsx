"use client";

import { useState } from "react";
import { MoreVertical, Download, Edit2, Trash2, Plus, ArrowLeft, Sparkles } from "lucide-react";

interface Template {
  id: number;
  name: string;
  country: string;
  grade: string;
  baseStructure: string;
  variableRule: string;
  employeesAssigned: number;
  lastModified: string;
  status: "active" | "draft" | "inactive";
}

const mockTemplates: Template[] = [
  { id: 1, name: "Senior Tech - India", country: "India", grade: "L5-L7", baseStructure: "₹45-85L", variableRule: "15% Performance", employeesAssigned: 124, lastModified: "2 days ago", status: "active" },
  { id: 2, name: "Mid-Level Engineering", country: "United States", grade: "L3-L4", baseStructure: "$95-145K", variableRule: "12% + RSU", employeesAssigned: 89, lastModified: "5 days ago", status: "active" },
  { id: 3, name: "Junior Sales - UK", country: "United Kingdom", grade: "S1-S2", baseStructure: "£35-55K", variableRule: "20% Commission", employeesAssigned: 56, lastModified: "1 week ago", status: "active" },
  { id: 4, name: "Marketing Lead - APAC", country: "Singapore", grade: "M4-M5", baseStructure: "S$110-160K", variableRule: "10% Target-based", employeesAssigned: 32, lastModified: "3 days ago", status: "draft" },
  { id: 5, name: "Product Manager - EU", country: "Germany", grade: "P3-P4", baseStructure: "€75-105K", variableRule: "8% Performance", employeesAssigned: 41, lastModified: "1 day ago", status: "active" },
  { id: 6, name: "Finance Analyst - UAE", country: "UAE", grade: "F2-F3", baseStructure: "AED 180-260K", variableRule: "5% Annual Bonus", employeesAssigned: 18, lastModified: "2 weeks ago", status: "inactive" },
  { id: 7, name: "DevOps Engineer - Canada", country: "Canada", grade: "E4-E5", baseStructure: "C$90-130K", variableRule: "10% + Options", employeesAssigned: 28, lastModified: "4 days ago", status: "active" },
  { id: 8, name: "HR Operations - Australia", country: "Australia", grade: "H2-H3", baseStructure: "A$70-95K", variableRule: "No Variable", employeesAssigned: 15, lastModified: "6 days ago", status: "active" },
];

function StatusBadge({ status }: { status: "active" | "draft" | "inactive" }) {
  const styles = {
    active: "bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]",
    draft: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
    inactive: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
  };
  const dots = { active: "bg-[#10b981]", draft: "bg-[#f59e0b]", inactive: "bg-[#94a3b8]" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dots[status]}`} />
      {{ active: "Active", draft: "Draft", inactive: "Inactive" }[status]}
    </span>
  );
}

type View = "list" | "detail" | "builder";

export default function SalaryPage() {
  const [view, setView] = useState<View>("list");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  if (view === "builder") {
    return (
      <div>
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-[#10b981] font-bold text-[14px] mb-6 hover:opacity-80">
          <ArrowLeft className="size-4" strokeWidth={2.5} /> Back to Templates
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl p-2.5">
            <Sparkles className="size-5 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-[#0f172b]">AI Salary Builder</h1>
            <p className="text-[14px] text-[#64748b]">Let AI generate an optimized salary template based on market data</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-[18px] text-[#0f172b] mb-4">Template Configuration</h2>
            <div className="space-y-4">
              {[{ label: "Role Title", placeholder: "e.g. Senior Software Engineer" }, { label: "Country / Jurisdiction", placeholder: "e.g. India" }, { label: "Grade Band", placeholder: "e.g. L5-L7" }].map((field) => (
                <div key={field.label}>
                  <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40" />
                </div>
              ))}
              <div>
                <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">Variable Pay Type</label>
                <select className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40">
                  <option>Performance-linked</option>
                  <option>Commission-based</option>
                  <option>Annual Bonus</option>
                  <option>RSU / Stock Options</option>
                </select>
              </div>
              <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[14px] h-11 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                <Sparkles className="size-4" strokeWidth={2} />
                Generate with AI
              </button>
            </div>
          </div>
          <div className="bg-[#0f172b] rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-2 bg-[#10b981] rounded-full animate-pulse" />
              <span className="text-[#10b981] font-bold text-[13px]">AI Analysis Active</span>
            </div>
            <h3 className="font-bold text-[18px] mb-1">Market Intelligence</h3>
            <p className="text-white/50 text-[13px] mb-6">Based on 15,000+ data points</p>
            {[
              { label: "P25 (Entry)", value: "₹42L/yr" },
              { label: "P50 (Median)", value: "₹65L/yr" },
              { label: "P75 (Target)", value: "₹88L/yr" },
              { label: "P90 (Premium)", value: "₹1.1Cr/yr" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/60 text-[13px]">{item.label}</span>
                <span className="font-bold text-[14px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "detail" && selectedTemplate) {
    return (
      <div>
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-[#10b981] font-bold text-[14px] mb-6 hover:opacity-80">
          <ArrowLeft className="size-4" strokeWidth={2.5} /> Back to Templates
        </button>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white font-bold text-lg">
              {selectedTemplate.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-[#0f172b]">{selectedTemplate.name}</h1>
              <p className="text-[14px] text-[#64748b]">{selectedTemplate.country} • Grade {selectedTemplate.grade} • {selectedTemplate.employeesAssigned} employees</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[14px] font-bold text-[#334155] hover:bg-[#f8fafc]">
              <Edit2 className="size-4" strokeWidth={2} /> Edit Template
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#10b981] text-white rounded-lg text-[14px] font-bold hover:bg-[#0ea872]">
              Apply to Employees
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Base Structure", value: selectedTemplate.baseStructure, color: "text-[#10b981]" },
            { label: "Variable Rule", value: selectedTemplate.variableRule, color: "text-[#3b82f6]" },
            { label: "Last Modified", value: selectedTemplate.lastModified, color: "text-[#f59e0b]" },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
              <p className="text-[12px] font-bold text-[#64748b] uppercase tracking-[0.5px] mb-2">{item.label}</p>
              <p className={`text-[24px] font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">Salary Management</h1>
          <p className="text-[14px] text-[#64748b]">Manage salary templates, structures, and variable pay rules across multiple countries</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[14px] font-bold text-[#334155] hover:bg-[#f8fafc]">
            <Download className="size-4" strokeWidth={2} /> Import Template
          </button>
          <button onClick={() => setView("builder")} className="flex items-center gap-2 px-4 py-2.5 bg-[#10b981] text-white rounded-lg text-[14px] font-bold hover:bg-[#0ea872] shadow-sm">
            <Plus className="size-4" strokeWidth={2.5} /> Create Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { title: "Active Templates", value: "24", change: "+3 this month", positive: true },
          { title: "Countries Covered", value: "12", subtitle: "6 continents" },
          { title: "Employees Assigned", value: "1,847", change: "+126 this quarter", positive: true },
          { title: "With Variable Pay", value: "18", subtitle: "75% of total" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm">
            <p className="text-[13px] font-medium text-[#64748b] mb-2">{card.title}</p>
            <p className="text-[28px] font-bold text-[#0f172a] mb-1">{card.value}</p>
            {"change" in card && card.change && (
              <p className={`text-[12px] font-bold ${card.positive ? "text-[#10b981]" : "text-[#64748b]"}`}>{card.change}</p>
            )}
            {"subtitle" in card && card.subtitle && (
              <p className="text-[12px] text-[#94a3b8]">{card.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-bold text-[#0f172a]">Salary Templates</h2>
            <span className="px-2.5 py-1 bg-[#f1f5f9] text-[#64748b] text-[12px] font-bold rounded-md">{mockTemplates.length} templates</span>
          </div>
          <div className="flex items-center gap-2">
            {["Filter", "Sort", "Export"].map((btn) => (
              <button key={btn} className="px-3 py-1.5 text-[13px] font-bold text-[#64748b] hover:text-[#334155]">{btn}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                {["Template Name", "Country", "Grade / Band", "Base Structure", "Variable Rule", "Employees Assigned", "Last Modified", "Status", "Action"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-bold text-[#64748b] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {mockTemplates.map((t) => (
                <tr key={t.id} onClick={() => { setSelectedTemplate(t); setView("detail"); }} className="hover:bg-[#f8fafc] transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-[12px] font-bold">
                        {t.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[14px] font-bold text-[#0f172a]">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#475569]">{t.country}</td>
                  <td className="px-6 py-4 text-[14px] text-[#475569] font-mono">{t.grade}</td>
                  <td className="px-6 py-4 text-[14px] font-bold text-[#0f172a]">{t.baseStructure}</td>
                  <td className="px-6 py-4 text-[13px] text-[#475569]">{t.variableRule}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#0f172a]">{t.employeesAssigned}</span>
                      <span className="text-[12px] text-[#94a3b8]">employees</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#64748b]">{t.lastModified}</td>
                  <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[Edit2, Trash2, MoreVertical].map((Icon, i) => (
                        <button key={i} onClick={(e) => e.stopPropagation()} className="p-1.5 hover:bg-[#f1f5f9] rounded-md transition-colors">
                          <Icon className="size-4 text-[#64748b]" strokeWidth={1.75} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between">
          <p className="text-[13px] text-[#64748b]">Showing <span className="font-bold text-[#334155]">1-8</span> of <span className="font-bold text-[#334155]">24</span> templates</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-[#e2e8f0] rounded-md text-[13px] font-bold text-[#64748b] hover:bg-[#f8fafc] opacity-50 cursor-not-allowed" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-[#10b981] text-white rounded-md text-[13px] font-bold">1</button>
            {[2, 3].map((n) => (
              <button key={n} className="px-3 py-1.5 border border-[#e2e8f0] rounded-md text-[13px] font-bold text-[#64748b] hover:bg-[#f8fafc]">{n}</button>
            ))}
            <button className="px-3 py-1.5 border border-[#e2e8f0] rounded-md text-[13px] font-bold text-[#64748b] hover:bg-[#f8fafc]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
