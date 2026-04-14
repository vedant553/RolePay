"use client";
import React from "react";
import { X, Copy, Edit2, Info } from "lucide-react";

export function TemplateDrawer({ open, onClose, template, onEdit, onDuplicate }: any) {
  if (!open || !template) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-50 transform transition-transform overflow-y-auto flex flex-col border-l border-[#e2e8f0]">
        
        <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {template.name.substring(0, 2).toUpperCase()}
             </div>
             <div>
                <h2 className="text-lg font-bold text-[#0f172b] leading-tight pr-4">{template.name}</h2>
                <p className="text-[12px] text-[#64748b]">ID: {template.id} • {template.status.toUpperCase()}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f1f5f9] rounded-md text-[#64748b]">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
           <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3">Template Core Info</h3>
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                 <div><span className="text-[#64748b] block mb-0.5">Country:</span><span className="font-bold cursor-help">{template.country}</span></div>
                 <div><span className="text-[#64748b] block mb-0.5">Grade/Band:</span><span className="font-bold font-mono text-[#0f172b] px-1 bg-slate-200 rounded">{template.grade}</span></div>
              </div>
           </div>

           <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3">Salary Breakdown</h3>
              <div className="space-y-4 text-[13px]">
                 <div className="flex justify-between items-center"><span className="text-[#64748b] font-medium">Base Structure:</span><span className="font-bold text-[#10b981] text-[16px]">{template.baseStructure}</span></div>
                 <div className="flex justify-between items-center"><span className="text-[#64748b] font-medium">Variable Rule:</span><span className="font-bold text-[#3b82f6]">{template.variableRule}</span></div>
              </div>
           </div>

           <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#94a3b8] mb-3">Assigned Employees</h3>
              <div className="flex justify-between items-center bg-white p-3 border border-[#e2e8f0] rounded-lg shadow-sm">
                 <div>
                   <span className="text-[20px] font-bold text-[#0f172b]">{template.employeesAssigned}</span>
                   <span className="text-[12px] text-[#64748b] block">Total Active Assignments</span>
                 </div>
                 <button className="text-[11px] font-bold text-[#10b981] border border-[#10b981] px-2.5 py-1 rounded hover:bg-[#10b981] hover:text-white transition-colors">View All</button>
              </div>
           </div>
           
           <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[12px] text-blue-800 flex items-start gap-2 shadow-sm">
              <Info className="size-4 shrink-0 mt-0.5 text-blue-600" />
              <span>Variable pay calculations apply linearly to Base Structure per active regional policy overrides.</span>
           </div>
        </div>

        <div className="p-5 border-t border-[#e2e8f0] bg-[#f8fafc] flex gap-3">
           <button onClick={() => {onClose(); onDuplicate(template)}} className="flex-1 py-2.5 bg-white border border-[#e2e8f0] rounded-lg text-[13px] font-bold text-[#334155] hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
             <Copy className="size-4" /> Duplicate
           </button>
           <button onClick={() => {onClose(); onEdit(template)}} className="flex-1 py-2.5 bg-[#10b981] text-white rounded-lg text-[13px] font-bold hover:bg-[#0ea872] shadow-sm flex items-center justify-center gap-2 transition-colors">
             <Edit2 className="size-4" /> Edit Rules
           </button>
        </div>
      </div>
    </>
  );
}
