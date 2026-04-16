"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Building2, MapPin, SearchX, CheckCircle, MoreHorizontal, Edit3, Copy, Link, Settings2, ShieldAlert, LayoutTemplate } from "lucide-react";
import { employees } from "@/lib/data/employees"; // Taking employee data for mappings

import { SalaryBuilderDrawer } from "@/components/salary/SalaryBuilderDrawer";
import { EmployeeMappingModal } from "@/components/salary/EmployeeMappingModal";

// --- MOCK DATA FOR SALARY STRUCTURES ---
const INITIAL_STRUCTURES = [
  { id: "STRUCT-1", name: "Executive L3 - USA", country: "USA", role: "Executive", componentsCount: 8, lastUpdated: "2026-04-10", status: "Active" },
  { id: "STRUCT-2", name: "Senior L2 - Global", country: "Global Standard", role: "Senior Engineer", componentsCount: 6, lastUpdated: "2026-04-12", status: "Active" },
  { id: "STRUCT-3", name: "Mid-Level L1 - India", country: "India", role: "Mid-Level", componentsCount: 9, lastUpdated: "2026-04-15", status: "Draft" },
  { id: "STRUCT-4", name: "Contractor Standard", country: "Global Standard", role: "Contractor", componentsCount: 2, lastUpdated: "2026-03-22", status: "Active" },
];

const INITIAL_MAPPINGS = employees.map(e => ({
  id: e.id,
  name: e.name,
  avatar: e.avatar,
  department: e.department,
  role: e.role,
  country: e.country,
  assignedStructureId: e.country === "USA" ? "STRUCT-1" : e.country === "India" ? "STRUCT-3" : "STRUCT-2",
  assignedStructureName: e.country === "USA" ? "Executive L3 - USA" : e.country === "India" ? "Mid-Level L1 - India" : "Senior L2 - Global",
  hasOverride: Math.random() > 0.8,
  lastUpdated: "2026-04-01"
}));

// --- TOAST/ALERT ---
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

