import { useState } from "react";

import Navbar from "./components/Navbar.tsx";
import Sidebar from "./components/SideBar.tsx";
import Background from "./components/Background.tsx";
import "./App.css";

function App() {
  const [showSidebar, setSidebar] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {showSidebar && <Sidebar onClose={() => setSidebar(false)} />}
      <Navbar onOpen={() => setSidebar(true)} />
      <Background />
      Hello World
      <p>{ showSidebar }</p>
    </div>
  );
}

export default App;
