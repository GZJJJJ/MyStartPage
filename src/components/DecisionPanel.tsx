"use client";

import { Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import { Panel } from "@/components/Panel";
import { inputClass, primaryButtonClass } from "@/lib/design";

type DecisionPanelProps = {
  options: string;
  onChange: (options: string) => void;
  className?: string;
};

const decisionTextareaClass = [
  inputClass,
  "min-h-44 resize-none text-sm leading-6 backdrop-blur-xl",
].join(" ");

export function DecisionPanel({ options, onChange, className = "" }: DecisionPanelProps) {
  const [result, setResult] = useState("");
  const parsedOptions = useMemo(
    () =>
      options
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [options],
  );

  function decide() {
    if (parsedOptions.length === 0) {
      setResult("");
      return;
    }

    const index = Math.floor(Math.random() * parsedOptions.length);
    setResult(parsedOptions[index]);
  }

  return (
    <Panel title="决定器" subtitle={`${parsedOptions.length} 个选项`} icon={Shuffle} className={className}>
      <div className="grid gap-4 md:grid-cols-[1fr_13rem]">
        <textarea
          value={options}
          onChange={(event) => onChange(event.target.value)}
          placeholder={"每行一个选项\n例如：写作业\n看文档\n休息十分钟"}
          aria-label="随机决定选项"
          className={decisionTextareaClass}
        />
        <div className="flex flex-col gap-4 rounded-[24px] border border-white/32 bg-white/[0.18] p-4 dark:border-white/10 dark:bg-slate-950/[0.18]">
          <button type="button" onClick={decide} className={primaryButtonClass}>
            <Shuffle size={17} />
            抽一个
          </button>
          <div className="flex min-h-24 items-center justify-center rounded-[20px] bg-white/[0.24] px-4 text-center text-base font-medium text-[#344046] dark:bg-slate-950/[0.24] dark:text-slate-100">
            {result || "等待结果"}
          </div>
        </div>
      </div>
    </Panel>
  );
}
