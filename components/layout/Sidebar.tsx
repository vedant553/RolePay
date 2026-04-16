"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: "amber" | "red";
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Operations",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Employees", href: "/employees", icon: Users },
      { label: "Attendance Sync", href: "/attendance", icon: Clock },
      { label: "Salary Management", href: "/salary", icon: DollarSign },
      { label: "Payroll Run", href: "/payroll-run", icon: RefreshCw },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Compliance", href: "/compliance", icon: Shield, badge: "3", badgeTone: "amber" },
      { label: "Banking & Accounting", href: "/banking", icon: CreditCard },
      { label: "Reports & Analytics", href: "/reports-analytics", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { label: "AI & Audit", href: "/ai-audit", icon: Sparkles, badge: "1", badgeTone: "red" },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

function NavItemComponent({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
        active
          ? "bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_10px_24px_rgba(15,23,42,0.18)]"
          : "text-[#9aabc2] hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {active && (
        <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#10b981] shadow-[0px_0px_12px_rgba(16,185,129,0.45)]" />
      )}

      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
          active
            ? "border-[#10b981]/25 bg-[#10b981]/10 text-[#10b981]"
            : "border-white/5 bg-white/[0.03] text-[#8fa2bb] group-hover:border-white/10 group-hover:bg-white/[0.06] group-hover:text-white"
        }`}
      >
        <item.icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.9} />
      </div>

      <span
        className={`min-w-0 flex-1 truncate text-[14px] leading-5 ${
          active ? "font-semibold" : "font-medium"
        }`}
      >
        {item.label}
      </span>

      {item.badge && (
        <span
          className={`min-w-[22px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${
            item.badgeTone === "red"
              ? "bg-[#7f1d1d]/60 text-[#fecaca]"
              : "bg-[#78350f]/60 text-[#fde68a]"
          }`}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function NavSectionBlock({
  section,
  isActive,
}: {
  section: NavSection;
  isActive: (href: string) => boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#607089]">
        {section.label}
      </p>
      <div className="space-y-1.5">
        {section.items.map((item) => (
          <NavItemComponent key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 flex w-[264px] flex-col overflow-hidden border-r border-white/5 bg-[#0b1220]">
      <div className="flex h-16 items-center border-b border-white/5 px-5 shrink-0">
        <Link href="/" className="flex min-w-0 items-center">
          <Image
            src="/hryantra_logo_bg.png"
            alt="HR Yantra Logo"
            width={142}
            height={35}
            className="h-[34px] w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          {navSections.map((section) => (
            <NavSectionBlock key={section.label} section={section} isActive={isActive} />
          ))}
        </div>
      </nav>

      <div className="border-t border-white/5 p-4 shrink-0">
        <div className="rounded-xl border border-white/6 bg-white/[0.03] p-3.5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-[#10b981]/10 text-[#10b981]">
              <CheckCircle className="size-4" strokeWidth={2.1} />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white">Secure Workspace</p>
              <p className="mt-1 text-[11px] leading-5 text-[#7f90a8]">
                Audit-ready payroll operations with workflow-first navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
