"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CreditCard, Link2, CheckCircle, AlertTriangle, RefreshCw, TrendingDown } from "lucide-react";

const transactionData = [
  { day: "Mar 24", debit: 145, credit: 510 },
  { day: "Mar 25", debit: 22, credit: 88 },
  { day: "Mar 26", debit: 189, credit: 32 },
  { day: "Mar 27", debit: 56, credit: 214 },
  { day: "Mar 28", debit: 448, credit: 18 },
  { day: "Mar 29", debit: 12, credit: 0 },
  { day: "Mar 30", debit: 8, credit: 72 },
];

const bankAccounts = [
  { bank: "Chase Bank (USA)", account: "****8821", balance: "$218,392.40", status: "active" },
  { bank: "HDFC Bank (India)", account: "****3312", balance: "₹74,28,000", status: "active" },
  { bank: "Deutsche Bank (Germany)", account: "****0094", balance: "€111,048.00", status: "review" },
  { bank: "DBS Bank (Singapore)", account: "****7761", balance: "S$85,140.00", status: "active" },
];

const integrations = [
  { name: "QuickBooks Online", type: "Accounting", lastSync: "5 min ago", status: "connected" },
  { name: "SAP S/4HANA", type: "ERP", lastSync: "1 hour ago", status: "connected" },
  { name: "Xero", type: "Accounting", lastSync: "15 min ago", status: "connected" },
  { name: "NetSuite", type: "ERP", lastSync: "Never", status: "disconnected" },
];

export default function BankingPage() {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172b] mb-2">Banking & Accounting</h1>
          <p className="text-[14px] text-[#62748e]">Multi-bank treasury management, ERP integrations, and real-time accounting sync</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] text-[#0f172b] font-bold text-[14px] px-4 py-2.5 rounded-xl hover:bg-[#f8fafc]">
          <RefreshCw className="size-4" strokeWidth={2} /> Sync All Banks
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Treasury Balance", value: "$480,454", sub: "Across all 4 entities", icon: CreditCard, color: "bg-[#10b981]" },
          { label: "Month Disbursed", value: "$565,240", sub: "March 2026", icon: TrendingDown, color: "bg-[#3b82f6]" },
          { label: "Active Integrations", value: "3/4", sub: "NetSuite pending", icon: Link2, color: "bg-[#8b5cf6]" },
          { label: "Reconciliation Status", value: "99.2%", sub: "Match rate", icon: CheckCircle, color: "bg-[#10b981]" },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-[rgba(226,232,240,0.6)] rounded-2xl p-5 shadow-sm">
            <div className={`${card.color} rounded-xl size-9 flex items-center justify-center mb-3`}>
              <card.icon className="size-4 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[10px] font-bold text-[#62748e] uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-[24px] font-bold text-[#0f172b] mb-0.5">{card.value}</p>
            <p className="text-[11px] text-[#90a1b9]">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Bank Accounts */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Connected Bank Accounts</h3>
          <div className="space-y-3">
            {bankAccounts.map((acc) => (
              <div key={acc.bank} className={`flex items-center justify-between p-4 rounded-xl border ${acc.status === "review" ? "border-[#fde68a] bg-[#fffbeb]/50" : "border-[#e2e8f0] bg-[#f8fafc]"}`}>
                <div className="flex items-center gap-3">
                  <div className={`size-9 rounded-xl flex items-center justify-center ${acc.status === "active" ? "bg-[#d1fae5]" : "bg-[#fef3c7]"}`}>
                    <CreditCard className={`size-4 ${acc.status === "active" ? "text-[#10b981]" : "text-[#f59e0b]"}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-[#0f172b]">{acc.bank}</p>
                    <p className="text-[12px] text-[#90a1b9] font-mono">{acc.account}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[15px] text-[#0f172b]">{acc.balance}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    {acc.status === "active" ? (
                      <><CheckCircle className="size-3 text-[#10b981]" strokeWidth={2} /><span className="text-[11px] text-[#10b981] font-bold">Active</span></>
                    ) : (
                      <><AlertTriangle className="size-3 text-[#f59e0b]" strokeWidth={2} /><span className="text-[11px] text-[#f59e0b] font-bold">Under Review</span></>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Chart */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">Daily Cash Flow – March (Last 7 Days)</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="debitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#90a1b9" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v) => [`$${v}K`, ""]} />
                <Area type="monotone" dataKey="credit" stroke="#10b981" strokeWidth={2} fill="url(#creditGrad)" name="Credit" />
                <Area type="monotone" dataKey="debit" stroke="#ef4444" strokeWidth={2} fill="url(#debitGrad)" name="Debit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-[#0f172b] text-[16px] mb-5">ERP & Accounting Integrations</h3>
        <div className="grid grid-cols-4 gap-4">
          {integrations.map((integration) => (
            <div key={integration.name} className={`border-2 rounded-xl p-4 ${integration.status === "connected" ? "border-[#10b981]/30 bg-[#ecfdf5]/30" : "border-[#e2e8f0] bg-[#f8fafc]"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`size-8 rounded-lg flex items-center justify-center ${integration.status === "connected" ? "bg-[#10b981]" : "bg-[#e2e8f0]"}`}>
                  <Link2 className="size-4 text-white" strokeWidth={2} />
                </div>
                {integration.status === "connected" && (
                  <CheckCircle className="size-4 text-[#10b981]" strokeWidth={2} />
                )}
              </div>
              <p className="font-bold text-[14px] text-[#0f172b] mb-0.5">{integration.name}</p>
              <p className="text-[12px] text-[#90a1b9]">{integration.type}</p>
              <p className="text-[11px] mt-2 font-bold" style={{ color: integration.status === "connected" ? "#10b981" : "#94a3b8" }}>
                {integration.status === "connected" ? `Last sync: ${integration.lastSync}` : "Not connected"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
