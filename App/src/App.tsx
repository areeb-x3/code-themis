import { useState } from "react";

import Background from "./components/Background.tsx";
import Navbar from "./components/NavBar.tsx";
import Sidebar from "./components/SideBar.tsx";
import Panel from "./components/Panel.tsx";

import "/src/styles/App.css";

function App() {
  const [showSidebar, setSidebar] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-x-hidden">
      <Sidebar isOpen={showSidebar} onClose={() => setSidebar(false)} />

      <Navbar onOpen={() => setSidebar(true)} />
      <Background />
      <div className="flex-col h-screen grid grid-cols-3 p-6 gap-4 ">
        <Panel
          className="col-span-2"
          title="Structure Inspector"
          content={
            <div>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse,
              eum quaerat, vitae itaque vel rem, assumenda quibusdam aut magnam
              necessitatibus numquam consequatur dolores magni facere quia sed
              deleniti velit? Placeat?
            </div>
          }
        />
        <Panel
          className="grow"
          title="Code"
          content={
            <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores
            amet nihil repellat harum nisi quasi eligendi consequuntur
            dignissimos totam. Facere rerum atque fugiat molestiae culpa saepe
            quis eos omnis est?
          </div>
          }
        />
      </div>
    </div>
  );
}

export default App;
