"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import type { SectionId } from "@/lib/sections";

type AppShellProps = {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  topBar: ReactNode;
  children: ReactNode;
};

export function AppShell({ activeSection, onSectionChange, topBar, children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      <div className="main-shell min-h-screen pb-24 transition-all sm:pl-16 sm:pb-0">
        {topBar}
        {children}
      </div>
    </div>
  );
}
