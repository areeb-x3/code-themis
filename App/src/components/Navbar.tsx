import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar() {
  return (
    <>
      <nav className="text-xl p-4 min-h-[4rem]">
        <div className="flex items-center gap-3">
          <button className="sidebar-button border-2 border-neutral-700 p-1 rounded-md">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className="font-bold">Themis</h1>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
