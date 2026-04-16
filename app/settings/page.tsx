"use client";

import { useState } from "react";
import { 
  Settings, Building2, Wallet, Clock, Users, Link2, Bell, Shield, 
  Save, RotateCcw, Plus, Edit2, Trash2, CheckCircle2 
} from "lucide-react";

function Toast({ toast }: { toast: { message: string, type: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-xl font-medium text-white transition-all transform ${
      toast.type === "success" ? "bg-[#10b981]" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"
    }`}>
      {toast.message}
    </div>
  );
}

export default function SettingsPage() {
  const [activeSegment, setActiveSegment] = useState("general");
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  const triggerToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const menuSegments = [
    { id: "general", label: "General Settings", icon: Settings },
    { id: "org", label: "Organization Setup", icon: Building2 },
    { id: "payroll", label: "Payroll Policies", icon: Wallet },
    { id: "attendance", label: "Attendance Policies", icon: Clock },
    { id: "roles", label: "Roles & Permissions", icon: Users },
    { id: "integrations", label: "Integrations", icon: Link2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="relative pb-10 flex gap-8 min-h-[calc(100vh-140px)]">
      <Toast toast={toast} />

      {/* LEFT NAVIGATION */}
      <div className="w-64 shrink-0 flex flex-col h-full">
         <div className="mb-6 px-1">
            <h1 className="text-[28px] font-bold text-[#0f172b]">Settings</h1>
            <p className="text-[13px] text-[#64748b] font-medium leading-tight mt-1">Global logic & access control.</p>
         </div>

         <nav className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-3 space-y-1">
            {menuSegments.map(seg => {
               const Icon = seg.icon;
               const isActive = activeSegment === seg.id;
               return (
                  <button key={seg.id} onClick={() => setActiveSegment(seg.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                     isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}>
                     <Icon className={`size-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                     {seg.label}
                  </button>
               );
            })}
         </nav>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col mt-4">
         <div className="bg-white border border-gray-200 shadow-sm rounded-xl flex-1 overflow-hidden flex flex-col">
            
            {/* Header / Title */}
            <div className="px-8 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center shrink-0">
               <div>
                  <h2 className="text-[18px] font-bold text-gray-900">{menuSegments.find(s => s.id === activeSegment)?.label}</h2>
                  <p className="text-[13px] text-gray-500 font-medium">Configure global mechanics for this module.</p>
               </div>
               {/* Global Actions Contextual */}
               {activeSegment !== "org" && activeSegment !== "roles" && (
                  <div className="flex items-center gap-3">
                     <button onClick={() => triggerToast("Form variables reset to previous saved state.")} className="text-[13px] font-bold text-gray-600 border border-gray-300 hover:bg-gray-100 bg-white px-4 py-2 rounded-lg flex items-center gap-2"><RotateCcw className="size-4" /> Reset</button>
                     <button onClick={() => triggerToast("System configurations saved securely.", "success")} className="text-[13px] font-bold text-white bg-[#0f172b] hover:bg-[#1a2642] px-6 py-2 rounded-lg flex items-center gap-2 shadow-sm"><Save className="size-4" /> Save</button>
                  </div>
               )}
            </div>

            {/* SECTIONS */}
            <div className="flex-1 p-8 overflow-y-auto">
               
               {/* 1. General Settings */}
               {activeSegment === "general" && (
                  <div className="max-w-2xl space-y-6">
                     <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1">Registered Entity Name</label>
                        <input type="text" defaultValue="Enterprise HRMS Systems Inc." className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[13px] font-bold text-gray-700 mb-1">Master Time Zone</label>
                           <select className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                              <option>UTC (Coordinated Universal Time)</option>
                              <option>EST (Eastern Standard Time)</option>
                              <option>IST (Indian Standard Time)</option>
                              <option>GMT (Greenwich Mean Time)</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[13px] font-bold text-gray-700 mb-1">Global Base Currency</label>
                           <select className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                              <option>USD ($)</option>
                              <option>EUR (€)</option>
                              <option>GBP (£)</option>
                              <option>INR (₹)</option>
                           </select>
                        </div>
                     </div>
                     <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1">Standard Date Format</label>
                        <select className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                           <option>MM/DD/YYYY</option>
                           <option>DD/MM/YYYY</option>
                           <option>YYYY-MM-DD</option>
                        </select>
                     </div>
                  </div>
               )}

               {/* 2. Org Setup */}
               {activeSegment === "org" && (
                  <div>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[14px] font-bold text-gray-800">Operational Nodes</h3>
                        <button className="text-[12px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded flex items-center gap-1.5"><Plus className="size-3.5" /> Add Location</button>
                     </div>
                     <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                           <thead className="bg-[#f8fafc] border-b border-gray-200">
                              <tr>{["ID", "Branch / Division", "Department List", "Base Country", "Status", "Action"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 text-[13px]">
                              {[
                                 { id: "HQ-NY", label: "New York HQ", depts: "ENG, FIN, HR", country: "USA", status: "Active" },
                                 { id: "LON-EU", label: "London Exec", depts: "OPS, LEGAL", country: "UK", status: "Active" },
                                 { id: "BLR-DEV", label: "Bangalore Dev Hub", depts: "ENG, QA", country: "India", status: "Archived" }
                              ].map(b => (
                                 <tr key={b.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-6 font-mono text-gray-500">{b.id}</td>
                                    <td className="py-3 px-6 font-bold text-gray-900">{b.label}</td>
                                    <td className="py-3 px-6 text-gray-600">{b.depts}</td>
                                    <td className="py-3 px-6 text-gray-800">{b.country}</td>
                                    <td className="py-3 px-6"><span className={`px-2 py-0.5 rounded text-[11px] font-bold ${b.status === "Active" ? "bg-[#10b981]/10 text-[#10b981]" : "bg-gray-100 text-gray-500"}`}>{b.status}</span></td>
                                    <td className="py-3 px-6 flex items-center gap-2">
                                       <button className="text-gray-400 hover:text-blue-600"><Edit2 className="size-4" /></button>
                                       <button className="text-gray-400 hover:text-red-600"><Trash2 className="size-4" /></button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {/* 3. Payroll Policies */}
               {activeSegment === "payroll" && (
                  <div className="max-w-3xl space-y-8">
                     <section>
                        <h3 className="text-[14px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">State Compliance Mechanics</h3>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                              <div>
                                 <p className="text-[13px] font-bold text-gray-900">Enforce Automated Tax Rules</p>
                                 <p className="text-[12px] text-gray-500 mt-0.5">Applies baseline structural bounds for bracket evaluation.</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                 <input type="checkbox" className="sr-only peer" defaultChecked />
                                 <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                              <div>
                                 <p className="text-[13px] font-bold text-gray-900">Apply Universal PF / Security Toggles</p>
                                 <p className="text-[12px] text-gray-500 mt-0.5">Force deductions for provident funds globally regardless of template.</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                 <input type="checkbox" className="sr-only peer" />
                                 <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                           </div>
                        </div>
                     </section>

                     <section>
                        <h3 className="text-[14px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Execution Sequence</h3>
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="block text-[13px] font-bold text-gray-700 mb-1">Standard Salary Cycle</label>
                              <select className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                 <option>Monthly (End of Month)</option>
                                 <option>Bi-Weekly (14 Days)</option>
                                 <option>Weekly</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-[13px] font-bold text-gray-700 mb-1">Payslip Autogeneration Anchor</label>
                              <select className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                 <option>On Cycle Completion</option>
                                 <option>1 Day After Disbursal</option>
                                 <option>Manual Only</option>
                              </select>
                           </div>
                        </div>
                     </section>
                  </div>
               )}

               {/* 4. Attendance Policies */}
               {activeSegment === "attendance" && (
                  <div className="max-w-2xl space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[13px] font-bold text-gray-700 mb-1">Standard Work Hours / Day</label>
                           <input type="number" defaultValue="8" className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                           <label className="block text-[13px] font-bold text-gray-700 mb-1">Overtime Eligibility Threshold (Hrs)</label>
                           <input type="number" defaultValue="40" className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                     </div>
                     <div className="p-4 border border-rose-200 bg-rose-50 rounded-lg mt-6">
                        <label className="block text-[13px] font-bold text-rose-800 mb-2">Late Mark Penalty Mechanics</label>
                        <select className="w-full px-3 py-2 text-[13px] border border-rose-200 rounded-md bg-white outline-none focus:ring-2 focus:ring-rose-400">
                           <option>Disable automatic penalties</option>
                           <option>Convert 3 Late marks = 1 Leave</option>
                           <option>Deduct Fixed Payload per mark</option>
                        </select>
                     </div>
                  </div>
               )}

               {/* 5. Integrations */}
               {activeSegment === "integrations" && (
                  <div className="space-y-6 max-w-4xl">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* TALLY */}
                        <div className="border border-gray-200 rounded-xl p-5 relative overflow-hidden bg-white">
                           <div className="absolute top-0 left-0 w-1 h-full bg-[#10b981]"></div>
                           <h3 className="text-[16px] font-bold text-gray-900 mb-1">Tally ERP Direct</h3>
                           <p className="text-[12px] text-gray-500 font-medium mb-4">Financial Ledger Binding</p>
                           
                           <div className="space-y-3">
                              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded border border-gray-100">
                                 <span className="text-[12px] font-bold text-gray-600">Connection</span>
                                 <span className="text-[11px] font-bold text-[#10b981] flex items-center gap-1"><CheckCircle2 className="size-3" /> Linked</span>
                              </div>
                              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded border border-gray-100">
                                 <span className="text-[12px] font-bold text-gray-600">Sync Pipeline</span>
                                 <select className="bg-transparent text-[12px] font-bold text-gray-900 border-none outline-none">
                                    <option>Daily</option>
                                    <option>Post-Run</option>
                                    <option>Manual</option>
                                 </select>
                              </div>
                           </div>
                        </div>

                        {/* SAP */}
                        <div className="border border-gray-200 rounded-xl p-5 relative overflow-hidden bg-white">
                           <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                           <h3 className="text-[16px] font-bold text-gray-900 mb-1">SAP Architecture</h3>
                           <p className="text-[12px] text-gray-500 font-medium mb-4">Enterprise REST API Bridge</p>
                           
                           <div className="space-y-3">
                              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded border border-gray-100">
                                 <span className="text-[12px] font-bold text-gray-600">Authentication</span>
                                 <span className="text-[11px] font-bold text-red-500">Failed Node</span>
                              </div>
                              <div className="w-full">
                                 <input type="password" placeholder="Enter SAP Gateway Key" className="w-full px-3 py-2 text-[12px] border border-gray-300 rounded outline-none" />
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="border border-gray-200 rounded-xl p-5 bg-white relative">
                        <h3 className="text-[16px] font-bold text-gray-900 mb-1">Attendance Ingestors</h3>
                        <p className="text-[12px] text-gray-500 font-medium mb-4">Hardware mapping logic</p>
                        
                        <div className="flex gap-4">
                           <label className="flex-1 flex gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer">
                              <input type="radio" name="att" defaultChecked className="mt-1" />
                              <div>
                                 <p className="text-[14px] font-bold text-blue-900">Biometric Master (ZKTeco)</p>
                                 <p className="text-[11px] text-blue-700 mt-1">Accepts push protocol natively.</p>
                              </div>
                           </label>
                           <label className="flex-1 flex gap-3 p-4 border border-gray-200 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                              <input type="radio" name="att" className="mt-1" />
                              <div>
                                 <p className="text-[14px] font-bold text-gray-900">GPS Tracker Link</p>
                                 <p className="text-[11px] text-gray-500 mt-1">Relies on endpoint ping API.</p>
                              </div>
                           </label>
                        </div>
                     </div>
                  </div>
               )}

               {/* Remaining stubs for roles/notifications/security to maintain file length mapping strictly to constraints but structurally sound */}
               
               {activeSegment === "roles" && (
                  <div>
                     <h3 className="text-[14px] font-bold text-gray-800 mb-4">Access Hierarchy</h3>
                     <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                           <thead className="bg-[#f8fafc] border-b border-gray-200">
                              <tr>{["Role Ident", "System Access Level", "Module Scope", "Assigned Keys"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 text-[13px]">
                              {[
                                 { role: "Super Admin", access: "Total Configuration", scope: "All", keys: "2" },
                                 { role: "HR Architect", access: "Entity Base", scope: "Employees, Attendance", keys: "14" },
                                 { role: "Finance Execute", access: "Ledger Base", scope: "Salary, Payroll, Banks", keys: "4" },
                                 { role: "Terminal Auditor", access: "Read-Only Extract", scope: "Reports, Settings (View)", keys: "8" },
                              ].map((r, i) => (
                                 <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="py-4 px-6 font-bold text-gray-900">{r.role}</td>
                                    <td className="py-4 px-6 text-gray-600">{r.access}</td>
                                    <td className="py-4 px-6 text-gray-500 text-[12px]">{r.scope}</td>
                                    <td className="py-4 px-6 font-mono font-bold text-blue-600">{r.keys} users</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {activeSegment === "notifications" && (
                  <div className="max-w-2xl space-y-6">
                     <h3 className="text-[14px] font-bold text-gray-800">Alert Vectors</h3>
                     {["Email Transmit", "WhatsApp Secure Link", "Dashboard Interrupt"].map(m => (
                        <div key={m} className="flex items-center gap-3 bg-gray-50 p-3 rounded border border-gray-200">
                           <input type="checkbox" defaultChecked className="size-4" />
                           <span className="text-[13px] font-bold text-gray-700">{m}</span>
                        </div>
                     ))}
                     
                     <h3 className="text-[14px] font-bold text-gray-800 mt-8">System Triggers</h3>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border-b border-gray-100">
                           <span className="text-[13px] font-medium text-gray-800">Payroll Cycle Closing Reminder (T-5)</span>
                           <input type="checkbox" defaultChecked className="size-4" />
                        </div>
                        <div className="flex justify-between items-center p-3 border-b border-gray-100">
                           <span className="text-[13px] font-medium text-gray-800">Compliance Audit Breach</span>
                           <input type="checkbox" defaultChecked className="size-4" />
                        </div>
                     </div>
                  </div>
               )}

               {activeSegment === "security" && (
                  <div className="max-w-3xl space-y-8">
                     <section>
                        <h3 className="text-[14px] font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Environment Rules</h3>
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="block text-[13px] font-bold text-gray-700 mb-1">Session Timeout Kill (Mins)</label>
                              <input type="number" defaultValue="30" className="w-full px-3 py-2 text-[14px] border border-gray-300 rounded-md outline-none" />
                           </div>
                           <div>
                              <label className="block text-[13px] font-bold text-gray-700 mb-1">Password Rotation Logic</label>
                              <select className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md outline-none bg-white">
                                 <option>90 Days Enforced</option>
                                 <option>60 Days Enforced</option>
                                 <option>Disabled</option>
                              </select>
                           </div>
                        </div>
                     </section>
                     
                     <section className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
                        <div className="flex items-start justify-between">
                           <div>
                              <h3 className="text-[14px] font-bold text-amber-900 mb-1"><Shield className="size-4 inline mr-1 text-amber-600"/> Auto-Lock Approved Ledgers</h3>
                              <p className="text-[12px] text-amber-800 mb-4">Hard-lock records ensuring zero mutation POST-approval flow.</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-9 h-5 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                           </label>
                        </div>
                        <div className="pt-4 border-t border-amber-200/50">
                           <p className="text-[12px] text-amber-700 font-bold">Data Encryption Level: AES-256 (Cloud Native)</p>
                        </div>
                     </section>
                  </div>
               )}

            </div>
         </div>
      </div>
    </div>
  );
}
