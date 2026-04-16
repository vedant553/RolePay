"use client";

import { useState, useMemo, useEffect } from "react";
import { Upload, RefreshCw, Search, Calendar as CalendarIcon, MapPin, CheckCircle, AlertTriangle, Clock, X, Plus, Edit3, Filter } from "lucide-react";
import { employeeStats } from "@/lib/data/employees"; // Just for total employees

// --- MOCK DATA ---
const MOCK_ATTENDANCE_LOG = [
  { id: "LOG-1", employee: "Sarah Johnson", avatar: "SJ", date: "2026-04-16", checkIn: "08:50 AM", checkOut: "06:10 PM", status: "Present", source: "Biometric" },
  { id: "LOG-2", employee: "Marcus Chen", avatar: "MC", date: "2026-04-16", checkIn: "09:05 AM", checkOut: "06:00 PM", status: "Present", source: "GPS" },
  { id: "LOG-3", employee: "Elena Rodriguez", avatar: "ER", date: "2026-04-16", checkIn: "—", checkOut: "—", status: "Absent", source: "—" },
  { id: "LOG-4", employee: "James Mitchell", avatar: "JM", date: "2026-04-16", checkIn: "09:30 AM", checkOut: "06:15 PM", status: "Present", source: "Biometric" },
  { id: "LOG-5", employee: "Priya Sharma", avatar: "PS", date: "2026-04-16", checkIn: "—", checkOut: "—", status: "Leave", source: "—" },
  { id: "LOG-6", employee: "Thomas Weber", avatar: "TW", date: "2026-04-15", checkIn: "08:45 AM", checkOut: "08:30 PM", status: "Present", source: "Biometric" },
];

const MOCK_SUMMARY = [
  { id: "EMP-2401", employee: "Sarah Johnson", avatar: "SJ", totalDays: 22, present: 22, absent: 0, lateMarks: 0, overtime: "4 hrs", payrollImpact: "Standard" },
  { id: "EMP-2402", employee: "Marcus Chen", avatar: "MC", totalDays: 22, present: 21, absent: 1, lateMarks: 2, overtime: "0 hrs", payrollImpact: "-1 Day Base" },
  { id: "EMP-2403", employee: "Elena Rodriguez", avatar: "ER", totalDays: 22, present: 19, absent: 3, lateMarks: 0, overtime: "0 hrs", payrollImpact: "-3 Days Base" },
  { id: "EMP-2404", employee: "James Mitchell", avatar: "JM", totalDays: 22, present: 22, absent: 0, lateMarks: 1, overtime: "12 hrs", payrollImpact: "+12 Hrs OT" },
  { id: "EMP-2405", employee: "Priya Sharma", avatar: "PS", totalDays: 22, present: 20, absent: 0, lateMarks: 0, overtime: "0 hrs", payrollImpact: "Leave Covered" },
];

const MOCK_HOLIDAYS = [
  { id: "HOL-1", date: "2026-01-01", name: "New Year's Day", type: "National", location: "Global" },
  { id: "HOL-2", date: "2026-05-01", name: "Labor Day", type: "National", location: "Global" },
  { id: "HOL-3", date: "2026-07-04", name: "Independence Day", type: "Regional", location: "USA" },
  { id: "HOL-4", date: "2026-10-31", name: "Diwali", type: "Regional", location: "India" },
  { id: "HOL-5", date: "2026-12-25", name: "Christmas", type: "National", location: "Global" },
];

