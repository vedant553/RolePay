"use client";
import React, { useState } from "react";
import { X, MoreHorizontal, Edit3, AlertTriangle, Download, CheckCircle2 } from "lucide-react";

export function EmployeeProfileDrawer({ open, onClose, employee, onEdit }: { open: boolean, onClose: () => void, employee: any, onEdit: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!open || !employee) return null;

  const hasAlert = employee.bankStatus === "Missing" || employee.complianceStatus !== "Compliant";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "salary", label: "Salary Details" },
    { id: "attendance", label: "Attendance Summary" },
    { id: "payslips", label: "Payslips" },
    { id: "compliance", label: "Compliance Info" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#0f172b]/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-gray-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center shrink-0 shadow-sm text-white font-bold text-xl">
                {employee.avatar || employee.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-gray-900 leading-tight">{employee.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[13px] text-gray-500 font-medium">{employee.id}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-[13px] text-gray-600">{employee.role} • {employee.department}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded ${employee.status === "Active" ? "bg-[#10b981]/10 text-[#10b981]" : employee.status === "Inactive" ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-700"}`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => { onClose(); onEdit(); }} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Edit3 className="size-4 text-gray-500" /> Edit
              </button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm">
                <MoreHorizontal className="size-5" />
              </button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors ml-2">
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Alert Banner */}
          {hasAlert && (
            <div className="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                 <h4 className="text-[13px] font-bold text-amber-800">Action Required</h4>
                 <ul className="text-[12px] text-amber-700 mt-1 list-disc list-inside">
                    {employee.bankStatus === "Missing" && <li>Missing Bank Details: Salary disbursement may fail.</li>}
                    {employee.complianceStatus !== "Compliant" && <li>Compliance Info Incomplete: Review needed statutory data.</li>}
                 </ul>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="px-6 flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`pb-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-[#10b981] text-[#10b981]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
               >
                 {tab.label}
               </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Personal Info</h3>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                   <div><p className="text-gray-500 mb-1">Email</p><p className="font-medium text-gray-900">{employee.email}</p></div>
                   <div><p className="text-gray-500 mb-1">Phone</p><p className="font-medium text-gray-900">+1 (555) 019-2834</p></div>
                   <div><p className="text-gray-500 mb-1">Date of Joining</p><p className="font-medium text-gray-900">Jan 12, 2024</p></div>
                   <div><p className="text-gray-500 mb-1">Location</p><p className="font-medium text-gray-900">{employee.countryCode} {employee.country}</p></div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Job Info</h3>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                   <div><p className="text-gray-500 mb-1">Department</p><p className="font-medium text-gray-900">{employee.department}</p></div>
                   <div><p className="text-gray-500 mb-1">Role</p><p className="font-medium text-gray-900">{employee.role}</p></div>
                   <div><p className="text-gray-500 mb-1">Type</p><p className="font-medium text-gray-900">Full-Time</p></div>
                   <div><p className="text-gray-500 mb-1">Manager</p><p className="font-medium text-gray-900">Alex Carter</p></div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm relative">
                <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                   Bank Info
                   {employee.bankStatus === "Valid" ? 
                     <span className="flex items-center text-[#10b981] text-[11px] font-bold bg-[#10b981]/10 px-2 py-0.5 rounded"><CheckCircle2 className="size-3 mr-1" /> Valid</span> :
                     <span className="flex items-center text-amber-600 text-[11px] font-bold bg-amber-100 px-2 py-0.5 rounded"><AlertTriangle className="size-3 mr-1" /> Missing Data</span>
                   }
                </h3>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                   <div><p className="text-gray-500 mb-1">Bank Name</p><p className="font-medium text-gray-900">{employee.bankStatus === "Valid" ? "Chase Bank NA" : "—"}</p></div>
                   <div><p className="text-gray-500 mb-1">Account Number</p><p className="font-medium text-gray-900">{employee.bankStatus === "Valid" ? "**** **** 9238" : "—"}</p></div>
                   <div><p className="text-gray-500 mb-1">Routing / IFSC</p><p className="font-medium text-gray-900">{employee.bankStatus === "Valid" ? "CHA10293X" : "—"}</p></div>
                </div>
              </div>
            </div>
          )}

          {/* SALARY DETAILS TAB */}
          {activeTab === "salary" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-[13px] text-gray-500 mb-1">Current Structure</p>
                    <p className="text-[16px] font-bold text-gray-900">{employee.salaryTemplate}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[13px] text-gray-500 mb-1">Gross Annual</p>
                    <p className="text-[20px] font-bold text-[#10b981]">{employee.grossSalary}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="text-[13px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Earnings Breakdown (Monthly)</h3>
                  <div className="space-y-3 text-[13px]">
                     <div className="flex justify-between"><span className="text-gray-600">Basic Pay</span><span className="font-medium text-gray-900">40%</span></div>
                     <div className="flex justify-between"><span className="text-gray-600">HRA</span><span className="font-medium text-gray-900">20%</span></div>
                     <div className="flex justify-between"><span className="text-gray-600">Special Allowance</span><span className="font-medium text-gray-900">20%</span></div>
                     <div className="flex justify-between"><span className="text-gray-600">Variable / Bonus</span><span className="font-medium text-gray-900">{employee.variablePercent}%</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="text-[13px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Deductions (Monthly)</h3>
                  <div className="space-y-3 text-[13px]">
                     <div className="flex justify-between"><span className="text-gray-600">Tax / TDS</span><span className="font-medium text-red-600">Variable</span></div>
                     <div className="flex justify-between"><span className="text-gray-600">PF / Statutory</span><span className="font-medium text-red-600">Standard</span></div>
                     <div className="flex justify-between"><span className="text-gray-600">Health Insurance</span><span className="font-medium text-red-600">Optional</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                 {[
                   { label: "Present Days", value: "22", sub: "This month" },
                   { label: "Absences", value: "1", sub: "Unplanned" },
                   { label: "Late Marks", value: "2", sub: "-0.5 day deduction" },
                   { label: "Overtime", value: "12 hrs", sub: "Approved" }
                 ].map((stat, i) => (
                   <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                      <p className="text-[12px] text-gray-500 font-medium mb-1">{stat.label}</p>
                      <p className="text-[24px] font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-[11px] text-gray-400">{stat.sub}</p>
                   </div>
                 ))}
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                 <table className="w-full text-left">
                   <thead className="bg-gray-50 border-b border-gray-200">
                     <tr>
                       {["Date", "Shift", "Status", "Hours"].map(h => <th key={h} className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 text-[13px]">
                     <tr>
                       <td className="py-3 px-4 font-medium text-gray-900">Oct 24, 2024</td>
                       <td className="py-3 px-4 text-gray-600">09:00 - 18:00</td>
                       <td className="py-3 px-4"><span className="text-[#10b981] font-medium bg-[#10b981]/10 px-2 py-0.5 rounded">Present</span></td>
                       <td className="py-3 px-4 text-gray-600">8h 45m</td>
                     </tr>
                     <tr>
                       <td className="py-3 px-4 font-medium text-gray-900">Oct 23, 2024</td>
                       <td className="py-3 px-4 text-gray-600">09:00 - 18:00</td>
                       <td className="py-3 px-4"><span className="text-amber-600 font-medium bg-amber-100 px-2 py-0.5 rounded">Late</span></td>
                       <td className="py-3 px-4 text-gray-600">7h 30m</td>
                     </tr>
                   </tbody>
                 </table>
              </div>
            </div>
          )}

          {/* PAYSLIPS TAB */}
          {activeTab === "payslips" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 border-b border-gray-200">
                   <tr>
                     {["Month", "Gross Salary", "Net Salary", "Status", "Action"].map(h => <th key={h} className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-[13px]">
                   {["September 2024", "August 2024", "July 2024"].map((month, i) => (
                     <tr key={month} className="hover:bg-gray-50 transition-colors">
                       <td className="py-4 px-4 font-bold text-gray-900">{month}</td>
                       <td className="py-4 px-4 text-gray-600">{employee.grossSalary}</td>
                       <td className="py-4 px-4 font-medium text-gray-900">Calculated</td>
                       <td className="py-4 px-4"><span className="text-[#10b981] font-bold bg-[#10b981]/10 px-2 py-0.5 rounded">Paid</span></td>
                       <td className="py-4 px-4">
                          <button className="flex items-center gap-1.5 text-[#3b82f6] hover:text-blue-700 font-medium transition-colors">
                             <Download className="size-3.5" /> Download
                          </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          )}

          {/* COMPLIANCE TAB */}
          {activeTab === "compliance" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Statutory Deductions</h3>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                   <div>
                     <p className="text-gray-500 mb-1">Tax Status</p>
                     <p className="font-medium text-gray-900">{employee.complianceStatus === "Compliant" ? "Verified" : "Pending Verification"}</p>
                   </div>
                   <div>
                     <p className="text-gray-500 mb-1">PF / Retirement Applicability</p>
                     <p className="font-medium text-gray-900">Applicable (Mandatory)</p>
                   </div>
                   <div>
                     <p className="text-gray-500 mb-1">Tax ID / PAN</p>
                     <p className="font-medium text-gray-900">{employee.complianceStatus === "Compliant" ? "AXXXP1234K" : "Missing"}</p>
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
