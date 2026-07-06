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
}

function Panel({ className = "", tabs }: PanelProps) {
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || "");
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className={`panel tab-bar flex flex-col overflow-hidden ${className}`}>
      {/* Tab Bar */}
      <div className="panel-tabs flex text-sm ">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-4 py-2 font-medium transition-colors duration-150 outline-none
                ${isActive ? "bg-zinc-900 text-white" : "hover:bg-zinc-750 hover:text-zinc-200" }`}
            >
              {tab.title}
            </button>
          );
        })}
      </div>
      {/* Active Tab Content */}
      <div className="flex-1 text-zinc-300 overflow-y-auto">
        {activeTab ? activeTab.content : <div className="text-zinc-500">Eror 404: No content</div>}
      </div>
    </div>
  );
}

export default Panel;
