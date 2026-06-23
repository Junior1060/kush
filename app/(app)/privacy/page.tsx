"use client";

import { useEffect, useState } from "react";
import { SubPageHeader } from "@/components/SubPageHeader";

const KEY = "kush.privacy";

type Settings = {
  showOnKush: boolean;
  showOnlineStatus: boolean;
  showDistance: boolean;
  readReceipts: boolean;
};

const DEFAULTS: Settings = {
  showOnKush: true,
  showOnlineStatus: true,
  showDistance: true,
  readReceipts: true,
};

const ROWS: { key: keyof Settings; label: string; hint: string }[] = [
  { key: "showOnKush", label: "Show me on Kush", hint: "Turn off to hide your profile from the deck." },
  { key: "showOnlineStatus", label: "Show online status", hint: "Let matches see when you're active." },
  { key: "showDistance", label: "Show my distance", hint: "Display how far away you are." },
  { key: "readReceipts", label: "Read receipts", hint: "Let matches see when you've read a message." },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className="relative h-[28px] w-[48px] flex-none rounded-full transition-colors duration-150"
      style={{ background: on ? "#2E7D54" : "#D8CFC1" }}
    >
      <span
        className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-all duration-150"
        style={{ left: on ? "23px" : "3px" }}
      />
    </button>
  );
}

export default function PrivacyPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(key: keyof Settings) {
    setSettings((s) => {
      const next = { ...s, [key]: !s[key] };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className="flex h-full w-full flex-col">
      <SubPageHeader title="Privacy & safety" />
      <div className="kush-scroll flex-1 overflow-y-auto px-[22px] pb-[24px]">
        <p className="m-0 mb-5 text-[14px] text-muted">
          Control what others can see. Changes save automatically.
        </p>

        <div className="overflow-hidden rounded-[20px] border border-[rgba(27,23,20,0.06)] bg-surface">
          {ROWS.map((row) => (
            <div
              key={row.key}
              className="flex items-center gap-3 border-b border-[rgba(27,23,20,0.06)] px-[18px] py-[15px] last:border-b-0"
            >
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-ink">{row.label}</div>
                <div className="mt-[2px] text-[12.5px] leading-[1.4] text-muted">
                  {row.hint}
                </div>
              </div>
              <Toggle on={settings[row.key]} onClick={() => toggle(row.key)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
