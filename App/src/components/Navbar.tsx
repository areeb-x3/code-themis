import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

interface NavbarProps {
  onOpen: () => void;
}

function Navbar({ onOpen }: NavbarProps) {
  return (
    <>
      <nav className="text-xl p-4 min-h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpen}
            className="sidebar-button border-2 border-neutral-700 p-1 rounded-md"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className="font-bold">Themis</h1>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
