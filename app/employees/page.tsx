"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Users, CheckCircle, AlertTriangle, Building2, MapPin, SearchX } from "lucide-react";
import { employees as initialEmployees, employeeStats, Employee } from "@/lib/data/employees";

import { ActionDropdown } from "@/components/employees/ActionDropdown";
import { EmployeeFormDrawer } from "@/components/employees/EmployeeFormDrawer";
import { EmployeeProfileDrawer } from "@/components/employees/EmployeeProfileDrawer";

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

export default function EmployeesPage() {
  const [employeesData, setEmployeesData] = useState<Employee[]>(initialEmployees);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [bankStatusFilter, setBankStatusFilter] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [toast, setToast] = useState<{message: string, type: "success" | "error" | "warning"} | null>(null);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const triggerToast = (message: string, type: "success" | "error" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return employeesData.filter((e) => {
      if (searchQuery) {
        const sq = searchQuery.toLowerCase();
        if (!(e.name.toLowerCase().includes(sq) || e.id.toLowerCase().includes(sq) || e.department.toLowerCase().includes(sq))) {
          return false;
        }
      }
      if (departmentFilter && e.department !== departmentFilter) return false;
      if (locationFilter && e.country !== locationFilter) return false;
      if (statusFilter && e.status !== statusFilter) return false;
      if (bankStatusFilter && e.bankStatus !== bankStatusFilter) return false;
      return true;
    });
  }, [searchQuery, departmentFilter, locationFilter, statusFilter, bankStatusFilter, employeesData]);

  const handleAction = (action: string, emp: Employee) => {
    setSelectedEmployee(emp);
    if (action === "view") {
      setIsProfileOpen(true);
    } else if (action === "edit") {
      setIsFormOpen(true);
    } else if (action === "delete") {
      if (confirm(`Are you sure you want to remove ${emp.name}?`)) {
        setEmployeesData(prev => prev.filter(e => e.id !== emp.id));
        triggerToast("Employee record deleted.", "success");
      }
    } else if (action === "toggle_status") {
       const newStatus = emp.status === "Active" ? "Inactive" : "Active";
       setEmployeesData(prev => prev.map(e => e.id === emp.id ? { ...e, status: newStatus } : e));
       triggerToast(`${emp.name} marked as ${newStatus}.`, "success");
    }
  };

  const handleSaveEmployee = (data: any) => {
    if (selectedEmployee) {
      setEmployeesData(prev => prev.map(e => e.id === selectedEmployee.id ? { ...e, ...data } : e));
      triggerToast("Employee profile updated successfully.", "success");
    } else {
      const newEmp = { 
         ...data, 
         id: `EMP-${Math.floor(Math.random()*10000)}`, 
         countryCode: data.country === "USA" ? "🇺🇸" : data.country === "UK" ? "🇬🇧" : data.country === "India" ? "🇮🇳" : data.country === "Germany" ? "🇩🇪" : "🌎", 
         complianceStatus: "Pending", 
         bankStatus: data.accountNumber ? "Valid" : "Missing",
         status: "Active",
         avatar: data.name ? data.name.split(" ").map((n: string) => n[0]).join("").substring(0,2).toUpperCase() : "NA"
      };
      setEmployeesData([newEmp, ...employeesData]);
      triggerToast("New employee added successfully.", "success");
    }
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="relative pb-10">
      <Toast toast={toast} />
      
      <EmployeeFormDrawer 
         open={isFormOpen} 
         onClose={() => { setIsFormOpen(false); setSelectedEmployee(null); }} 
         onSubmit={handleSaveEmployee} 
         initialData={selectedEmployee} 
      />
      <EmployeeProfileDrawer 
         open={isProfileOpen} 
         onClose={() => setIsProfileOpen(false)} 
         employee={selectedEmployee} 
         onEdit={() => { setIsProfileOpen(false); setIsFormOpen(true); }}
      />

      {/* Header Area */}
      <div className="mb-8">
         <h1 className="text-[28px] font-bold text-[#0f172b]">Employees</h1>
         <p className="text-[14px] text-[#64748b]">Manage employee records, salary setup, and compliance data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: employeeStats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Employees", value: employeeStats.active, icon: CheckCircle, color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
          { label: "Missing Bank Details", value: employeeStats.missingBankCount, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-100", action: () => setBankStatusFilter("Missing") },
          { label: "Compliance Issues", value: employeeStats.complianceIssueCount, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", action: () => setStatusFilter("") },
        ].map((card, i) => (
          <div key={i} onClick={card.action} className={`bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm ${card.action ? "cursor-pointer hover:ring-2 hover:ring-gray-200" : ""} transition-all`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`${card.bg} rounded-lg size-8 flex items-center justify-center`}><card.icon className={`size-4 ${card.color}`} strokeWidth={2} /></div>
              <span className="text-[13px] text-[#64748b] font-medium">{card.label}</span>
            </div>
            <p className="text-[24px] font-bold text-[#0f172b]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
         <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
               type="text" 
               placeholder="Search name, ID..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none"
            />
         </div>
         <div className="md:col-span-2">
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="w-full px-3 py-2 text-[13px] text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none appearance-none bg-transparent">
               <option value="">All Departments</option>
               <option value="Engineering">Engineering</option>
               <option value="Finance">Finance</option>
               <option value="HR">HR</option>
            </select>
         </div>
         <div className="md:col-span-2">
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full px-3 py-2 text-[13px] text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none appearance-none bg-transparent">
               <option value="">All Locations</option>
               <option value="USA">USA</option>
               <option value="UK">UK</option>
               <option value="India">India</option>
               <option value="Germany">Germany</option>
            </select>
         </div>
         <div className="md:col-span-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 text-[13px] text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none appearance-none bg-transparent">
               <option value="">All Statuses</option>
               <option value="Active">Active</option>
               <option value="Inactive">Inactive</option>
               <option value="On Leave">On Leave</option>
            </select>
         </div>
         <div className="md:col-span-1">
            <select value={bankStatusFilter} onChange={(e) => setBankStatusFilter(e.target.value)} className="w-full px-3 py-2 text-[13px] text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none appearance-none bg-transparent">
               <option value="">Bank Info</option>
               <option value="Valid">Valid</option>
               <option value="Missing">Missing</option>
            </select>
         </div>
         <div className="md:col-span-2 text-right">
            <button onClick={() => { setSelectedEmployee(null); setIsFormOpen(true); }} className="w-full bg-[#10b981] text-white h-[38px] px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-[13px] hover:bg-[#0ea370] transition-colors shadow-sm">
               <Plus className="size-4" strokeWidth={2.5} /> Add Employee
            </button>
         </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-gray-50/50">
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide">Employee</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide">Employee ID</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide">Department</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide">Bank Status</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="py-4 px-4"><div className="h-6 bg-gray-100 rounded-md w-full" /></td>
                  </tr>
                ))
              ) : filtered.length > 0 ? filtered.map((employee) => (
                <tr key={employee.id} onClick={() => { setSelectedEmployee(employee); setIsProfileOpen(true); }} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center shrink-0 text-white font-bold text-[11px] shadow-sm">
                        {employee.avatar || employee.name.charAt(0)}
                      </div>
                      <p className="font-medium text-[13px] text-gray-900 group-hover:text-[#10b981] transition-colors">{employee.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[13px] text-gray-600">{employee.id}</td>
                  <td className="py-3 px-4 text-[13px] text-gray-600">{employee.department}</td>
                  <td className="py-3 px-4 text-[13px] text-gray-900">{employee.role || "—"}</td>
                  <td className="py-3 px-4 text-[13px] text-gray-600">
                     <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-gray-400" /> {employee.countryCode} {employee.country}</span>
                  </td>
                  <td className="py-3 px-4">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        employee.bankStatus === "Valid" ? "bg-[#10b981]/10 text-[#10b981]" : "bg-amber-100 text-amber-700"
                     }`}>
                        {employee.bankStatus === "Valid" ? "Valid" : "Missing"}
                     </span>
                  </td>
                  <td className="py-3 px-4">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        employee.status === "Active" ? "text-gray-700 bg-gray-100" : employee.status === "Inactive" ? "text-gray-500 bg-gray-50 border border-gray-200" : "text-amber-700 bg-amber-100"
                     }`}>
                        {employee.status === "Active" ? <span className="size-1.5 rounded-full bg-[#10b981] mr-1.5"></span> : <span className="size-1.5 rounded-full bg-gray-400 mr-1.5"></span>}
                        {employee.status}
                     </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                     <ActionDropdown employee={employee} onAction={handleAction} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <SearchX className="size-10 text-gray-300 mb-3" />
                      <p className="text-[14px] font-medium text-gray-900">No employees found</p>
                      <p className="text-[13px] text-gray-500 mt-1">Try adjusting your filters or search query.</p>
                      <button onClick={() => {setSearchQuery(""); setDepartmentFilter(""); setLocationFilter(""); setStatusFilter(""); setBankStatusFilter("");}} className="mt-4 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-[12px] font-medium transition-all">Clear Filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
