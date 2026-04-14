"use client";
import React from "react";
import { X, User, Briefcase, DollarSign, Download, Shield } from "lucide-react";
import { ComplianceBadge } from "./ComplianceBadge";
import { RiskIndicator } from "./RiskIndicator";

export function EmployeeDrawer({ open, onClose, employee }: { open: boolean, onClose: () => void, employee: any }) {
  if (!open || !employee) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-50 transform transition-transform overflow-y-auto flex flex-col border-l border-[#e2e8f0]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[14px]">{employee.name.split(" ").map((n:any) => n[0]).join("")}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0f172b] leading-tight">{employee.name}</h2>
              <p className="text-[12px] text-[#64748b]">{employee.id} • {employee.status}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-md text-[#64748b]">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 flex-1">
          {/* Profile block */}
          <section>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
              <User className="size-3" /> Core Profile
            </h3>
            <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-[#64748b] font-medium">Department</p>
                <p className="text-[13px] font-bold text-[#0f172b]">{employee.department}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#64748b] font-medium">Country / Region</p>
                <p className="text-[13px] font-bold text-[#0f172b]">{employee.countryCode} {employee.country}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] text-[#64748b] font-medium">Corporate Email</p>
                <p className="text-[13px] font-bold text-[#0f172b]">{employee.email}</p>
              </div>
            </div>
          </section>

          {/* Payroll Data */}
          <section>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
              <DollarSign className="size-3" /> Payroll Configuration
            </h3>
            <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] space-y-4">
               <div>
                  <p className="text-[11px] text-[#64748b] font-medium">Salary Template</p>
                  <p className="text-[13px] font-bold text-[#0f172b]">{employee.salaryTemplate}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-[#64748b] font-medium">Gross Total</p>
                    <p className="text-[13px] font-bold text-[#10b981]">{employee.grossSalary}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#64748b] font-medium">Variable Inclusion</p>
                    <p className="text-[13px] font-bold text-[#0f172b]">{employee.variablePercent}%</p>
                  </div>
               </div>
            </div>
          </section>

          {/* Compliance & Risk */}
          <section>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
              <Shield className="size-3" /> Risk & Verification
            </h3>
             <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] flex flex-col gap-3">
               <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#0f172b]">Compliance Status</p>
                  <ComplianceBadge status={employee.complianceStatus} />
               </div>
               <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#0f172b]">Assigned Risk Score</p>
                  <RiskIndicator score={employee.riskScore} />
               </div>
               {employee.complianceStatus === "Review Needed" && (
                 <p className="text-[11px] text-amber-600 bg-amber-50 px-2 py-1 mt-1 rounded border border-amber-100">
                   Missing crucial regional tax documentation for {employee.country}.
                 </p>
               )}
            </div>
          </section>

          {/* History */}
           <section>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3 flex items-center gap-2">
              <Download className="size-3" /> Payslip Lineage
            </h3>
            <div className="border border-[#e2e8f0] rounded-xl overflow-hidden divide-y divide-[#e2e8f0]">
               {["January 2026", "December 2025", "November 2025"].map(month => (
                  <div key={month} className="flex items-center justify-between p-3 bg-white hover:bg-[#f8fafc] cursor-pointer group">
                     <div>
                       <p className="text-[13px] font-bold text-[#0f172b]">{month}</p>
                       <p className="text-[11px] text-[#64748b]">Disbursed</p>
                     </div>
                     <button className="text-[11px] font-bold text-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity">PDF</button>
                  </div>
               ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
