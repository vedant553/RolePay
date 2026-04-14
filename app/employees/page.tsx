"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Upload, Users, Globe, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { employees as initialEmployees, employeeStats, Employee } from "@/lib/data/employees";

// Custom Components
import { ComplianceBadge } from "@/components/employees/ComplianceBadge";
import { RiskIndicator } from "@/components/employees/RiskIndicator";
import { StatusToggle } from "@/components/employees/StatusToggle";
import { PaginationComponent } from "@/components/employees/PaginationComponent";
import { ActionDropdown } from "@/components/employees/ActionDropdown";
import { EmployeeModal } from "@/components/employees/EmployeeModal";
import { ImportModal } from "@/components/employees/ImportModal";
import { FilterBar } from "@/components/employees/FilterBar";

// New Modals & Drawers
import { EmployeeDrawer } from "@/components/employees/EmployeeDrawer";
import { ExportModal } from "@/components/employees/ExportModal";
import { RunPayrollModal } from "@/components/employees/RunPayrollModal";
import { OverrideModal } from "@/components/employees/OverrideModal";
import { PayrollBreakdownModal } from "@/components/employees/PayrollBreakdownModal";

// Toast System
function Toast({ toast }: { toast: { message: string, type: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-xl font-bold text-white transition-all transform ${
      toast.type === "success" ? "bg-[#10b981]" : toast.type === "error" ? "bg-red-500" : "bg-amber-500"
    }`}>
      {toast.message}
    </div>
  );
}

export default function EmployeesPage() {
  const [employeesData, setEmployeesData] = useState<Employee[]>(initialEmployees);
  const [loading, setLoading] = useState(true);
  const [retryLoader, setRetryLoader] = useState(false);
  
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const [toast, setToast] = useState<{message: string, type: "success" | "error" | "warning"} | null>(null);

  // Visibility Controls
  const [modalStates, setModalStates] = useState({
    addEmployee: false,
    importData: false,
    exportData: false,
    payrollBreakdown: false,
    runPayroll: { open: false, context: null as "bulk" | "individual" | null },
    override: false,
    employeeDrawer: false
  });

  const toggleModal = (key: keyof typeof modalStates, val?: any) => {
    setModalStates(prev => ({ ...prev, [key]: val !== undefined ? val : !prev[key] }));
  };

  const triggerToast = (message: string, type: "success" | "error" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Simulating API loading with Edge Case capability
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
       if(Math.random() > 0.95) return setRetryLoader(true); // 5% chance of crash
       setLoading(false);
       setRetryLoader(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Complex Filter Logic
  const filtered = useMemo(() => {
    return employeesData.filter((e) => {
      // Search
      const sq = searchQuery.toLowerCase();
      if (sq && !(e.name.toLowerCase().includes(sq) || e.id.toLowerCase().includes(sq) || e.country.toLowerCase().includes(sq))) {
        return false;
      }
      
      // Multi-dropdowns
      if (filters.country?.length && !filters.country.includes(e.country)) return false;
      if (filters.status?.length && !filters.status.includes(e.status)) return false;
      
      if (filters.risk?.length) {
         let match = false;
         if (filters.risk.includes("Low Risk (<20)") && e.riskScore < 20) match = true;
         if (filters.risk.includes("Moderate (20-49)") && e.riskScore >= 20 && e.riskScore < 50) match = true;
         if (filters.risk.includes("High Risk (50+)") && e.riskScore >= 50) match = true;
         if (!match) return false;
      }
      return true;
    });
  }, [searchQuery, employeesData, filters]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  // Reset pagination on list changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filters, perPage]);

  // Action Dispatcher
  const handleAction = (action: string, emp: Employee) => {
    setSelectedEmployee(emp);
    if (action === "view" || action === "payslip") toggleModal("employeeDrawer", true);
    else if (action === "edit") toggleModal("addEmployee", true);
    else if (action === "delete") {
      if (confirm(`CRITICAL: Removing ${emp.name}?`)) {
        setEmployeesData(prev => prev.filter(e => e.id !== emp.id));
        triggerToast("Removed employee completely.", "error");
      }
    } 
    else if (action === "run_payroll") toggleModal("runPayroll", { open: true, context: "individual" });
    else if (action === "override") toggleModal("override", true);
  };

  const handleStatusUpdate = (empId: string, newStatus: any) => {
    setEmployeesData(prev => prev.map(e => e.id === empId ? { ...e, status: newStatus } : e));
    triggerToast(`Employee status formally set to ${newStatus}`, "warning");
  };

  const handleSaveEmployee = (data: any) => {
    if (selectedEmployee) {
      setEmployeesData(prev => prev.map(e => e.id === selectedEmployee.id ? { ...e, ...data } : e));
      triggerToast("Employee profile intelligently updated.", "success");
    } else {
      const newEmp = { ...data, id: `EMP-${Math.floor(Math.random()*10000)}`, countryCode: "🌎", complianceStatus: "Pending", riskScore: 50, lastPayrollMonth: "-", overrides: 0, status: "Active" };
      setEmployeesData([newEmp, ...employeesData]);
      triggerToast("New entity provisioned successfully.", "success");
    }
    toggleModal("addEmployee", false);
    setSelectedEmployee(null);
  };

  if (retryLoader) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
         <AlertTriangle className="size-10 text-red-500 mb-3" />
         <p className="text-lg font-bold">Encrypted Connection Reset</p>
         <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#10b981] text-white font-bold rounded-lg hover:bg-emerald-600 transition-all">Retry Secure Connection</button>
      </div>
    );
  }

  return (
    <div className="relative pb-10">
      <Toast toast={toast} />
      
      <EmployeeModal open={modalStates.addEmployee} onClose={() => { toggleModal("addEmployee", false); setSelectedEmployee(null); }} onSave={handleSaveEmployee} initialData={selectedEmployee} />
      <ImportModal open={modalStates.importData} onClose={() => toggleModal("importData", false)} onSuccess={() => triggerToast("External data parsed and imported correctly.", "success")} />
      <EmployeeDrawer open={modalStates.employeeDrawer} onClose={() => toggleModal("employeeDrawer", false)} employee={selectedEmployee} />
      <ExportModal open={modalStates.exportData} onClose={() => toggleModal("exportData", false)} onSuccess={(fmt) => triggerToast(`Payload crystallized in ${fmt.toUpperCase()} architecture.`, "success")} />
      <RunPayrollModal open={modalStates.runPayroll.open} context={modalStates.runPayroll.context as any} onClose={() => toggleModal("runPayroll", {open: false, context: null})} onSuccess={() => triggerToast("Ledger successfully reconciled and dispatched.", "success")} />
      <OverrideModal open={modalStates.override} onClose={() => toggleModal("override", false)} employee={selectedEmployee} onSubmit={(v) => {
         triggerToast(`Applied ${v.val} adjustment under '${v.reason}' directive.`, "success");
         setEmployeesData(prev => prev.map(e => e.id === selectedEmployee?.id ? {...e, overrides: e.overrides + 1} : e));
      }} />
      <PayrollBreakdownModal open={modalStates.payrollBreakdown} onClose={() => toggleModal("payrollBreakdown", false)} />

      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#0f172b] mb-2">Employees – Payroll Profiles</h1>
          <p className="text-[14px] text-[#64748b]">Manage employee payroll data, salary templates, and compliance status</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: employeesData.length, icon: Users, color: "bg-[#10b981]", sub: "Active workforce", action: () => setFilters({}) },
          { label: "Active Nodes", value: employeesData.filter(e => e.status === "Active").length, icon: TrendingUp, color: "bg-[#3b82f6]", sub: `Total operative`, action: () => setFilters({...filters, status: ["Active"]}) },
          { label: "Total Asset Load", value: employeeStats.totalPayroll, icon: Globe, color: "bg-[#8b5cf6]", sub: "This month base", action: () => toggleModal("payrollBreakdown", true) },
          { label: "High Risk Flags", value: employeesData.filter(e => e.riskScore >= 50).length, icon: AlertTriangle, color: "bg-[#ef4444]", sub: `Immediate action`, action: () => setFilters({...filters, risk: ["High Risk (50+)"]}) },
        ].map((card, i) => (
          <div key={i} onClick={card.action} className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm hover:ring-2 hover:ring-[#10b981] hover:ring-offset-2 cursor-pointer transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${card.color} rounded-lg size-9 flex items-center justify-center`}><card.icon className="size-4 text-white" strokeWidth={1.75} /></div>
              <span className="text-[13px] text-[#64748b] font-bold">{card.label}</span>
            </div>
            {loading ? <div className="h-8 bg-[#f1f5f9] rounded animate-pulse w-24 mb-1" /> : <p className="text-[28px] font-bold text-[#0f172b] mb-1">{card.value}</p>}
            <p className="text-[12px] text-[#94a3b8]">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => toggleModal("addEmployee", true)} className="bg-[#10b981] text-white h-10 px-5 rounded-lg flex items-center gap-2 font-bold text-[14px] hover:bg-[#0ea370] transition-colors shadow-md">
          <Plus className="size-4" strokeWidth={2.5} /> Add Entity
        </button>
        <button onClick={() => toggleModal("importData", true)} className="bg-white border border-[#e2e8f0] text-[#0f172b] h-10 px-5 rounded-lg flex items-center gap-2 font-bold text-[14px] hover:bg-[#f8fafc] transition-colors shadow-sm">
          <Upload className="size-4" strokeWidth={2} /> Sync Framework
        </button>
        <button onClick={() => toggleModal("runPayroll", {open: true, context: "bulk"})} className="bg-[#0f172b] border-[#e2e8f0] text-white h-10 px-5 rounded-lg flex items-center gap-2 font-bold text-[14px] hover:bg-[#152040] transition-colors shadow-sm ml-auto">
          <RefreshCw className="size-4" strokeWidth={2} /> Run Bulk Payroll
        </button>
      </div>

      <FilterBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} onExport={() => toggleModal("exportData", true)} />

      {/* Table Area */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-visible shadow-sm">
        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {["Employee", "Country", "Salary Tracker", "Gross Commitment", "Variable %", "Compliance", "Risk Target", "Latest", "Overrides", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-[#64748b] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#e2e8f0] animate-pulse">
                    <td colSpan={11} className="py-4 px-3"><div className="h-6 bg-[#f1f5f9] rounded-md w-full" /></td>
                  </tr>
                ))
              ) : paginated.length > 0 ? paginated.map((employee) => (
                <tr key={employee.id} onClick={(e) => {
                  if ((e.target as HTMLElement).tagName !== "BUTTON" && (e.target as HTMLElement).tagName !== "path" && (e.target as HTMLElement).tagName !== "svg") {
                    handleAction("view", employee);
                  }
                }} className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-pointer group">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-white font-bold text-[10px]">{employee.name.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[12px] text-[#0f172b] leading-tight truncate group-hover:text-[#10b981] transition-colors">{employee.name}</p>
                        <p className="text-[10px] text-[#64748b] font-medium">{employee.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#0f172b] whitespace-nowrap">
                    <span className="cursor-help font-medium" title={employee.country}>{employee.countryCode} {employee.country}</span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#0f172b] leading-tight font-medium">{employee.salaryTemplate}</td>
                  <td className="py-3 px-3 font-bold text-[12px] text-[#0f172b] tracking-tight">{employee.grossSalary}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0f172b] font-medium">{employee.variablePercent}%</td>
                  <td className="py-3 px-3"><ComplianceBadge status={employee.complianceStatus} /></td>
                  <td className="py-3 px-3"><RiskIndicator score={employee.riskScore} /></td>
                  <td className="py-3 px-3 text-[12px] text-[#0f172b] whitespace-nowrap font-medium">{employee.lastPayrollMonth}</td>
                  <td className="py-3 px-3">
                    {employee.overrides > 0 ? (
                      <span className="bg-[#fef3c7] text-[#92400e] px-1.5 py-0.5 rounded text-[11px] font-bold shadow-sm">{employee.overrides}</span>
                    ) : <span className="text-[12px] text-[#94a3b8]">—</span>}
                  </td>
                  <td className="py-3 px-3"><StatusToggle status={employee.status} onChange={(s) => handleStatusUpdate(employee.id, s)} /></td>
                  <td className="py-3 px-3 text-right">
                     <ActionDropdown employee={employee} onAction={handleAction} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-[#64748b] bg-[#f8fafc]">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="size-12 text-[#cbd5e1] mb-3" />
                      <p className="text-[16px] font-bold text-[#0f172b]">No structured entities identified</p>
                      <p className="text-[12px] mt-1">Cross-reference search metrics or adjust multi-state filters.</p>
                      <button onClick={() => toggleModal("addEmployee", true)} className="mt-4 px-5 py-2 hover:shadow-lg bg-[#10b981] text-white rounded-lg text-[13px] font-bold transition-all">Add Employee Target</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationComponent total={filtered.length} perPage={perPage} currentPage={currentPage} onPageChange={setCurrentPage} onPerPageChange={(n) => {setPerPage(n); setCurrentPage(1)}} />
      </div>
    </div>
  );
}
