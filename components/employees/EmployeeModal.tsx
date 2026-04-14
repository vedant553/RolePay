"use client";
import React, { useState } from "react";
import { X, Check } from "lucide-react";

export function EmployeeModal({ open, onClose, onSave, initialData }: { open: boolean, onClose: () => void, onSave: (data: any) => void, initialData?: any }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData || { 
    name: "", email: "", country: "", department: "",
    role: "", salaryTemplate: "", employmentType: "", joiningDate: "",
    bankAccount: "", paymentMode: "",
    taxId: ""
  });

  if (!open) return null;

  const validateStep = (s: number) => {
    if (s === 1) return formData.name && formData.email && formData.country;
    if (s === 2) return formData.role && formData.employmentType;
    if (s === 3) return formData.bankAccount && formData.paymentMode;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-[#0f172b]">
            {initialData ? "Edit Employee Profile" : "Onboard New Employee"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f1f5f9] rounded-md text-[#64748b]">
            <X className="size-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="bg-[#f8fafc] px-6 py-3 border-b border-[#e2e8f0] flex items-center gap-4 shrink-0">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div className={`size-6 rounded-full flex items-center justify-center text-[12px] font-bold ${step === num ? "bg-[#10b981] text-white" : step > num ? "bg-[#d1fae5] text-[#065f46]" : "bg-white border border-[#e2e8f0] text-[#94a3b8]"}`}>
                {step > num ? <Check className="size-3" /> : num}
              </div>
              <span className={`text-[12px] font-bold ${step >= num ? "text-[#0f172b]" : "text-[#94a3b8]"}`}>
                {num === 1 ? "Basic Info" : num === 2 ? "Job Details" : num === 3 ? "Payroll Setup" : "Compliance"}
              </span>
              {num < 4 && <div className="w-6 sm:w-10 h-[2px] bg-[#e2e8f0]" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="px-8 py-6 flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Legal Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name || ""} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]" placeholder="e.g. Alex Sterling" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Corporate Email <span className="text-red-500">*</span></label>
                <input type="email" value={formData.email || ""} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]" placeholder="alex@saasa.io" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Primary Country <span className="text-red-500">*</span></label>
                <select value={formData.country || ""} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]">
                  <option value="">Select Region</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Germany">Germany</option>
                  <option value="India">India</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Designation / Role <span className="text-red-500">*</span></label>
                <input type="text" value={formData.role || ""} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]" placeholder="e.g. Senior Engineer" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Department</label>
                <input type="text" value={formData.department || ""} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]" placeholder="Engineering" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Employment Type <span className="text-red-500">*</span></label>
                <select value={formData.employmentType || ""} onChange={(e) => setFormData({...formData, employmentType: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]">
                  <option value="">Select Type</option>
                  <option value="Full-Time">Full-Time Built-in</option>
                  <option value="Contractor">Contractor (1099)</option>
                  <option value="Part-Time">Part-Time / Retainer</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Joining Date</label>
                <input type="date" value={formData.joiningDate || ""} onChange={(e) => setFormData({...formData, joiningDate: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Mapped Salary Template</label>
                <select value={formData.salaryTemplate || ""} onChange={(e) => setFormData({...formData, salaryTemplate: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]">
                  <option value="">No Active Template</option>
                  <option value="Executive L3">Executive L3</option>
                  <option value="Senior L2">Senior L2</option>
                  <option value="Mid-Level L1">Mid-Level L1</option>
                </select>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Authorized Payment Mode <span className="text-red-500">*</span></label>
                <select value={formData.paymentMode || ""} onChange={(e) => setFormData({...formData, paymentMode: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]">
                  <option value="">Select Routing Action</option>
                  <option value="Direct Deposit">Direct Deposit (Automated)</option>
                  <option value="Wire Transfer">Wire Transfer (Manual Check)</option>
                  <option value="Crypto Endpoint">USDC Crypto Endpoint</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Bank Account / IBAN Hash <span className="text-red-500">*</span></label>
                <input type="text" value={formData.bankAccount || ""} onChange={(e) => setFormData({...formData, bankAccount: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]" placeholder="Routing + Acc number" />
              </div>
              <div className="col-span-2 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-[12px] text-amber-800 font-medium">Verify credentials carefully. Incorrect routing paths trigger heavy system reversion compliance checks.</p>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Regional Tax ID</label>
                <input type="text" value={formData.taxId || ""} onChange={(e) => setFormData({...formData, taxId: e.target.value})} className="w-full h-10 border border-[#e2e8f0] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[#10b981]" placeholder="e.g. SSN or National ID" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-bold text-[#64748b] mb-1.5 uppercase tracking-wide">Contract Upload (Optional)</label>
                <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl bg-[#f8fafc] p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                  <p className="text-[13px] font-bold text-[#0f172b]">Drag PDF Contract here</p>
                  <p className="text-[11px] text-[#64748b] mt-1">To verify regional compliance automatically.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc] shrink-0">
          <div>
            {step > 1 && (
               <button onClick={() => setStep(step - 1)} className="px-4 py-2 border border-[#e2e8f0] bg-white rounded-lg text-[14px] font-bold text-[#64748b] hover:bg-slate-50 transition-colors">Back</button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 hover:bg-[#e2e8f0] rounded-lg text-[14px] font-bold text-[#64748b] transition-colors">Save Draft</button>
            {step < 4 ? (
              <button 
                onClick={() => {
                   if(!validateStep(step)) return alert("Please fill all required mandatory fields denoted by red asterisks.");
                   setStep(step + 1);
                }} 
                className="px-6 py-2 bg-[#10b981] hover:bg-[#0ea370] text-white rounded-lg text-[14px] font-bold shadow-sm transition-colors"
              >
                Proceed
              </button>
            ) : (
              <button onClick={() => onSave(formData)} className="px-6 py-2 bg-[#10b981] hover:bg-[#0ea370] text-white rounded-lg text-[14px] font-bold shadow-sm transition-colors">
                Finalize & Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
