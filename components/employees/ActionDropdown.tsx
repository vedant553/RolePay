"use client";
import React, { useState } from "react";
import { MoreHorizontal, User, Edit3, Settings, PlayCircle, FileText, AlertCircle, Trash2, Power } from "lucide-react";

export function ActionDropdown({ employee, onAction }: { employee: any, onAction: (action: string, emp: any) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="text-[#64748b] hover:text-[#0f172b] transition-colors p-1"
      >
        <MoreHorizontal className="size-4" strokeWidth={2} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }}></div>
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-gray-100">
            <div className="py-1">
              <button className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("view", employee); }}>
                <User className="size-3.5 mr-2" /> View Profile
              </button>
              <button className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("edit", employee); }}>
                <Edit3 className="size-3.5 mr-2" /> Edit Employee
              </button>
            </div>
            <div className="py-1">
              <button className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("run_payroll", employee); }}>
                <PlayCircle className="size-3.5 mr-2" /> Run Payroll
              </button>
              <button className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("payslip", employee); }}>
                <FileText className="size-3.5 mr-2" /> View Payslip History
              </button>
              <button className="flex w-full items-center px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("override", employee); }}>
                <Settings className="size-3.5 mr-2" /> Override Payroll
              </button>
            </div>
            <div className="py-1">
              <button className="flex w-full items-center px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 font-medium" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("delete", employee); }}>
                <Trash2 className="size-3.5 mr-2" /> Delete Employee
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
