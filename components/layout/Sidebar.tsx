"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Clock,
  RefreshCw,
  Shield,
  Sparkles,
  CreditCard,
  Settings,
  CheckCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "amber" | "red";
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Employees", href: "/employees", icon: Users },
  { label: "Salary Management", href: "/salary", icon: DollarSign },
  { label: "Attendance Sync", href: "/attendance", icon: Clock },
  { label: "Payroll Run", href: "/payroll-run", icon: RefreshCw },
  { label: "Compliance", href: "/compliance", icon: Shield, badge: "2", badgeVariant: "amber" },
  { label: "AI & Audit", href: "/ai-audit", icon: Sparkles, badge: "!", badgeVariant: "red" },
  { label: "Banking & Accounting", href: "/banking", icon: CreditCard },
];

const systemNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavItemComponent({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link href={item.href}>
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? "bg-[#152040] text-white font-bold"
            : "text-[#90a1b9] hover:bg-white/5"
        }`}
      >
        {active && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#10b981] rounded-r-full shadow-[0px_0px_8px_0px_rgba(16,185,129,0.5)]" />
        )}
        <item.icon
          className={`shrink-0 size-5 ${active ? "text-[#10b981]" : ""}`}
          strokeWidth={active ? 2.5 : 1.75}
        />
        <span className="text-[14px] leading-5 flex-1">{item.label}</span>
        {item.badge && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
              item.badgeVariant === "red"
                ? "bg-red-500 text-white"
                : "bg-amber-400 text-amber-900"
            }`}
          >
            {item.badge}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[250px] bg-[#0f1729] z-50 flex flex-col overflow-hidden">
      {/* Logo Area */}
      <div className="h-16 flex items-center pl-6 border-b border-white/5 shrink-0">
        <Link href="/">
          <Image src="/hryantra_logo_bg.png" alt="HR Yantra Logo" width={142} height={35} className="h-[35px] w-auto object-contain" priority />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {/* Main Menu */}
        <p className="text-[10px] font-bold text-[rgba(98,116,142,0.6)] tracking-widest uppercase px-3 mb-3">
          Main Menu
        </p>
        {mainNavItems.map((item) => (
          <NavItemComponent key={item.href} item={item} active={isActive(item.href)} />
        ))}

        {/* System */}
        <div className="pt-4">
          <p className="text-[10px] font-bold text-[rgba(98,116,142,0.6)] tracking-widest uppercase px-3 mb-3">
            System
          </p>
          {systemNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </div>
      </nav>

      {/* Footer Card */}
      <div className="p-4 shrink-0">
        <div className="bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#10b981] rounded-full p-1.5 shrink-0">
              <CheckCircle className="size-3 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white tracking-[0.5px] uppercase">
                EU-GDPR Compliant
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">ISO 27001 Certified</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
