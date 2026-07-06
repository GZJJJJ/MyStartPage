"use client";

import type { ReactNode } from "react";
import { AppBackground } from "@/components/layout/AppBackground";
import { Sidebar } from "@/components/layout/Sidebar";
import type { SectionId } from "@/lib/sections";

type AppShellProps = {
  activeSection: SectionId;
  darkMode: boolean;
  onSectionChange: (section: SectionId) => void;
  topBar: ReactNode;
  children: ReactNode;
};

export function AppShell({ activeSection, darkMode, onSectionChange, topBar, children }: AppShellProps) {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <AppBackground isDark={darkMode} />
      <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      <div className="main-shell min-h-screen pb-24 transition-all sm:pl-16 sm:pb-0">
        {topBar}
        {children}
      </div>
    </div>
  );
}