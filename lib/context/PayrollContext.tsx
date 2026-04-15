"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

export type PayrollStatus = "draft" | "processing" | "approval" | "disbursement" | "reconciliation" | "reporting" | "locked";
export type UserRole = "executive" | "finance" | "hr";

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  detail: string;
  impactLevel: "low" | "medium" | "critical";
}

export interface EmployeeData {
  id: string;
  name: string;
  role: string;
  entity: string;
  currency: string;
  baseSalary: number;
  allowances: number;
  benefitsDeduction: number;
  overtimeHours: number;
  isExcluded: boolean;
  isFlagged: boolean;
  baseOverride?: number;
  anomalyReason?: string;
}

export interface ComputedEmployee extends EmployeeData {
  gross: number;
  tax: number;
  net: number;
  status: PayrollStatus;
  riskScore: number;
  riskLabel: "Low" | "Medium" | "High";
  riskFactors: string[];
}

export interface EntitySummary {
  name: string;
  country: string;
  employeesCount: number;
  gross: number;
  net: number;
  tax: number;
  status: "ready" | "processing" | "review" | "approved";
  riskLevel: "low" | "medium" | "high";
  variance: number;
  reconciliationStatus: "matched" | "review";
  varianceReason?: string;
}

export interface Approver {
  id: string;
  name: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  timestamp?: string;
}

export interface Transaction {
  id: string;
  employeeId: string;
  employeeName: string;
  bank: string;
  amount: number;
  currency: string;
  status: "pending" | "processed" | "failed";
  timestamp?: string;
  failureReason?: string;
}

export interface PayrollScenario {
  id: string;
  name: string;
  rawEmployees: EmployeeData[];
  createdAt: string;
}

export interface PayrollMetrics {
   totalEmployees: number;
   totalGross: number;
   totalNet: number;
   totalTax: number;
   totalBenefits: number;
   confidenceScore: number;
}

interface PayrollContextType {
  status: PayrollStatus;
  currentStep: number;
  isProcessing: boolean;
  
  rawEmployees: EmployeeData[];
  employees: ComputedEmployee[];
  approvers: Approver[];
  transactions: Transaction[];
  auditLogs: AuditLogItem[];
  
  metrics: PayrollMetrics;
  entities: EntitySummary[];

  activeEmployeeId: string | null;
  setActiveEmployeeId: (id: string | null) => void;
  
  globalBudget: number;
  setGlobalBudget: (v: number) => void;
  scenarios: PayrollScenario[];
  activeScenarioId: string;
  setActiveScenarioId: (id: string) => void;
  createScenario: (name: string, type: "clone" | "optimize_overtime" | "mass_increment") => void;
  computeScenarioMetrics: (scenarioId: string) => PayrollMetrics;

  targetRole: UserRole;
  setTargetRole: (role: UserRole) => void;
  
  checkGovernanceRules: () => { passed: boolean; failures: string[] };

  runPayrollSimulation: () => void;
  approveStep: (approverId: string, action: "approved" | "rejected") => void;
  bulkApprove: () => void;
  bulkReject: () => void;
  proceedToDisbursement: () => void;
  retryTransaction: (txId: string) => void;
  bulkRetryTransactions: () => void;
  processDisbursements: () => void;
  resolveReconciliation: (entityName: string) => void;
  bulkResolveReconciliation: () => void;
  lockPayroll: () => void;

  updateEmployee: (id: string, updates: Partial<EmployeeData>) => void;
  addAuditLog: (action: string, detail: string, impact: "low" | "medium" | "critical", userRole?: string) => void;

  simulateOverrideImpact: (id: string, newBaseOverride: number | undefined, targetExclusion: boolean) => { deltaGross: number; deltaNet: number; deltaTax: number; };
}

