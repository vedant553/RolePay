"use client";
import React, { useState } from "react";
import { X, Users, LayoutTemplate, CheckCircle } from "lucide-react";

export function EmployeeMappingModal({ open, onClose, onSubmit, employees, structures }: { open: boolean, onClose: () => void, onSubmit: (data: any) => void, employees: any[], structures: any[] }) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedStructure, setSelectedStructure] = useState("");

  if (!open) return null;

  const handleToggleEmployee = (id: string) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
       setSelectedEmployees([]);
    } else {
       setSelectedEmployees(employees.map(e => e.id));
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#0f172b]/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh]">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <div>
              <h2 className="text-[18px] font-bold text-gray-900">Assign Salary Structure</h2>
              <p className="text-[13px] text-gray-500">Map a calculation ruleset to selected employees.</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">
             
             {/* Target Structure */}
             <div>
                <label className="flex items-center text-[13px] font-bold text-gray-800 mb-2 gap-2"><LayoutTemplate className="size-4 text-[#10b981]" /> Select Base Structure</label>
                <select value={selectedStructure} onChange={e => setSelectedStructure(e.target.value)} className="w-full px-3 py-2.5 text-[13px] font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none bg-white">
                   <option value="">-- Choose a standard template --</option>
                   {structures.map(s => <option key={s.id} value={s.id}>{s.name} ({s.country} • {s.role})</option>)}
                </select>
             </div>

             {/* Employee Selection */}
             <div className="flex-1 flex flex-col overflow-hidden min-h-[300px]">
                <div className="flex items-center justify-between mb-2">
                   <label className="flex items-center text-[13px] font-bold text-gray-800 gap-2"><Users className="size-4 text-[#3b82f6]" /> Select Target Employees</label>
                   <button onClick={handleSelectAll} className="text-[11px] font-bold text-[#3b82f6] hover:underline">
                      {selectedEmployees.length === employees.length ? "Deselect All" : "Select All"}
                   </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg flex-1 overflow-y-auto bg-gray-50/50 p-2 space-y-1">
                   {employees.map(emp => (
                      <div key={emp.id} onClick={() => handleToggleEmployee(emp.id)} className={`flex items-center justify-between p-2 rounded-md cursor-pointer border transition-colors ${selectedEmployees.includes(emp.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50'}`}>
                         <div className="flex items-center gap-3">
                            <div className="size-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">{emp.avatar}</div>
                            <div>
                               <p className="text-[13px] font-bold text-gray-900 leading-tight">{emp.name}</p>
                               <p className="text-[11px] font-medium text-gray-500">{emp.id} • {emp.role}</p>
                            </div>
                         </div>
                         <div className={`size-5 rounded border flex items-center justify-center ${selectedEmployees.includes(emp.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 bg-white'}`}>
                            {selectedEmployees.includes(emp.id) && <CheckCircle className="size-3.5" />}
                         </div>
                      </div>
                   ))}
                </div>
                <p className="text-[11px] font-medium text-gray-500 mt-2 text-right">{selectedEmployees.length} entities selected for mapping.</p>
             </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0 flex items-center justify-end gap-3 rounded-b-xl">
            <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button 
              disabled={selectedEmployees.length === 0 || !selectedStructure}
              onClick={() => { onSubmit({structureId: selectedStructure, employees: selectedEmployees}); onClose(); }} 
              className="px-6 py-2 text-[13px] font-medium text-white bg-[#3b82f6] rounded-lg hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Apply Mapping
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