// --- TOAST COMPONENT ---
function Toast({ toast }: { toast: { message: string, type: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-xl font-medium text-white transition-all transform ${
      toast.type === "success" ? "bg-[#10b981]" : toast.type === "error" ? "bg-red-500" : "bg-amber-500"
    }`}>
      {toast.message}
    </div>
  );
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const triggerToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSync = () => {
    triggerToast("Pulling automated records from Bio & GPS API...", "success");
  };

  const filteredLogs = useMemo(() => {
     return MOCK_ATTENDANCE_LOG.filter(log => {
        if (searchQuery && !log.employee.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (statusFilter && log.status !== statusFilter) return false;
        if (dateFilter && log.date !== dateFilter) return false;
        return true;
     });
  }, [searchQuery, statusFilter, dateFilter]);

  return (
    <div className="relative pb-10">
      <Toast toast={toast} />

      {/* Header Area */}
      <div className="flex items-end justify-between mb-6">
         <div>
           <h1 className="text-[28px] font-bold text-[#0f172b]">Attendance Sync</h1>
           <p className="text-[14px] text-[#64748b]">Manage attendance data for accurate payroll processing</p>
         </div>
         <div className="flex items-center gap-3">
           <button onClick={() => triggerToast("Upload Modal Triggered")} className="bg-white border border-gray-300 text-gray-700 h-[38px] px-4 rounded-lg flex items-center gap-2 font-medium text-[13px] hover:bg-gray-50 transition-colors shadow-sm">
             <Upload className="size-4" /> Upload Data (CSV)
           </button>
           <button onClick={handleSync} className="bg-[#10b981] text-white h-[38px] px-4 rounded-lg flex items-center gap-2 font-medium text-[13px] hover:bg-[#0ea370] transition-colors shadow-sm">
             <RefreshCw className="size-4" /> Sync Attendance
           </button>
         </div>
      </div>

      <div className="flex gap-6 mb-8">
         <div className="flex-1">
            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-3">
               {[
                 { label: "Total Target Days", value: "22", icon: CalendarIcon, color: "text-blue-600" },
                 { label: "Present Days", value: "20.5", icon: CheckCircle, color: "text-[#10b981]" },
                 { label: "Total Absences", value: "4", icon: AlertTriangle, color: "text-red-500" },
                 { label: "Late Marks", value: "3", icon: Clock, color: "text-amber-500" },
                 { label: "Overtime Hours", value: "16", icon: Clock, color: "text-purple-600" },
               ].map((card, i) => (
                 <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm flex flex-col justify-center transition-all hover:border-gray-300">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[12px] text-[#64748b] font-medium leading-tight">{card.label}</span>
                     <card.icon className={`size-4 ${card.color}`} />
                   </div>
                   <p className="text-[22px] font-bold text-[#0f172b]">{card.value}</p>
                 </div>
               ))}
            </div>
         </div>

         {/* Sync Status Panel */}
         <div className="w-[300px] shrink-0 bg-[#0f172b] rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
               <span className="text-[13px] font-bold text-white">Sync Status</span>
               <div className="flex items-center gap-1">
                  <span className="relative flex size-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span><span className="relative inline-flex rounded-full size-2 bg-[#10b981]"></span></span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Live</span>
               </div>
            </div>
            <div className="p-4 space-y-4">
               <div>
                  <div className="flex justify-between text-[12px] mb-1"><span className="text-gray-400">Biometric Links</span><span className="text-[#10b981] font-bold">Connected (4)</span></div>
               </div>
               <div>
                  <div className="flex justify-between text-[12px] mb-1"><span className="text-gray-400">GPS Trackers</span><span className="text-[#10b981] font-bold">Active</span></div>
               </div>
               <div className="pt-3 mt-1 border-t border-gray-800">
                  <div className="flex justify-between text-[12px]"><span className="text-gray-400">Last Synced</span><span className="text-white font-medium">Today, 09:30 AM</span></div>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         
         {/* Tabs */}
         <div className="flex items-center justify-between border-b border-gray-200 px-6 bg-gray-50/50">
            <div className="flex gap-6">
               {[
                 { id: "log", label: "Daily Log" },
                 { id: "summary", label: "Monthly Summary" },
                 { id: "holidays", label: "Holiday Calendar" }
               ].map((tab) => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-[#10b981] text-[#10b981]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                 >
                    {tab.label}
                 </button>
               ))}
            </div>
            
            {activeTab === "log" && (
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                    <input type="text" placeholder="Search employee..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-[180px] pl-8 pr-3 py-1.5 text-[12px] border border-gray-300 rounded-md focus:ring-1 focus:ring-[#10b981] outline-none" />
                 </div>
                 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[120px] px-2 py-1.5 text-[12px] text-gray-700 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#10b981] outline-none">
                    <option value="">All Statuses</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                 </select>
                 <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-[130px] px-2 py-1.5 text-[12px] text-gray-700 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#10b981] outline-none" />
              </div>
            )}

            {activeTab === "holidays" && (
               <button onClick={() => triggerToast("Add Holiday Modal Triggered")} className="bg-gray-900 text-white h-[32px] px-3 rounded-md flex items-center gap-1.5 font-medium text-[12px] hover:bg-gray-800 transition-colors shadow-sm">
                 <Plus className="size-3.5" /> Add Holiday
               </button>
            )}
         </div>

         {/* TAB CONTENTS */}
         
         {/* TAB 1: LOG */}
         {activeTab === "log" && (
            <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] border-b border-gray-200">
                     <tr>
                        {["Employee", "Date", "Check-in", "Check-out", "Status", "Source", "Action"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                           <td className="py-3 px-6">
                              <div className="flex items-center gap-2">
                                 <div className="size-7 rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center shrink-0 shadow-sm"><span className="text-white font-bold text-[10px]">{log.avatar}</span></div>
                                 <span className="font-medium text-[13px] text-gray-900">{log.employee}</span>
                              </div>
                           </td>
                           <td className="py-3 px-6 text-[13px] text-gray-600">{log.date}</td>
                           <td className="py-3 px-6 text-[13px] font-medium text-gray-900">{log.checkIn}</td>
                           <td className="py-3 px-6 text-[13px] font-medium text-gray-900">{log.checkOut}</td>
                           <td className="py-3 px-6">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                                 log.status === "Present" ? "bg-[#10b981]/10 text-[#10b981]" : log.status === "Absent" ? "bg-red-50 text-red-600" : "bg-amber-100 text-amber-700"
                              }`}>{log.status}</span>
                           </td>
                           <td className="py-3 px-6">
                              <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">{log.source}</span>
                           </td>
                           <td className="py-3 px-6 text-left">
                              <button onClick={() => triggerToast("Only authorized administrators can edit operational logs.", "warning")} className="text-gray-400 hover:text-gray-900 flex items-center gap-1.5 text-[12px] font-medium transition-colors">
                                 <Edit3 className="size-3.5" /> Edit
                              </button>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={7} className="text-center py-12 text-gray-500 text-[13px] font-medium">No logs found matching your filters.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         )}

         {/* TAB 2: SUMMARY */}
         {activeTab === "summary" && (
            <div className="flex-1 overflow-x-auto">
               <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                  <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Showing Summary For:</span>
                  <select className="bg-white border border-gray-300 rounded text-[12px] font-medium px-2 py-1 outline-none">
                     <option>April 2026</option>
                     <option>March 2026</option>
                  </select>
               </div>
               <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] border-b border-gray-200">
                     <tr>
                        {["Employee", "Total Target Days", "Present", "Absent", "Late Marks", "Overtime", "Payroll Impact"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {MOCK_SUMMARY.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                           <td className="py-3 px-6">
                              <div className="flex items-center gap-2">
                                 <div className="size-7 rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center shrink-0 shadow-sm"><span className="text-white font-bold text-[10px]">{row.avatar}</span></div>
                                 <span className="font-medium text-[13px] text-gray-900">{row.employee}</span>
                              </div>
                           </td>
                           <td className="py-3 px-6 text-[13px] text-gray-600">{row.totalDays}</td>
                           <td className="py-3 px-6 text-[13px] font-bold text-[#10b981]">{row.present}</td>
                           <td className="py-3 px-6 text-[13px] font-bold text-red-500">{row.absent}</td>
                           <td className="py-3 px-6 text-[13px] font-medium text-amber-600">{row.lateMarks}</td>
                           <td className="py-3 px-6 text-[13px] font-medium text-purple-600">{row.overtime}</td>
                           <td className="py-3 px-6">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                                 row.payrollImpact === "Standard" ? "bg-gray-100 text-gray-600" : row.payrollImpact.includes("-") ? "bg-red-50 text-red-600 border border-red-100" : row.payrollImpact.includes("+") ? "bg-[#10b981]/10 text-[#10b981]" : "bg-blue-50 text-blue-600"
                              }`}>{row.payrollImpact}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {/* TAB 3: HOLIDAYS */}
         {activeTab === "holidays" && (
            <div className="flex-1 flex flex-col">
               <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Region Select:</span>
                     <select className="bg-white border border-gray-300 rounded text-[12px] font-medium px-2 py-1 outline-none focus:ring-1 focus:ring-[#10b981]">
                        <option>Global Standard</option>
                        <option>USA Branch</option>
                        <option>India Branch</option>
                        <option>Germany Branch</option>
                     </select>
                  </div>
                  <div className="text-[11px] font-medium text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                     <CheckCircle className="size-3" /> Holidays automatically evaluate as "Present - Paid" during Payroll Runs.
                  </div>
               </div>
               
               <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left">
                     <thead className="bg-[#f8fafc] border-b border-gray-200">
                        <tr>
                           {["Date", "Holiday Name", "Type", "Scope / Location", "Action"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {MOCK_HOLIDAYS.map((holiday) => (
                           <tr key={holiday.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-6 text-[13px] font-bold text-gray-900">{new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</td>
                              <td className="py-4 px-6 text-[13px] font-medium text-gray-900">{holiday.name}</td>
                              <td className="py-4 px-6">
                                 <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                                    holiday.type === "National" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-purple-50 text-purple-600 border border-purple-100"
                                 }`}>{holiday.type}</span>
                              </td>
                              <td className="py-4 px-6 text-[13px] font-medium text-gray-600 flex items-center gap-1"><MapPin className="size-3 text-gray-400" /> {holiday.location}</td>
                              <td className="py-4 px-6 text-left">
                                 <div className="flex gap-2">
                                    <button onClick={() => triggerToast("Edit Holiday", "success")} className="text-gray-400 hover:text-gray-900 flex items-center gap-1.5 text-[12px] font-medium transition-colors">
                                       <Edit3 className="size-3.5" /> Edit
                                    </button>
                                    <button onClick={() => triggerToast("Disabled: Cannot delete locked historical holiday map.", "error")} className="text-gray-400 hover:text-red-600 flex items-center gap-1.5 text-[12px] font-medium transition-colors ml-2">
                                       <X className="size-3.5" /> Delete
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