const initialEmployees: EmployeeData[] = [
  { id: "EMP001", name: "Sarah Johnson", role: "VP Engineering", entity: "SAASA Inc.", currency: "USD", baseSalary: 12000, allowances: 1500, benefitsDeduction: 800, overtimeHours: 0, isExcluded: false, isFlagged: false },
  { id: "EMP002", name: "Michael Chen", role: "Product Manager", entity: "SAASA Inc.", currency: "USD", baseSalary: 9500, allowances: 500, benefitsDeduction: 500, overtimeHours: 25, isExcluded: false, isFlagged: false, anomalyReason: "Overtime deviation: +200% vs historical average" },
  { id: "EMP003", name: "Emily Davis", role: "Sr. Developer", entity: "SAASA Inc.", currency: "USD", baseSalary: 8500, allowances: 200, benefitsDeduction: 400, overtimeHours: 12, isExcluded: false, isFlagged: false },
  { id: "EMP004", name: "James Mitchell", role: "Sales Director", entity: "SAASA UK", currency: "GBP", baseSalary: 8000, allowances: 2000, benefitsDeduction: 600, overtimeHours: 0, isExcluded: false, isFlagged: false },
  { id: "EMP005", name: "Alice Stewart", role: "Marketing Lead", entity: "SAASA UK", currency: "GBP", baseSalary: 5500, allowances: 300, benefitsDeduction: 300, overtimeHours: 0, isExcluded: false, isFlagged: false },
  { id: "EMP006", name: "Thomas Weber", role: "Operations Head", entity: "SAASA GmbH", currency: "EUR", baseSalary: 7500, allowances: 800, benefitsDeduction: 700, overtimeHours: 0, isExcluded: false, isFlagged: true, anomalyReason: "Tax bracket missing in EU ledger" },
  { id: "EMP007", name: "Elena Rodriguez", role: "HR Manager", entity: "SAASA GmbH", currency: "EUR", baseSalary: 5200, allowances: 400, benefitsDeduction: 400, overtimeHours: 0, isExcluded: false, isFlagged: false },
  { id: "EMP008", name: "Priya Sharma", role: "Lead Engineer", entity: "SAASA India Pvt Ltd", currency: "INR", baseSalary: 350000, allowances: 50000, benefitsDeduction: 12000, overtimeHours: 20, isExcluded: false, isFlagged: false },
  { id: "EMP009", name: "Arjun Patel", role: "QA Tester", entity: "SAASA India Pvt Ltd", currency: "INR", baseSalary: 120000, allowances: 15000, benefitsDeduction: 5000, overtimeHours: 0, isExcluded: false, isFlagged: false },
];

const initialApprovers: Approver[] = [
  { id: "A1", name: "Alice Mercer", role: "Finance Controller", status: "pending" },
  { id: "A2", name: "John Patel", role: "Regional HR Director", status: "pending" },
  { id: "A3", name: "Alex Sterling", role: "Head of Payroll", status: "pending" },
  { id: "A4", name: "Diana Reyes", role: "CFO", status: "pending" },
];

const PayrollContext = createContext<PayrollContextType | null>(null);

function computeTaxes(gross: number, currency: string) {
  if (currency === "USD") return gross * 0.22;
  if (currency === "GBP") return gross * 0.20;
  if (currency === "EUR") return gross * 0.25;
  if (currency === "INR") return gross * 0.15;
  return gross * 0.2;
}

const FX_RATES: Record<string, number> = { USD: 1, GBP: 1.27, EUR: 1.09, INR: 0.012 };

