import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ onClose }: NavbarProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/5 backdrop-blur-xs z-20" />

      <aside
        className="fixed inset-y-0 left-0 w-64 lg:w-80 bg-neutral-900 border-r 
                            border-neutral-700 flex flex-col shrink-0 transition-all
                            duration-300 z-30 p-4 backdrop-blur-sm"
      >
        <div className="flex gap-3">
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

export default Sidebar;
