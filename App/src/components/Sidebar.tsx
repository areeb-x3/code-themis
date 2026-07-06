import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

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

export default Sidebar;
