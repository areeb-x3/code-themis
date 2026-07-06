import { useState } from "react";

import Background from "./components/Background.tsx";
import Navbar from "./components/NavBar.tsx";
import Sidebar from "./components/SideBar.tsx";
import Panel from "./components/Panel.tsx";

import "/src/styles/App.css";

function App() {
  const [showSidebar, setSidebar] = useState(false);

  const panelOneTabList = [
    {
      id: "inspector",
      title: "Structure Inspector",
      content: (
        <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</div>
      ),
    }
  ];

  const panelTwoTabList = [
    {
      id: "code",
      title: "Code",
      content: <div>Sexy Code here</div>,
    },
    {
      id: "testcase",
      title: "Test Case",
      content: <div>Test Cases</div>,
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-x-hidden">
      <Sidebar isOpen={showSidebar} onClose={() => setSidebar(false)} />
      <Navbar onOpen={() => setSidebar(true)} />
      <Background />

      <div className="flex-col h-screen grid grid-cols-3 p-6 gap-4 ">
        <Panel className="col-span-2" tabs={panelOneTabList} />
        <Panel className="grow" tabs={panelTwoTabList} />
      </div>
    </div>
  );
}

export default App;
