"use client";

import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ContentStage } from "@/components/layout/ContentStage";
import { TopStatusBar } from "@/components/layout/TopStatusBar";
import {
  createDefaultData,
  loadDashboardData,
  saveDashboardData,
  THEME_KEY,
} from "@/lib/storage";
import { useCloudSync } from "@/lib/useCloudSync";
import type { SectionId } from "@/lib/sections";
import type { DashboardData } from "@/lib/types";

function getStoredDarkMode(): boolean {
  const storedTheme = window.localStorage.getItem(THEME_KEY);

  if (storedTheme) {
    return storedTheme === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData>(() => createDefaultData());
  const [dataReady, setDataReady] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const dataReadyRef = useRef(false);
  const themeReadyRef = useRef(false);
  const cloudSync = useCloudSync(data, setData, dataReady);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dataReadyRef.current = true;
      themeReadyRef.current = true;

      setData(loadDashboardData());
      setDarkMode(getStoredDarkMode());
      setDataReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (dataReadyRef.current) {
      saveDashboardData(data);
    }
  }, [data]);

  useEffect(() => {
    if (themeReadyRef.current) {
      document.documentElement.classList.toggle("dark", darkMode);
      window.localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  function toggleDarkMode() {
    themeReadyRef.current = true;
    setDarkMode((current) => !current);
  }

  return (
    <AppShell
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      topBar={
        <TopStatusBar
          activeSection={activeSection}
          darkMode={darkMode}
          engine={data.searchEngine}
          onEngineChange={(searchEngine) => setData((current) => ({ ...current, searchEngine }))}
          onToggleDarkMode={toggleDarkMode}
        />
      }
    >
      <ContentStage
        activeSection={activeSection}
        data={data}
        cloudSync={cloudSync}
        onSectionChange={setActiveSection}
        onShortcutsChange={(shortcuts) => setData((current) => ({ ...current, shortcuts }))}
        onTasksChange={(tasks) => setData((current) => ({ ...current, tasks }))}
        onDeadlinesChange={(deadlines) => setData((current) => ({ ...current, deadlines }))}
        onDecisionChange={(decisionOptions) => setData((current) => ({ ...current, decisionOptions }))}
        onImport={(importedData) => setData(importedData)}
      />
    </AppShell>
  );
}
