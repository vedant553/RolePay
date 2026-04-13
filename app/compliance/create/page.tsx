"use client";

import { ArrowLeft, Shield, Zap, Globe, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ComplianceCreatePage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-[12px] text-[#90a1b9] mb-4">
        <Link href="/compliance" className="hover:text-[#10b981]">Compliance</Link>
        <span>/</span>
        <span className="text-[#0f172b] font-bold">Create Rule</span>
      </div>
      <Link href="/compliance" className="inline-flex items-center gap-2 text-[#10b981] font-bold text-[14px] mb-6 hover:opacity-80">
        <ArrowLeft className="size-4" strokeWidth={2.5} /> Back to Compliance
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl p-2.5">
          <Shield className="size-5 text-white" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172b]">Create Compliance Rule</h1>
          <p className="text-[14px] text-[#62748e]">Define automated compliance rules for specific jurisdictions and events</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-[18px] text-[#0f172b] mb-5">Rule Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">Rule Name</label>
                <input type="text" placeholder="e.g. EPF Monthly Auto-Filing" className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">Jurisdiction</label>
                  <select className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40">
                    <option>Select Jurisdiction</option>
                    <option>India</option>
                    <option>USA</option>
                    <option>Germany</option>
                    <option>UK</option>
                    <option>Singapore</option>
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">Regulation Type</label>
                  <select className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40">
                    <option>Select Type</option>
                    <option>EPF/PF</option>
                    <option>TDS</option>
                    <option>Social Security</option>
                    <option>Income Tax</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">Trigger Condition</label>
                <input type="text" placeholder="e.g. When payroll cycle closes" className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40" />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">Automated Action</label>
                <select className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40">
                  <option>Select Action</option>
                  <option>Auto-file with portal</option>
                  <option>Notify team + file</option>
                  <option>Deduct from payroll</option>
                  <option>Generate report</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">Filing Due Date Rule</label>
                <input type="text" placeholder="e.g. 15th of every month" className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40" />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">Alert Threshold (days before due)</label>
                <input type="number" placeholder="e.g. 5" defaultValue={5} className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[14px] h-11 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Shield className="size-4" strokeWidth={2} /> Save Rule
                </button>
                <button className="flex-1 border border-[#e2e8f0] text-[#0f172b] font-bold text-[14px] h-11 rounded-xl hover:bg-[#f8fafc] transition-colors">
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview + AI Suggestions */}
        <div className="space-y-4">
          <div className="bg-[#0f172b] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-1.5 bg-[#10b981] rounded-full animate-pulse" />
              <span className="text-[#10b981] font-bold text-[12px]">AI Compliance Advisor</span>
            </div>
            <h3 className="font-bold text-[18px] mb-1">Smart Suggestions</h3>
            <p className="text-white/50 text-[12px] mb-5">Based on your selected jurisdiction and regulation type</p>
            {[
              { icon: Zap, title: "Auto-calculation available", desc: "EPF can be auto-calculated based on Basic + DA salary components" },
              { icon: AlertTriangle, title: "Due date alert", desc: "EPF due date is 15th — set alert for day 10 to allow processing time" },
              { icon: Globe, title: "Multi-entity scope", desc: "This rule can be applied to all Indian entities simultaneously" },
            ].map((suggestion, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
                <div className="flex items-start gap-3">
                  <suggestion.icon className="size-4 text-[#10b981] shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <p className="font-bold text-[13px] text-[#10b981] mb-0.5">{suggestion.title}</p>
                    <p className="text-[12px] text-white/60">{suggestion.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0f172b] text-[15px] mb-4">Active Rules Preview</h3>
            <div className="space-y-3">
              {["EPF Auto-Filing", "TDS Deduction Rule", "Overtime Threshold Alert", "PAYE Calculation"].map((rule) => (
                <div key={rule} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-[#10b981] rounded-full" />
                    <span className="text-[13px] font-bold text-[#0f172b]">{rule}</span>
                  </div>
                  <span className="text-[11px] bg-[#d1fae5] text-[#10b981] px-2 py-0.5 rounded font-bold">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