export function PayrollProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<PayrollStatus>("draft");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [approvers, setApprovers] = useState<Approver[]>(initialApprovers);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [resolvedEntities, setResolvedEntities] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState<UserRole>("executive");
  
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    { id: "LOG-000", timestamp: "Active Sync", user: "System", action: "Session Started", detail: "Payroll module logic initialized securely.", impactLevel: "low" }
  ]);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);

  const [globalBudget, setGlobalBudget] = useState<number>(20000000); // normalized USD
  const [scenarios, setScenarios] = useState<PayrollScenario[]>([
     { id: "baseline", name: "Baseline Operations", rawEmployees: JSON.parse(JSON.stringify(initialEmployees)), createdAt: "Just Now" }
  ]);
  const [activeScenarioId, setActiveScenarioId] = useState<string>("baseline");

  const rawEmployees = useMemo(() => scenarios.find(s=>s.id === activeScenarioId)?.rawEmployees || initialEmployees, [scenarios, activeScenarioId]);

  const addAuditLog = useCallback((action: string, detail: string, impactLevel: "low"|"medium"|"critical" = "low", userRole: string = "System") => {
    setAuditLogs(prev => [{
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      user: userRole,
      action,
      detail,
      impactLevel
    }, ...prev]);
  }, []);

  const createScenario = useCallback((name: string, type: "clone" | "optimize_overtime" | "mass_increment") => {
      let newEmployees: EmployeeData[] = JSON.parse(JSON.stringify(rawEmployees)); // Clone current
      
      if (type === "optimize_overtime") {
         newEmployees = newEmployees.map(e => ({ ...e, overtimeHours: 0, anomalyReason: undefined, isFlagged: false }));
         addAuditLog("Scenario Created", `Synthesized scenario '${name}' applying 0x Optimization Overtime modifier.`, "medium", "Finance_Director");
      } else if (type === "mass_increment") {
         newEmployees = newEmployees.map(e => ({ ...e, baseOverride: Math.round(e.baseSalary * 1.05) }));
         addAuditLog("Scenario Created", `Synthesized scenario '${name}' projecting 5% global logic increments.`, "critical", "HR_Leader");
      } else {
         addAuditLog("Scenario Cloned", `Created direct structural clone named '${name}'.`, "low", "HR_Admin");
      }

      setScenarios(prev => [
         ...prev,
         { id: `SCN-${Date.now()}`, name, rawEmployees: newEmployees, createdAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
      ]);
  }, [rawEmployees, addAuditLog]);

  const updateEmployee = useCallback((id: string, updates: Partial<EmployeeData>) => {
    setScenarios(prev => prev.map(s => {
       if(s.id === activeScenarioId) {
          return { ...s, rawEmployees: s.rawEmployees.map(e => e.id === id ? { ...e, ...updates } : e) };
       }
       return s;
    }));
    const impact = updates.isExcluded !== undefined || updates.baseOverride !== undefined ? "critical" : updates.isFlagged !== undefined ? "medium" : "low";
    addAuditLog("Node Parameters Mutated", `Updated payload parameters safely natively for ${id} inside ${activeScenarioId}.`, impact, "HR_Admin");
  }, [activeScenarioId, addAuditLog]);

  const computeEmployeesData = (rawData: EmployeeData[]) => {
      return rawData.map((emp): ComputedEmployee => {
         const activeBase = emp.baseOverride !== undefined ? emp.baseOverride : emp.baseSalary;
         const hourlyRate = activeBase / 160;
         const otPay = emp.overtimeHours * (hourlyRate * 1.5);
         
         const gross = emp.isExcluded ? 0 : activeBase + emp.allowances + otPay;
         const tax = emp.isExcluded ? 0 : computeTaxes(gross, emp.currency);
         const net = emp.isExcluded ? 0 : gross - tax - emp.benefitsDeduction;

         let riskScore = 0; let riskFactors: string[] = [];
         if(emp.isFlagged) { riskScore += 50; riskFactors.push("Manually Flagged for Anomaly"); }
         if(emp.baseOverride !== undefined) { riskScore += 40; riskFactors.push("Active Database Bypass (Override)"); }
         if(emp.overtimeHours > 20) { riskScore += 30; riskFactors.push("Excessive Overtime Cost Driver"); }
         if(emp.isExcluded) { riskScore += 20; riskFactors.push("Excluded from Active Matrix Execution"); }

         const riskLabel = riskScore >= 70 ? "High" : riskScore >= 30 ? "Medium" : "Low";
         return { ...emp, baseSalary: activeBase, gross, tax, net, status, riskScore, riskLabel, riskFactors };
      });
  };

  const getMetricsLogic = (comps: ComputedEmployee[]) => {
      let tg = 0, tn = 0, tt = 0, tb = 0, activeCount = 0;
      let perfectNodes = 0;
      comps.forEach(e => {
         if(e.isExcluded) return;
         activeCount++;
         if(e.riskLabel === "Low") perfectNodes++;
         const rate = FX_RATES[e.currency] || 1;
         tg += e.gross * rate; tn += e.net * rate; tt += e.tax * rate; tb += e.benefitsDeduction * rate;
      });
      const m = 20; 
      let confidenceScore = Math.min(100, Math.round((perfectNodes / (activeCount||1)) * 100));
      if(activeCount === 0) confidenceScore = 0;
      return { totalEmployees: activeCount * 138, totalGross: tg * m, totalNet: tn * m, totalTax: tt * m, totalBenefits: tb * m, confidenceScore };
  }

  const employees = useMemo(() => computeEmployeesData(rawEmployees), [rawEmployees, status]);
  const metrics = useMemo(() => getMetricsLogic(employees), [employees]);

  const computeScenarioMetrics = useCallback((scenarioId: string) => {
      const targetScen = scenarios.find(s=>s.id === scenarioId);
      if(!targetScen) return getMetricsLogic([]);
      const comps = computeEmployeesData(targetScen.rawEmployees);
      return getMetricsLogic(comps);
  }, [scenarios]);

  const simulateOverrideImpact = useCallback((empId: string, newBaseOverride: number | undefined, targetExclusion: boolean) => {
     const emp = rawEmployees.find(e => e.id === empId);
     if(!emp) return { deltaGross: 0, deltaNet: 0, deltaTax: 0 };
     
     const actBaseOld = emp.baseOverride !== undefined ? emp.baseOverride : emp.baseSalary;
     const otPayOld = emp.overtimeHours * ((actBaseOld / 160) * 1.5);
     const gOld = emp.isExcluded ? 0 : actBaseOld + emp.allowances + otPayOld;
     const tOld = emp.isExcluded ? 0 : computeTaxes(gOld, emp.currency);
     const nOld = emp.isExcluded ? 0 : gOld - tOld - emp.benefitsDeduction;

     const actBaseNew = newBaseOverride !== undefined ? newBaseOverride : emp.baseSalary;
     const otPayNew = emp.overtimeHours * ((actBaseNew / 160) * 1.5);
     const gNew = targetExclusion ? 0 : actBaseNew + emp.allowances + otPayNew;
     const tNew = targetExclusion ? 0 : computeTaxes(gNew, emp.currency);
     const nNew = targetExclusion ? 0 : gNew - tNew - emp.benefitsDeduction;

     const rate = FX_RATES[emp.currency] || 1;
     return {
        deltaGross: (gNew - gOld) * rate * 20,
        deltaNet: (nNew - nOld) * rate * 20,
        deltaTax: (tNew - tOld) * rate * 20,
     };
  }, [rawEmployees]);

  const entities = useMemo(() => {
    const entityMap = new Map<string, EntitySummary>();
    const defaultEntities = [
      { name: "SAASA Inc.", country: "USA", variance: 0, reconciliationStatus: "matched" as const, varianceReason: "" },
      { name: "SAASA UK", country: "UK", variance: 0, reconciliationStatus: "matched" as const, varianceReason: "" },
      { name: "SAASA GmbH", country: "Germany", variance: 1820, reconciliationStatus: "review" as const, varianceReason: "API returned unexpected ledger padding offset for EU VAT adjustments." },
      { name: "SAASA India Pvt Ltd", country: "India", variance: 0, reconciliationStatus: "matched" as const, varianceReason: "" }
    ];

    defaultEntities.forEach(de => {
      entityMap.set(de.name, {
        name: de.name, country: de.country, employeesCount: 0, gross: 0, net: 0, tax: 0,
        status: status === "draft" ? "ready" : status === "processing" ? "processing" : "approved",
        riskLevel: de.variance > 0 ? "high" : "low", variance: de.variance,
        reconciliationStatus: resolvedEntities.includes(de.name) ? "matched" : de.reconciliationStatus,
        varianceReason: resolvedEntities.includes(de.name) ? "Manually authorized override" : de.varianceReason
      });
    });

    employees.forEach(e => {
      if(e.isExcluded) return;
      const ent = entityMap.get(e.entity);
      if (ent) {
        ent.employeesCount += 105; ent.gross += e.gross * 20; ent.net += e.net * 20; ent.tax += e.tax * 20;
      }
    });

    return Array.from(entityMap.values());
  }, [employees, status, resolvedEntities]);

  // Governance Checks Layer
  const checkGovernanceRules = useCallback(() => {
     let failures: string[] = [];
     if(metrics.totalGross > globalBudget) {
        failures.push(`Violation: Total Payroll ($${metrics.totalGross.toLocaleString("en-US")}) exceeds Executive Budget ($${globalBudget.toLocaleString("en-US")}).`);
     }
     const highRisk = employees.filter(e => e.riskLabel === "High").length;
     if(highRisk > 0) {
        failures.push(`Violation: ${highRisk} nodes flagged as High Risk physically blocking array seal.`);
     }
     if(metrics.confidenceScore < 60) {
        failures.push(`Violation: Decision Confidence drops below 60% system threshold threshold.`);
     }
     return { passed: failures.length === 0, failures };
  }, [metrics, globalBudget, employees]);

  const runPayrollSimulation = useCallback(() => {
    setStatus("processing"); setIsProcessing(true); setCurrentStep(1);
    addAuditLog("Computation Init", "Mathematical logic model initialized effectively.", "medium", "System");
    setTimeout(() => { setIsProcessing(false); setStatus("approval"); setCurrentStep(3); addAuditLog("Calculation Terminated", "Matrix secured natively. Sequence authorized.", "medium", "System"); }, 3000);
  }, [addAuditLog]);

  const approveStep = useCallback((id: string, action: "approved" | "rejected") => {
    setApprovers(p => p.map(a => a.id === id ? { ...a, status: action, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) } : a));
    addAuditLog("Segment Signed", `Node ${id} secured status: ${action}.`, "medium", targetRole.toUpperCase());
  }, [addAuditLog, targetRole]);

  const bulkApprove = useCallback(() => {
    setApprovers(p => p.map(a => ({ ...a, status: "approved", timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) })));
    addAuditLog("Bulk Signatures Appended", "Authorized securely via master logic signature limit.", "critical", "Finance_Director");
  }, [addAuditLog]);

  const bulkReject = useCallback(() => {
    setApprovers(p => p.map(a => ({ ...a, status: "rejected", timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) })));
    addAuditLog("Bulk Signature Rejection", "Frozen completely natively.", "critical", "System_Admin");
  }, [addAuditLog]);

  const proceedToDisbursement = useCallback(() => {
    const allApproved = approvers.every(a => a.status === "approved");
    if (!allApproved) return;
    setStatus("disbursement"); setCurrentStep(4);
    
    const txns: Transaction[] = employees.filter(e=>!e.isExcluded).map((e, idx) => ({
      id: `TXN-${8800 + idx}`, employeeId: e.id, employeeName: e.name, bank: idx % 3 === 0 ? "Chase Bank" : idx % 2 === 0 ? "Barclays" : "Deutsche Bank",
      amount: e.net, currency: e.currency, status: "pending"
    }));
    setTransactions(txns);
    addAuditLog("Engine Dropped Into Processing", `Disbursed dynamically mapped securely.`, "critical", "CFO");
  }, [approvers, employees, addAuditLog]);

  const processDisbursements = useCallback(() => {
    setIsProcessing(true); addAuditLog("API PUSH TRIGGERED", "Batch API running safely via local gateways natively.", "critical", "Finance_Admin");
    setTimeout(() => {
      setTransactions(prev => prev.map((t, idx) => {
         const failed = idx === 5;
         return { ...t, status: failed ? "failed" : "processed", timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), failureReason: failed ? "Gateway timeout threshold exceeded (Error Code: ERR_DEST_TIMED_OUT) resolving via Deutsche Bank target" : undefined }
      }));
      setIsProcessing(false); setStatus("reconciliation"); addAuditLog("Banking Run Concluded", "Float check bounds enabled natively.", "medium", "System");
    }, 2500);
  }, [addAuditLog]);

  const retryTransaction = useCallback((id: string) => {
    setTransactions(p => p.map(t => t.id === id ? { ...t, status: "processed", timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), failureReason: undefined } : t));
    addAuditLog("Forced API Packet Sync", `Overrode push timeout manually on target matrix securely.`, "medium", "Finance_Admin");
  }, [addAuditLog]);

  const bulkRetryTransactions = useCallback(() => {
    setTransactions(p => p.map(t => t.status === "failed" ? { ...t, status: "processed", timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), failureReason: undefined } : t));
    addAuditLog("Recursive API Packet Sync", "Master forced securely timeout natively mapped cleared successfully.", "critical", "Lead_Engineer");
  }, [addAuditLog]);

  const resolveReconciliation = useCallback((entityName: string) => {
    setResolvedEntities(p => [...p, entityName]);
    addAuditLog("Ledger Overridden", `Matched natively tracking parameters matrix.`, "critical", "Finance_Controller");
  }, [addAuditLog]);

  const bulkResolveReconciliation = useCallback(() => {
    const all = entities.map(e => e.name);
    setResolvedEntities(all);
    addAuditLog("Ledger Overridden Master", "Forced global delta scaling resolution logic completely securely.", "critical", "Finance_Director");
  }, [addAuditLog, entities]);

  const lockPayroll = useCallback(() => {
    setStatus("locked");
    addAuditLog("Terminator Executed", "Immutable final mathematical limit bound secured matrix locked natively.", "critical", "CFO");
  }, [addAuditLog]);

  return (
    <PayrollContext.Provider value={{
      status, currentStep, isProcessing, rawEmployees, employees, approvers, transactions, auditLogs,
      metrics, entities, activeEmployeeId, setActiveEmployeeId,
      globalBudget, setGlobalBudget, scenarios, activeScenarioId, setActiveScenarioId, createScenario, computeScenarioMetrics,
      targetRole, setTargetRole, checkGovernanceRules,
      runPayrollSimulation, approveStep, bulkApprove, bulkReject, proceedToDisbursement,
      retryTransaction, bulkRetryTransactions, processDisbursements, resolveReconciliation, bulkResolveReconciliation, lockPayroll,
      updateEmployee, addAuditLog, simulateOverrideImpact
    }}>
      {children}
    </PayrollContext.Provider>
  );
}

export function usePayroll() {
  const ctx = useContext(PayrollContext);
  if (!ctx) throw new Error("usePayroll must be used within PayrollProvider");
  return ctx;
}
