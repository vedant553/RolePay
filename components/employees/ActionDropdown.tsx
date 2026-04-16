"use client";
import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, User, Edit3, Power, Trash2 } from "lucide-react";

export function ActionDropdown({ employee, onAction }: { employee: any, onAction: (action: string, emp: any) => void }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="text-[#64748b] hover:text-[#0f172b] focus:outline-none transition-colors p-1 rounded-md hover:bg-gray-100"
      >
        <MoreHorizontal className="size-4" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-gray-100">
          <div className="py-1">
            <button className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 focus:outline-none" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("view", employee); }}>
              <User className="size-3.5 mr-2 text-gray-400" /> View Profile
            </button>
            <button className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 focus:outline-none" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("edit", employee); }}>
              <Edit3 className="size-3.5 mr-2 text-gray-400" /> Edit Employee
            </button>
          </div>
          <div className="py-1">
            <button className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 focus:outline-none" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("toggle_status", employee); }}>
              <Power className="size-3.5 mr-2 text-gray-400" /> Mark {employee.status === "Active" ? "Inactive" : "Active"}
            </button>
          </div>
          <div className="py-1">
            <button className="flex w-full items-center px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 focus:outline-none" onClick={(e) => { e.stopPropagation(); setOpen(false); onAction("delete", employee); }}>
              <Trash2 className="size-3.5 mr-2 text-red-400" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
