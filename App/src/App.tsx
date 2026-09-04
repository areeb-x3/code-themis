import React, { useState, useRef, useEffect } from "react";

import Background from "./components/Background.tsx";
import Navbar from "./components/Navbar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Panel from "./components/Panel.tsx";

import "/src/styles/App.css";
import { useTwoSum } from "./questions/TwoSumState.ts";
import {
  StructureInspector,
  TraceExecution,
  TestCaseTab,
} from "./questions/TwoSum.tsx";

function App() {
  const [showSidebar, setSidebar] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<string>("code");
  const [splitRatio, setSplitRatio] = useState<number>(60);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const twoSumState = useTwoSum();

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const totalWidth = rect.width;
      if (totalWidth <= 0) return;

      const newPercent = (currentX / totalWidth) * 100;
      const minPercent = Math.max(15, (220 / totalWidth) * 100);
      const maxPercent = Math.min(85, 100 - (220 / totalWidth) * 100);
      const clampedPercent = Math.min(Math.max(newPercent, minPercent), maxPercent);
      setSplitRatio(clampedPercent);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.touches[0].clientX - rect.left;
      const totalWidth = rect.width;
      if (totalWidth <= 0) return;

      const newPercent = (currentX / totalWidth) * 100;
      const minPercent = Math.max(15, (220 / totalWidth) * 100);
      const maxPercent = Math.min(85, 100 - (220 / totalWidth) * 100);
      const clampedPercent = Math.min(Math.max(newPercent, minPercent), maxPercent);
      setSplitRatio(clampedPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const panelOneTabList = [
    {
      id: "inspector",
      title: "Structure Inspector",
      content: (
        <StructureInspector
          state={twoSumState}
          onPlay={() => setRightPanelTab("code")}
        />
      ),
    },
  ];

  const panelTwoTabList = [
    {
      id: "code",
      title: "Code",
      content: <TraceExecution state={twoSumState} />,
    },
    {
      id: "testcase",
      title: "Test Case",
      content: <TestCaseTab state={twoSumState} />,
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Sidebar isOpen={showSidebar} onClose={() => setSidebar(false)} />
      <Navbar onOpen={() => setSidebar(true)} title="Two Sum - LeetCode #1" />
      <Background />

      <div
        ref={containerRef}
        className="flex-1 flex min-h-0 p-6 overflow-hidden relative"
      >
        {/* Left: Structure Inspector Panel */}
        <div
          className="h-full flex flex-col min-w-0"
          style={{ width: `calc(${splitRatio}% - 6px)` }}
        >
          <Panel className="h-full w-full" tabs={panelOneTabList} />
        </div>

        {/* Resizer Slider Handle */}
        <div
          role="separator"
          aria-orientation="vertical"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="group flex items-center justify-center cursor-col-resize select-none shrink-0 z-20 w-3 -mx-0.5"
          title="Drag to resize panels"
        >
          <div
            className={`w-1 rounded-full transition-all duration-150 ${
              isDragging
                ? "h-16 bg-neutral-400 shadow-md shadow-neutral-400/20"
                : "h-8 bg-neutral-700/80 group-hover:h-12 group-hover:bg-neutral-500"
            }`}
          />
        </div>

        {/* Right: Code + TestCase Panel */}
        <div className="h-full flex flex-col min-w-0 flex-1">
          <Panel
            className="h-full w-full"
            tabs={panelTwoTabList}
            activeTabId={rightPanelTab}
            onTabChange={setRightPanelTab}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
