"use client";
import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react";

export function EmployeeFormDrawer({ open, onClose, onSubmit, initialData }: { open: boolean, onClose: () => void, onSubmit: (data: any) => void, initialData?: any }) {
  const [formData, setFormData] = useState<any>({});
  const [bankValidation, setBankValidation] = useState<"none" | "valid" | "invalid">("none");
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(initialData || {});
      setBankValidation("none");
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValidateBank = () => {
    // Fake validation
    if (formData.accountNumber && formData.ifsc) {
      setBankValidation("valid");
    } else {
      setBankValidation("invalid");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#0f172b]/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-gray-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">{initialData ? "Edit Employee" : "Add Employee"}</h2>
            <p className="text-[13px] text-gray-500">Configure personal, job, and salary structures.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Personal Details */}
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Full Name *</label>
                <input required type="text" name="name" value={formData.name || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" name="email" value={formData.email || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none" placeholder="jane@company.com" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none" placeholder="+1 234 567 890" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Date of Joining</label>
                <input type="date" name="doj" value={formData.doj || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none" />
              </div>
            </div>
          </section>

          {/* Section 2: Job Details */}
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Job Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Department</label>
                <select name="department" value={formData.department || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none">
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Role</label>
                <input type="text" name="role" value={formData.role || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none" placeholder="e.g. Senior Developer" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Location (Country)</label>
                <select name="country" value={formData.country || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none">
                  <option value="">Select Location</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="India">India</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Employment Type</label>
                <select name="employmentType" value={formData.employmentType || "Full-Time"} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none">
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Bank Details */}
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
              <span>Bank Details</span>
              {bankValidation === "valid" && <span className="flex items-center text-[#10b981] text-[11px] font-bold bg-[#10b981]/10 px-2 py-0.5 rounded"><CheckCircle2 className="size-3 mr-1" /> Validated</span>}
              {bankValidation === "invalid" && <span className="flex items-center text-red-500 text-[11px] font-bold bg-red-50 px-2 py-0.5 rounded"><AlertCircle className="size-3 mr-1" /> Needs Correction</span>}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Account Number</label>
                <input type="text" name="accountNumber" value={formData.accountNumber || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">IFSC / SWIFT Code</label>
                <input type="text" name="ifsc" value={formData.ifsc || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Bank Name</label>
                <input type="text" name="bankName" value={formData.bankName || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none" />
              </div>
            </div>
            <button type="button" onClick={handleValidateBank} className="text-[#10b981] border border-[#10b981] hover:bg-[#10b981]/5 px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors">
              Validate Bank Details
            </button>
          </section>

          {/* Section 4: Salary Assignment */}
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Salary Assignment</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Select Salary Structure</label>
                <select name="salaryTemplate" value={formData.salaryTemplate || ""} onChange={handleChange} className="w-full px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none">
                  <option value="">Select Structure</option>
                  <option value="Executive L3">Executive L3 ($145,000)</option>
                  <option value="Senior L2">Senior L2 ($92,000)</option>
                  <option value="Mid-Level L1">Mid-Level L1 ($72,000)</option>
                </select>
              </div>
              <div>
                 <label className="block text-[12px] font-medium text-gray-700 mb-1">Base Salary Override (Optional)</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 text-[13px]">$</div>
                   <input type="number" name="grossSalary" value={formData.grossSalary || ""} onChange={handleChange} placeholder="Custom Amount" className="w-full pl-7 pr-3 py-2 text-[13px] border border-gray-300 rounded-md focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none" />
                 </div>
              </div>
            </div>
          </section>

          {/* Section 5: Documents */}
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-[14px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Documents</h3>
            <div 
               className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${isHoveringDrop ? 'border-[#10b981] bg-[#10b981]/5' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
               onDragOver={(e) => { e.preventDefault(); setIsHoveringDrop(true); }}
               onDragLeave={() => setIsHoveringDrop(false)}
               onDrop={(e) => { e.preventDefault(); setIsHoveringDrop(false); }}
            >
              <UploadCloud className="size-8 text-gray-400 mb-2" />
              <p className="text-[13px] text-gray-600 font-medium text-center">Drag & drop files here, or <span className="text-[#10b981] cursor-pointer hover:underline">browse</span></p>
              <p className="text-[11px] text-gray-400 mt-1">Supported: ID Proof, Contracts, Tax Documents (PDF, JPG)</p>
            </div>
            {/* Show dummy file if editing */}
            {initialData && (
              <div className="mt-3 bg-white border border-gray-200 rounded-md p-2 flex items-center justify-between">
                 <div className="flex items-center">
                    <div className="size-8 bg-gray-100 rounded flex items-center justify-center mr-3"><span className="text-[10px] font-bold text-gray-500">PDF</span></div>
                    <div>
                       <p className="text-[12px] font-medium text-gray-800">Employment_Contract.pdf</p>
                       <p className="text-[10px] text-gray-500">240 KB</p>
                    </div>
                 </div>
                 <button type="button" className="text-red-500 hover:bg-red-50 p-1.5 rounded-md"><Trash2 className="size-3.5" /></button>
              </div>
            )}
          </section>

        </form>

        <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-6 py-2 text-[13px] font-medium text-white bg-[#10b981] rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
            Save Employee
          </button>
        </div>

      </div>
    </>
  );
}
