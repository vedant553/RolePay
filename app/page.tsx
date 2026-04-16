"use client";

import { Users, FileText, CheckCircle2, AlertTriangle, Clock, Link2, ShieldAlert, ArrowRight, ShieldCheck, Database, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  
  // --- MOCK KPI DATA ---
  const kpis = [
    { label: "Total Employees", value: "248", icon: Users, color: "text-blue-500" },
    { label: "Payroll Config", value: "In Progress", icon: Clock, color: "text-amber-500", highlight: true },
    { label: "Pending Approvals", value: "3", icon: FileText, color: "text-purple-500" },
    { label: "Failed Payments", value: "2", icon: CreditCard, color: "text-red-500", highlight: true },
    { label: "Compliance Flow", value: "Compliant", icon: ShieldCheck, color: "text-[#10b981]" }
  ];

  // --- MOCK ALERTS ---
  const alerts = [
    { id: 1, route: "/employees", message: "14 employee profiles missing verified core bank details.", severity: "High", action: "Fix Profiles" },
    { id: 2, route: "/banking", message: "2 transaction nodes bounced via NEFT (Invalid IFSC).", severity: "High", action: "Resolve Banks" },
    { id: 3, route: "/attendance", message: "Biometric attendance delta not synced for current month.", severity: "Medium", action: "Sync System" },
    { id: 4, route: "/compliance", message: "USA standard tax identifier updates pending completion.", severity: "Low", action: "View Compliance" }
  ];

  // --- MOCK ACTIVITIES ---
  const activities = [
    { id: 1, time: "Today, 10:45 AM", action: "Attendance Structure Synchronized", user: "System Bot", module: "Attendance" },
    { id: 2, time: "Today, 09:12 AM", action: "Salary Rule Framework Modified", user: "Sarah Johnson", module: "Salary Management" },
    { id: 3, time: "Yesterday, 05:30 PM", action: "Batch Disbursal Initiated", user: "Marcus Chen", module: "Payroll Run" },
  ];

  const deadlines = [
    { id: 1, date: "Oct 25, 2026", label: "Monthly PF / Compliance Filing" },
    { id: 2, date: "Oct 28, 2026", label: "Final Payroll Base Processing" },
    { id: 3, date: "Nov 01, 2026", label: "Disbursement Ledger Closure" },
  ];

  return (
    <div className="relative pb-10">
      
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
         <div>
           <h1 className="text-[28px] font-bold text-[#0f172b]">Executive Dashboard</h1>
           <p className="text-[14px] text-[#64748b]">System readiness check and structural alerts layer.</p>
         </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
         {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
               <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">{kpi.label}</span>
                     <Icon className={`size-4 ${kpi.color}`} />
                  </div>
                  <div>
                     <span className={`text-[18px] font-bold ${kpi.highlight && kpi.color.includes("amber") ? "text-amber-600 bg-amber-50 px-2 py-0.5 rounded" : kpi.highlight && kpi.color.includes("red") ? "text-red-700 bg-red-50 px-2 py-0.5 rounded" : "text-gray-900"}`}>{kpi.value}</span>
                  </div>
               </div>
            );
         })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* LEFT COLUMN */}
         <div className="lg:col-span-2 space-y-6 flex flex-col">
            
            {/* ALERTS & WARNINGS */}
            <div className="bg-white border border-red-100 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
               <div className="px-5 py-4 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-red-900 flex items-center gap-2"><ShieldAlert className="size-4" /> Priority Intervention Required</h2>
                  <span className="text-[11px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">{alerts.filter(a => a.severity === "High").length} Critical</span>
               </div>
               <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
                  {alerts.map(alert => (
                     <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5">
                              {alert.severity === "High" ? <AlertTriangle className="size-4 text-red-500" /> : alert.severity === "Medium" ? <AlertTriangle className="size-4 text-amber-500" /> : <Database className="size-4 text-blue-500" />}
                           </div>
                           <div>
                              <p className="text-[13px] font-bold text-gray-900 mb-0.5">{alert.message}</p>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${alert.severity === "High" ? "text-red-500" : alert.severity === "Medium" ? "text-amber-600" : "text-blue-500"}`}>{alert.severity} Priority</span>
                           </div>
                        </div>
                        <Link href={alert.route} className="shrink-0 text-[12px] font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors">
                           {alert.action} <ChevronRight className="size-3 text-gray-400" />
                        </Link>
                     </div>
                  ))}
               </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
               <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
                  <h2 className="text-[14px] font-bold text-gray-800">Recent Trace Log</h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-[#f8fafc] border-b border-gray-200">
                        <tr>{["Timestamp", "Action Registered", "Actor", "Context"].map(h => <th key={h} className="text-left py-2.5 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 text-[13px]">
                        {activities.map(act => (
                           <tr key={act.id} className="hover:bg-gray-50">
                              <td className="py-3 px-5 text-gray-500 font-medium whitespace-nowrap">{act.time}</td>
                              <td className="py-3 px-5 font-bold text-gray-900 border-l border-gray-100">{act.action}</td>
                              <td className="py-3 px-5 font-medium text-gray-700">{act.user}</td>
                              <td className="py-3 px-5 font-medium text-gray-500"><span className="bg-gray-100 px-2 py-0.5 rounded border text-[11px] font-bold tracking-wide">{act.module}</span></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

         </div>

         {/* RIGHT COLUMN */}
         <div className="space-y-6 flex flex-col">
            
            {/* PAYROLL READINESS Progress */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
               <h2 className="text-[14px] font-bold text-gray-800 mb-4 flex items-center gap-2"><CheckCircle2 className="size-4 text-[#10b981]" /> Payroll Readiness Sequence</h2>
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[28px] font-black text-gray-900 leading-none">232</p>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mt-1">Ready for Disbursal</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[20px] font-bold text-red-500 leading-none">16</p>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mt-1">Flagged / Not Ready</p>
                     </div>
                  </div>
                  
                  {/* Clean progress bar */}
                  <div className="w-full bg-red-100 rounded-full h-2.5 overflow-hidden flex">
                     <div className="bg-[#10b981] h-2.5 rounded-full" style={{ width: '93%' }}></div>
                  </div>
               </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-gray-50/50 border border-gray-200 rounded-xl shadow-sm p-5">
               <h2 className="text-[14px] font-bold text-gray-800 mb-4">Immediate Actions</h2>
               <div className="space-y-2">
                  <Link href="/payroll-run" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-[13px] transition-colors shadow-sm flex items-center justify-between group">
                     Initialize Payroll Batch <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/attendance" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2.5 px-4 rounded-lg text-[13px] transition-colors flex items-center justify-between group">
                     Force Sync Attendance <ArrowRight className="size-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/reports-analytics" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2.5 px-4 rounded-lg text-[13px] transition-colors flex items-center justify-between group">
                     Pull Compliance Reports <ArrowRight className="size-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>

            {/* UPCOMING DEADLINES */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex-1">
               <h2 className="text-[14px] font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock className="size-4 text-amber-500" /> Approaching Limits</h2>
               <div className="space-y-4">
                  {deadlines.map(d => (
                     <div key={d.id} className="flex gap-4">
                        <div className="w-12 shrink-0 flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded p-1">
                           <span className="text-[10px] font-bold uppercase text-gray-400">{d.date.split(' ')[0]}</span>
                           <span className="text-[14px] font-bold text-gray-900 leading-none">{d.date.split(' ')[1].replace(',', '')}</span>
                        </div>
                        <div className="flex-1 flex items-center">
                           <p className="text-[13px] font-medium text-gray-700">{d.label}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
}
