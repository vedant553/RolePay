import { PayrollProvider } from "@/lib/context/PayrollContext";
import React from "react";
import EmployeeDrawer from "./components/EmployeeDrawer";

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <PayrollProvider>
      {children}
      <EmployeeDrawer />
    </PayrollProvider>
  );
}
