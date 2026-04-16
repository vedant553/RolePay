"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, CheckCircle2 } from "lucide-react";

export function SalaryBuilderDrawer({ open, onClose, onSubmit, initialData }: { open: boolean, onClose: () => void, onSubmit: (data: any) => void, initialData?: any }) {
  const [formData, setFormData] = useState<any>({ earnings: [], deductions: [], contributions: [] });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          name: "", country: "", role: "",
          earnings: [{ id: 1, name: "Basic Pay", type: "fixed", value: "" }],
          deductions: [{ id: 1, name: "Tax", type: "percent", value: "" }],
          contributions: [{ id: 1, name: "Employer PF", type: "percent", value: "" }]
        });
      }
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleAddComponent = (section: 'earnings' | 'deductions' | 'contributions') => {
    setFormData((prev: any) => ({
       ...prev,
       [section]: [...prev[section], { id: Date.now(), name: "", type: "fixed", value: "" }]
    }));
  };

  const handleUpdateComponent = (section: 'earnings' | 'deductions' | 'contributions', id: number, field: string, value: string) => {
    setFormData((prev: any) => ({
       ...prev,
       [section]: prev[section].map((item: any) => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleRemoveComponent = (section: 'earnings' | 'deductions' | 'contributions', id: number) => {
    setFormData((prev: any) => ({
       ...prev,
       [section]: prev[section].filter((item: any) => item.id !== id)
    }));
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#0f172b]/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-gray-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">{initialData ? "Edit Salary Structure" : "Create Salary Structure"}</h2>
            <p className="text-[13px] text-gray-500">Configure base logic for earnings, deductions, and contributions.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
           
           {/* Left Form */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* SECTION 1: Basic Info */}
              <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                 <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="block text-[12px] font-medium text-gray-700 mb-1">Structure Name *</label>
                       <input type="text" value={formData.name || ""} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] outline-none" placeholder="e.g. Executive L3 - USA" />
                    </div>
                    <div>
                       <label className="block text-[12px] font-medium text-gray-700 mb-1">Country</label>
                       <select value={formData.country || ""} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] outline-none bg-white">
                          <option value="">Select Country</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="India">India</option>
                          <option value="Global">Global Standard</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-[12px] font-medium text-gray-700 mb-1">Role / Department</label>
                       <input type="text" value={formData.role || ""} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] outline-none" placeholder="e.g. Engineering" />
                    </div>
                 </div>
              </section>

              {/* Sections Generator */}
              {[
                { key: "earnings", title: "Earnings (Income)", color: "border-[#10b981] text-[#10b981]" },
                { key: "deductions", title: "Deductions", color: "border-red-500 text-red-500" },
                { key: "contributions", title: "Employer Contributions", color: "border-blue-500 text-blue-500" }
              ].map((sectionData) => (
                 <section key={sectionData.key} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${sectionData.color.split(' ')[0].replace('border', 'bg')}`}></div>
                    
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                       <h3 className="text-[14px] font-bold text-gray-800">{sectionData.title}</h3>
                       <button onClick={() => handleAddComponent(sectionData.key as any)} className={`text-[12px] font-bold flex items-center gap-1 ${sectionData.color.split(' ')[1]}`}>
                         <Plus className="size-3.5" /> Add Field
                       </button>
                    </div>

                    <div className="space-y-3">
                       {formData[sectionData.key]?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                             <input type="text" value={item.name} onChange={(e) => handleUpdateComponent(sectionData.key as any, item.id, 'name', e.target.value)} placeholder="Component Name" className="flex-1 px-3 py-1.5 text-[12px] border border-gray-300 rounded-md outline-none bg-white font-medium" />
                             
                             <select value={item.type} onChange={(e) => handleUpdateComponent(sectionData.key as any, item.id, 'type', e.target.value)} className="w-[100px] px-2 py-1.5 text-[12px] border border-gray-300 rounded-md outline-none bg-white">
                                <option value="fixed">Fixed ($)</option>
                                <option value="percent">Percent (%)</option>
                             </select>
                             
                             <input type="text" value={item.value} onChange={(e) => handleUpdateComponent(sectionData.key as any, item.id, 'value', e.target.value)} placeholder="0.00" className="w-[120px] px-3 py-1.5 text-[12px] border border-gray-300 rounded-md outline-none bg-white" />
                             
                             <button onClick={() => handleRemoveComponent(sectionData.key as any, item.id)} className="p-1.5 text-gray-400 hover:text-red-500 bg-white border border-transparent hover:border-red-200 rounded-md transition-colors"><Trash2 className="size-4" /></button>
                          </div>
                       ))}
                       {formData[sectionData.key]?.length === 0 && <p className="text-[12px] text-gray-500 italic py-2">No components defined.</p>}
                    </div>
                 </section>
              ))}
           </div>

           {/* Right Panel preview */}
           <div className="w-[320px] bg-gray-100 border-l border-gray-200 p-6 flex flex-col shrink-0">
              <h3 className="text-[14px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <CheckCircle2 className="size-4 text-[#10b981]" /> Summary Preview
              </h3>
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4 text-[13px] sticky top-6">
                 <div>
                    <span className="text-gray-500 block mb-1 font-medium">Total Gross Earnings</span>
                    <span className="text-[20px] font-bold text-gray-900 leading-tight">Configured</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Sum of Base + Allowances</p>
                 </div>
                 <div className="pt-4 border-t border-gray-100">
                    <span className="text-gray-500 block mb-1 font-medium">Deductions</span>
                    <span className="text-[16px] font-bold text-red-500">Dependent on input</span>
                 </div>
                 <div className="pt-4 border-t border-gray-100 mb-2">
                    <span className="text-gray-500 block mb-1 font-medium">Expected Net Salary</span>
                    <span className="text-[20px] font-bold text-[#10b981] block">Net Allocation</span>
                    <p className="text-[11px] text-gray-400 mt-1">Calculated via final payroll logic. No simulation provided.</p>
                 </div>
                 
                 <div className="pt-4 mt-4 border-t border-gray-200">
                   <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-md font-medium">Overrides configured at employee level will bypass these rules.</p>
                 </div>
              </div>
           </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex items-center justify-end gap-3 rounded-bl-xl">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => { onSubmit(formData); onClose(); }} className="px-6 py-2 text-[13px] font-medium text-white bg-[#10b981] rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
            Save Structure
          </button>
        </div>

      </div>
    </>
  );
}
