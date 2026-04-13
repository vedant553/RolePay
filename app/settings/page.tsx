"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Link2, Users, ChevronRight, Save } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SettingsTab = "general" | "notifications" | "security" | "integrations" | "team";

const tabs: { id: SettingsTab; label: string; icon: LucideIcon }[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "team", label: "Team Access", icon: Users },
];

function Toggle({ checked = true }: { checked?: boolean }) {
  return (
    <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-[#10b981]" : "bg-[#e2e8f0]"}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#f1f5f9] last:border-0">
      <div>
        <p className="font-bold text-[14px] text-[#0f172b]">{label}</p>
        {description && <p className="text-[12px] text-[#90a1b9] mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[16px] text-[#0f172b] mb-5">Organization Settings</h2>
        <div className="space-y-4">
          {[{ label: "Organization Name", value: "SAASA Global Payroll Inc." }, { label: "Primary Contact Email", value: "payroll@saasa.io" }, { label: "Payroll Currency (Primary)", value: "USD - United States Dollar" }].map((field) => (
            <div key={field.label}>
              <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">{field.label}</label>
              <input type="text" defaultValue={field.value} className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40" />
            </div>
          ))}
          <div>
            <label className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.5px] block mb-1.5">Payroll Processing Day</label>
            <select className="w-full h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] focus:outline-none focus:border-[#10b981]/40">
              <option>28th of each month</option>
              <option>Last working day</option>
              <option>1st of next month</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[16px] text-[#0f172b] mb-5">AI Engine Configuration</h2>
        <SettingRow label="AI Risk Detection" description="Automatically flag anomalies in payroll data"><Toggle checked={true} /></SettingRow>
        <SettingRow label="Auto-Compliance Filing" description="Let AI handle routine statutory filings"><Toggle checked={true} /></SettingRow>
        <SettingRow label="AI Salary Recommendations" description="Suggest optimal salary structures via market data"><Toggle checked={false} /></SettingRow>
        <SettingRow label="Predictive Fraud Monitoring" description="Continuous learning from payroll patterns"><Toggle checked={true} /></SettingRow>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
      <h2 className="font-bold text-[16px] text-[#0f172b] mb-5">Notification Preferences</h2>
      <div className="space-y-2">
        {[
          { label: "Payroll Cycle Completion", desc: "Notify when payroll processing completes", checked: true },
          { label: "Compliance Filing Due", desc: "Alert 5 days before statutory deadlines", checked: true },
          { label: "AI Risk Alerts", desc: "Immediate notification for high-severity risks", checked: true },
          { label: "Approval Requests", desc: "Notify approvers when their sign-off is needed", checked: true },
          { label: "Disbursement Failures", desc: "Alert on failed bank transfers", checked: true },
          { label: "Weekly Summary Reports", desc: "Auto-generate and email weekly payroll insights", checked: false },
          { label: "New Employee On-boarding", desc: "Notify HR when a new payroll profile is created", checked: false },
        ].map((notif) => (
          <SettingRow key={notif.label} label={notif.label} description={notif.desc}>
            <Toggle checked={notif.checked} />
          </SettingRow>
        ))}
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[16px] text-[#0f172b] mb-5">Security Settings</h2>
        <SettingRow label="Two-Factor Authentication" description="Require 2FA for all payroll actions"><Toggle checked={true} /></SettingRow>
        <SettingRow label="Session Timeout" description="Auto-logout after 30 minutes of inactivity"><Toggle checked={true} /></SettingRow>
        <SettingRow label="IP Allowlist" description="Restrict access to specific IP ranges"><Toggle checked={false} /></SettingRow>
        <SettingRow label="Audit Log" description="Track all user actions in the system"><Toggle checked={true} /></SettingRow>
        <SettingRow label="Data Encryption at Rest" description="AES-256 encryption for all stored data"><Toggle checked={true} /></SettingRow>
      </div>
      <div className="bg-[#ecfdf5] border border-[#10b981]/20 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="size-5 text-[#10b981]" strokeWidth={1.75} />
          <p className="font-bold text-[#065f46] text-[14px]">Security Status: Excellent</p>
        </div>
        <p className="text-[13px] text-[#065f46]/70">Your system is fully secured. EU-GDPR compliant · ISO 27001 certified · SOC 2 Type II</p>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
      <h2 className="font-bold text-[16px] text-[#0f172b] mb-5">Connected Integrations</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "QuickBooks Online", type: "Accounting", status: "connected", color: "bg-[#10b981]" },
          { name: "SAP S/4HANA", type: "ERP", status: "connected", color: "bg-[#3b82f6]" },
          { name: "Xero", type: "Accounting", status: "connected", color: "bg-[#8b5cf6]" },
          { name: "BambooHR", type: "HRIS", status: "connected", color: "bg-[#10b981]" },
          { name: "Workday", type: "HCM", status: "connected", color: "bg-[#3b82f6]" },
          { name: "NetSuite", type: "ERP", status: "pending", color: "bg-[#e2e8f0]" },
          { name: "Salesforce", type: "CRM", status: "pending", color: "bg-[#e2e8f0]" },
          { name: "Slack", type: "Notifications", status: "pending", color: "bg-[#e2e8f0]" },
        ].map((integration) => (
          <div key={integration.name} className={`flex items-center justify-between p-4 rounded-xl border ${integration.status === "connected" ? "border-[#10b981]/30 bg-[#ecfdf5]/30" : "border-[#e2e8f0]"}`}>
            <div className="flex items-center gap-3">
              <div className={`${integration.color} size-8 rounded-lg flex items-center justify-center`}>
                <Link2 className="size-4 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-bold text-[14px] text-[#0f172b]">{integration.name}</p>
                <p className="text-[11px] text-[#90a1b9]">{integration.type}</p>
              </div>
            </div>
            {integration.status === "connected" ? (
              <span className="text-[11px] font-bold text-[#10b981]">Connected</span>
            ) : (
              <button className="text-[11px] font-bold text-[#3b82f6] hover:opacity-80">Connect</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamTab() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-[16px] text-[#0f172b]">Team Members & Roles</h2>
        <button className="bg-[#10b981] text-white font-bold text-[13px] px-4 py-2 rounded-xl hover:bg-[#059669]">+ Invite Member</button>
      </div>
      <div className="space-y-3">
        {[
          { name: "Alex Sterling", email: "alex.sterling@saasa.io", role: "Head of Payroll", access: "Super Admin" },
          { name: "Alice Mercer", email: "alice.mercer@saasa.io", role: "Finance Controller", access: "Finance Lead" },
          { name: "John Patel", email: "john.patel@saasa.io", role: "Regional HR Director", access: "HR Manager" },
          { name: "Diana Reyes", email: "diana.reyes@saasa.io", role: "CFO", access: "Executive Viewer" },
          { name: "Marcus Chen", email: "marcus.chen@saasa.io", role: "Payroll Analyst", access: "Payroll Operator" },
        ].map((member) => (
          <div key={member.email} className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center">
                <span className="text-white font-bold text-[11px]">{member.name.split(" ").map((n) => n[0]).join("")}</span>
              </div>
              <div>
                <p className="font-bold text-[14px] text-[#0f172b]">{member.name}</p>
                <p className="text-[12px] text-[#90a1b9]">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-[#62748e]">{member.role}</span>
              <span className="bg-[#dbeafe] text-[#1e40af] text-[11px] font-bold px-2.5 py-1 rounded-lg">{member.access}</span>
              <ChevronRight className="size-4 text-[#90a1b9]" strokeWidth={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172b] mb-2">Settings</h1>
          <p className="text-[14px] text-[#62748e]">Configure your payroll system, integrations, and team access</p>
        </div>
        <button className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[14px] px-5 py-2.5 rounded-xl shadow-sm transition-colors">
          <Save className="size-4" strokeWidth={2} /> Save Changes
        </button>
      </div>

      <div className="flex gap-6">
        {/* Tab Sidebar */}
        <div className="w-[200px] shrink-0">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-3 shadow-sm">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-1 ${
                  activeTab === tab.id
                    ? "bg-[#10b981] text-white"
                    : "text-[#62748e] hover:bg-[#f8fafc]"
                }`}>
                <tab.icon className="size-4 shrink-0" strokeWidth={activeTab === tab.id ? 2.5 : 1.75} />
                <span className="text-[13px] font-bold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "general" && <GeneralTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "team" && <TeamTab />}
        </div>
      </div>
    </div>
  );
}
