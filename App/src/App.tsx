import { useState } from "react";

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
  const twoSumState = useTwoSum();

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
    <div className="h-screen flex flex-col overflow-x-hidden">
      <Sidebar isOpen={showSidebar} onClose={() => setSidebar(false)} />
      <Navbar onOpen={() => setSidebar(true)} title="Two Sum - LeetCode #1" />
      <Background />

      <div className="h-full grid grid-cols-3 p-6 gap-4 overflow-hidden">
        <Panel className="col-span-2" tabs={panelOneTabList} />
        <Panel
          className="grow"
          tabs={panelTwoTabList}
          activeTabId={rightPanelTab}
          onTabChange={setRightPanelTab}
        />
      </div>
    </div>
  );
}

export default App;
