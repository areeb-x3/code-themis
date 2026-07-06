import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

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
        <a
          target="_blank"
          href="https://github.com/areeb-x3/code-themis"
          rel="noopener noreferrer"
        >
          <button className="flex gap-3 project-button border-2 border-neutral-700 p-1 rounded-md">
            <FontAwesomeIcon icon={faGithub} />
            Github
          </button>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;