// Action Dropdowns
function StructureActionDropdown({ structure, onAction }: { structure: any, onAction: (a: string, s: any) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100"><MoreHorizontal className="size-4" /></button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-gray-100">
             <div className="py-1">
                <button className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50" onClick={() => { setOpen(false); onAction("edit", structure); }}><Edit3 className="size-3.5 mr-2 text-gray-400" /> Edit Structure</button>
                <button className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50" onClick={() => { setOpen(false); onAction("duplicate", structure); }}><Copy className="size-3.5 mr-2 text-gray-400" /> Duplicate</button>
             </div>
             <div className="py-1">
                <button className="flex w-full items-center px-4 py-2 text-[12px] text-[#3b82f6] hover:bg-blue-50 font-medium" onClick={() => { setOpen(false); onAction("assign", structure); }}><Link className="size-3.5 mr-2" /> Assign to Employees</button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}

function MappingActionDropdown({ mapping, onAction }: { mapping: any, onAction: (a: string, m: any) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100"><MoreHorizontal className="size-4" /></button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-gray-100">
             <div className="py-1">
                <button className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50" onClick={() => { setOpen(false); onAction("change", mapping); }}><Link className="size-3.5 mr-2 text-gray-400" /> Change Structure</button>
                <button className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50" onClick={() => { setOpen(false); onAction("override", mapping); }}><Settings2 className="size-3.5 mr-2 text-gray-400" /> Edit Override</button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}

// Main Component
export default function SalaryManagementPage() {
  const [activeTab, setActiveTab] = useState<"structures" | "mappings">("structures");
  const [structures, setStructures] = useState(INITIAL_STRUCTURES);
  const [mappings, setMappings] = useState(INITIAL_MAPPINGS);
  const [toast, setToast] = useState<{message: string, type: string} | null>(null);

  // Modals & Drawers States
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<any>(null);

  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<any>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const triggerToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Derived
  const filteredStructures = useMemo(() => {
     return structures.filter(s => {
       if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
       if (countryFilter && s.country !== countryFilter) return false;
       return true;
     });
  }, [searchQuery, countryFilter, structures]);

  const filteredMappings = useMemo(() => {
     return mappings.filter(m => {
        if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (countryFilter && m.country !== countryFilter) return false;
        if (deptFilter && m.department !== deptFilter) return false;
        return true;
     });
  }, [searchQuery, countryFilter, deptFilter, mappings]);

  const handleSaveStructure = (data: any) => {
     if (selectedStructure) {
        setStructures(prev => prev.map(s => s.id === selectedStructure.id ? {...s, ...data, componentsCount: (data.earnings?.length||0) + (data.deductions?.length||0)} : s));
        triggerToast("Structure ruleset updated correctly.");
     } else {
        const newStruct = { ...data, id: `STRUCT-${Date.now()}`, status: "Draft", lastUpdated: "Today", componentsCount: (data.earnings?.length||0) + (data.deductions?.length||0) };
        setStructures([newStruct, ...structures]);
        triggerToast("New salary structure mapped onto database.");
     }
  };

  const handleApplyMapping = (data: {structureId: string, employees: string[]}) => {
     const structureName = structures.find(s => s.id === data.structureId)?.name || "Unknown Structure";
     setMappings(prev => prev.map(m => {
        if (data.employees.includes(m.id)) {
           return { ...m, assignedStructureId: data.structureId, assignedStructureName: structureName, lastUpdated: "Today" };
        }
        return m;
     }));
     triggerToast(`Structure successfully assigned to ${data.employees.length} entities.`);
  };

  return (
    <div className="relative pb-10">
      <Toast toast={toast} />
      
      {/* Modals & Drawers */}
      <SalaryBuilderDrawer 
         open={isBuilderOpen} 
         onClose={() => { setIsBuilderOpen(false); setSelectedStructure(null); }} 
         initialData={selectedStructure}
         onSubmit={handleSaveStructure}
      />
      <EmployeeMappingModal 
         open={isMappingModalOpen}
         onClose={() => setIsMappingModalOpen(false)}
         employees={mappings}
         structures={structures.filter(s => s.status === "Active")}
         onSubmit={handleApplyMapping}
      />

      {/* Override simple modal overlay */}
      {isOverrideOpen && selectedMapping && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172b]/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
               <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-[14px] font-bold text-gray-900">Override Config</h3>
                  <p className="text-[12px] text-gray-500">Isolate values for {selectedMapping.name}</p>
               </div>
               <div className="p-5 space-y-4">
                  <div>
                     <label className="block text-[12px] font-bold text-gray-700 mb-1">Base Pay Override ($)</label>
                     <input type="number" placeholder="Enter fixed amount" className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md outline-none focus:border-[#3b82f6]" />
                  </div>
                  <div>
                     <label className="block text-[12px] font-bold text-gray-700 mb-1">Custom Allowance Override ($)</label>
                     <input type="number" placeholder="Enter fixed amount" className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md outline-none focus:border-[#3b82f6]" />
                  </div>
                  <div className="bg-amber-50 rounded p-2 flex items-start gap-2 border border-amber-100">
                     <ShieldAlert className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                     <p className="text-[11px] text-amber-800 font-medium leading-tight">These rigid values will completely bypass the parent ruleset.</p>
                  </div>
               </div>
               <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                  <button onClick={() => setIsOverrideOpen(false)} className="px-3 py-1.5 text-[12px] font-bold text-gray-600 bg-white border border-gray-300 rounded-md">Cancel</button>
                  <button onClick={() => {
                     setMappings(prev => prev.map(m => m.id === selectedMapping.id ? {...m, hasOverride: true} : m));
                     setIsOverrideOpen(false);
                     triggerToast("Override layer applied successfully.", "success");
                  }} className="px-4 py-1.5 text-[12px] font-bold text-white bg-[#3b82f6] rounded-md hover:bg-blue-600 shadow-sm">Force Apply</button>
               </div>
            </div>
         </div>
      )}


      {/* Header Area */}
      <div className="flex items-end justify-between mb-8">
         <div>
           <h1 className="text-[28px] font-bold text-[#0f172b]">Salary Management</h1>
           <p className="text-[14px] text-[#64748b]">Define calculations, build structures, and execute mappings.</p>
         </div>
         {activeTab === "structures" ? (
            <button onClick={() => { setSelectedStructure(null); setIsBuilderOpen(true); }} className="bg-[#10b981] text-white h-[38px] px-5 rounded-lg flex items-center gap-2 font-bold text-[13px] hover:bg-[#0ea370] transition-colors shadow-sm">
               <Plus className="size-4" strokeWidth={2.5} /> Create Structure
            </button>
         ) : (
            <button onClick={() => setIsMappingModalOpen(true)} className="bg-[#3b82f6] text-white h-[38px] px-5 rounded-lg flex items-center gap-2 font-bold text-[13px] hover:bg-blue-600 transition-colors shadow-sm">
               <Link className="size-4" strokeWidth={2.5} /> Assign Structure
            </button>
         )}
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         
         {/* Tabs Row */}
         <div className="flex border-b border-gray-200 bg-[#f8fafc] px-6 pt-3 gap-6">
            <button onClick={() => setActiveTab("structures")} className={`pb-3 text-[13px] font-bold uppercase tracking-wide border-b-2 transition-colors ${activeTab === "structures" ? "border-[#10b981] text-[#10b981]" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
               Salary Structures
            </button>
            <button onClick={() => setActiveTab("mappings")} className={`pb-3 text-[13px] font-bold uppercase tracking-wide border-b-2 transition-colors ${activeTab === "mappings" ? "border-[#3b82f6] text-[#3b82f6]" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
               Employee Salary Mapping
            </button>
         </div>

         {/* Filter Bar Inline */}
         <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
            <div className="relative">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
               <input type="text" placeholder={`Search ${activeTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-[200px] pl-8 pr-3 py-1.5 text-[12px] border border-gray-300 rounded focus:ring-2 focus:ring-[#10b981] outline-none" />
            </div>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="w-[150px] px-2 py-1.5 text-[12px] text-gray-700 border border-gray-300 rounded focus:ring-2 focus:ring-[#10b981] outline-none">
               <option value="">All Regions</option>
               <option value="USA">USA</option>
               <option value="India">India</option>
               <option value="UK">UK</option>
               <option value="Global Standard">Global Standard</option>
            </select>
            {activeTab === "mappings" && (
               <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-[150px] px-2 py-1.5 text-[12px] text-gray-700 border border-gray-300 rounded focus:ring-2 focus:ring-[#10b981] outline-none">
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Operations">Operations</option>
               </select>
            )}
         </div>

         {/* TAB 1: STRUCTURES */}
         {activeTab === "structures" && (
            <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] border-b border-gray-200">
                     <tr>
                        {["Structure Name", "Country", "Role Target", "Components", "Last Updated", "Status", "Action"].map(h => <th key={h} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredStructures.length > 0 ? filteredStructures.map((struct) => (
                        <tr key={struct.id} onClick={() => { setSelectedStructure(struct); setIsBuilderOpen(true); }} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                           <td className="py-4 px-6 font-bold text-[13px] text-gray-900 group-hover:text-[#10b981] transition-colors">{struct.name}</td>
                           <td className="py-4 px-6 text-[13px] font-medium text-gray-600 flex items-center mt-0.5 gap-1"><MapPin className="size-3 text-gray-400" /> {struct.country}</td>
                           <td className="py-4 px-6 text-[13px] font-medium text-gray-800">{struct.role}</td>
                           <td className="py-4 px-6 text-[13px] font-medium text-gray-600"><span className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-[11px] font-bold mr-1.5">{struct.componentsCount}</span> Fields</td>
                           <td className="py-4 px-6 text-[13px] text-gray-500">{struct.lastUpdated}</td>
                           <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                                 struct.status === "Active" ? "bg-[#10b981]/10 text-[#10b981]" : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}>{struct.status}</span>
                           </td>
                           <td className="py-4 px-6 text-left" onClick={(e) => e.stopPropagation()}>
                              <StructureActionDropdown structure={struct} onAction={(action, target) => {
                                 if (action === "edit") { setSelectedStructure(target); setIsBuilderOpen(true); }
                                 if (action === "assign") { setIsMappingModalOpen(true); }
                                 if (action === "duplicate") {
                                    const cloned = { ...target, id: `STRUCT-${Date.now()}`, name: `${target.name} (Copy)`, status: "Draft" };
                                    setStructures([...structures, cloned]);
                                    triggerToast("Structure duplicated to draft.");
                                 }
                              }} />
                           </td>
                        </tr>
                     )) : (
                        <tr><td colSpan={7} className="text-center py-16 text-gray-500 font-medium text-[13px]">No matching templates found.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         )}

         {/* TAB 2: MAPPINGS */}
         {activeTab === "mappings" && (
            <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] border-b border-gray-200">
                     <tr>
                        {["Target Entity", "Department", "Role", "Assigned Rule Framework", "Overrides", "Last Updated", "Action"].map((h, i) => <th key={i} className="text-left py-3 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredMappings.length > 0 ? filteredMappings.map((mapNode) => (
                        <tr key={mapNode.id} className="hover:bg-gray-50 transition-colors group">
                           <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                 <div className="size-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shrink-0 shadow-sm text-white font-bold text-[10px]">{mapNode.avatar}</div>
                                 <div>
                                    <p className="font-bold text-[13px] text-gray-900 leading-tight">{mapNode.name}</p>
                                    <p className="font-medium text-[10px] text-gray-500">{mapNode.id} • {mapNode.country}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-4 px-6 text-[13px] font-medium text-gray-800">{mapNode.department}</td>
                           <td className="py-4 px-6 text-[13px] text-gray-600">{mapNode.role}</td>
                           <td className="py-4 px-6">
                              <div className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 inline-flex items-center gap-2">
                                 <LayoutTemplate className="size-3 text-[#10b981]" />
                                 <span className="text-[12px] font-bold text-gray-900">{mapNode.assignedStructureName}</span>
                              </div>
                           </td>
                           <td className="py-4 px-6">
                              {mapNode.hasOverride ? (
                                 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[11px] font-bold border border-amber-200 shadow-sm">
                                    <Settings2 className="size-3" /> Yes
                                 </span>
                              ) : <span className="text-[12px] font-medium text-gray-400">— Set by Rule —</span>}
                           </td>
                           <td className="py-4 px-6 text-[13px] text-gray-500">{mapNode.lastUpdated}</td>
                           <td className="py-4 px-6 text-left" onClick={(e) => e.stopPropagation()}>
                              <MappingActionDropdown mapping={mapNode} onAction={(action, target) => {
                                 if (action === "override") { setSelectedMapping(target); setIsOverrideOpen(true); }
                                 if (action === "change") { setIsMappingModalOpen(true); } // Normally you'd pre-select the user, keeping simple
                              }} />
                           </td>
                        </tr>
                     )) : (
                        <tr><td colSpan={7} className="text-center py-16 text-gray-500 font-medium text-[13px]">No matching assignments found.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
}
