import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import Background from "./components/Background.tsx";
import "./App.css";

function App() {
  const [showSidebar, setSidebar] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-x-hidden">
      <Sidebar isOpen={showSidebar} onClose={() => setSidebar(false)} />

      <Navbar onOpen={() => setSidebar(true)} />
      <Background />
      <div className="p-4 text-white"> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores, aliquam consequatur? Ducimus, iusto cum facere veniam unde dicta consequuntur, doloremque voluptas assumenda debitis officia eum nihil veritatis perspiciatis perferendis modi.</div>
    </div>
  );
}

export default App;

// ---------------------------

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transform-gpu z-20 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 w-64 lg:w-80 bg-neutral-900 border-r 
                    border-neutral-700 flex flex-col shrink-0 transition-transform
                    duration-300 z-30 p-4 transform-gpu ${
                      isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
      >
        <div className="text-xl p-2 flex gap-3">
          <button
            onClick={onClose}
            className="sidebar-button border-2 border-neutral-700 p-1 rounded-md"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className="font-bold">Themis</h1>
        </div>
      </aside>
    </>
  );
}

interface NavbarProps {
  onOpen: () => void;
}

function Navbar({ onOpen }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between text-xl p-4 min-h-16">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpen}
          className="sidebar-button border-2 border-neutral-700 p-1 rounded-md"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="font-bold">Themis</h1>
      </div>
      <div className="">Centre Title</div>
      <div>
        <a href="https://github.com/areeb-x3/code-themis">
        <button className="flex gap-3 project-button border-2 border-neutral-700 p-1 rounded-md">
          <FontAwesomeIcon icon={faGithub} />
          Github
        </button>
        </a>
      </div>
    </nav>
  );
}
