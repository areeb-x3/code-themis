import React from "react";
import { useState } from "react";

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}
interface PanelProps {
  className?: string;
  tabs: Tab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
}

function Panel({
  className = "",
  tabs,
  activeTabId: controlledTabId,
  onTabChange,
}: PanelProps) {
  const [internalTabId, setInternalTabId] = useState<string>(tabs[0]?.id || "");
  const activeTabId = controlledTabId !== undefined ? controlledTabId : internalTabId;
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const handleTabClick = (tabId: string) => {
    if (controlledTabId === undefined) {
      setInternalTabId(tabId);
    }
    onTabChange?.(tabId);
  };

  return (
    <div className={`panel tab-bar flex flex-col overflow-hidden ${className}`}>
      {/* Tab Bar */}
      <div className="panel-tabs flex items-center p-1 gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-3.5 py-1.5 font-medium outline-none cursor-pointer bg-transparent ${
                isActive
                  ? "text-white text-sm font-semibold"
                  : "hover:text-zinc-200 text-xs text-neutral-400"
              }`}
              style={{ borderRadius: "5px" }}
            >
              {tab.title}
            </button>
          );
        })}
      </div>
      {/* Active Tab Content */}
      <div className="flex-1 text-zinc-300 overflow-y-auto flex flex-col">
        {activeTab ? activeTab.content : <div className="text-zinc-500">Eror 404: No content</div>}
      </div>
    </div>
  );
}

export default Panel;
