import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface ProblemEntry {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const PROBLEMS: ProblemEntry[] = [
  { id: 1, title: "Two Sum", difficulty: "Easy" },
  { id: 2, title: "Placeholder", difficulty: "Medium" },
  { id: 3, title: "Placeholder", difficulty: "Medium" },
  { id: 4, title: "Placeholder", difficulty: "Hard" },
  { id: 5, title: "Placeholder", difficulty: "Easy" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeProblemId?: number;
  onSelectProblem?: (id: number) => void;
}

function Sidebar({
  isOpen,
  onClose,
  activeProblemId = 1,
  onSelectProblem,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "All" | "Easy" | "Medium" | "Hard"
  >("All");
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter((problem) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        problem.title.toLowerCase().includes(q) ||
        String(problem.id).includes(q);
      const matchesDiff =
        selectedDifficulty === "All" ||
        problem.difficulty === selectedDifficulty;
      return matchesSearch && matchesDiff;
    });
  }, [searchQuery, selectedDifficulty]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-96 sm:w-[400px] bg-neutral-900 border-r 
                    border-neutral-800 flex flex-col shrink-0 transition-transform
                    duration-300 z-40 transform-gpu overflow-hidden ${
                      isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
      >
        {/* Header */}
        <div className="h-16 border-b border-neutral-800 px-4 flex items-center justify-between shrink-0 bg-neutral-900">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="sidebar-button border border-neutral-700 hover:border-neutral-500 hover:text-white p-1.5 rounded-md text-neutral-400 transition cursor-pointer flex items-center justify-center w-8 h-8"
              title="Close Sidebar"
            >
              <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
            </button>
            <h1 className="font-bold text-xl text-white tracking-tight">
              Themis
            </h1>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-neutral-800 flex flex-col gap-2 shrink-0 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 flex items-center bg-neutral-800 rounded-lg px-2.5 py-1.5 border border-neutral-700/60 focus-within:border-neutral-500 transition">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="bg-transparent border-0 text-xs text-neutral-200 placeholder-neutral-500 outline-none w-full font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-neutral-400 hover:text-white text-xs ml-1 cursor-pointer p-0.5"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilterOptions(!showFilterOptions)}
              className={`flex items-center justify-center h-8 w-8 rounded-lg border transition cursor-pointer shrink-0 ${
                selectedDifficulty !== "All" || showFilterOptions
                  ? "bg-neutral-800 border-neutral-500 text-white shadow-sm"
                  : "bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:text-white hover:border-neutral-500"
              }`}
              title="Filter questions"
            >
              <FontAwesomeIcon icon={faSliders} className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filter Options Pills */}
          {showFilterOptions && (
            <div className="flex items-center gap-1.5 pt-1">
              {(["All", "Easy", "Med.", "Hard"] as const).map((diff) => {
                const isDiffActive =
                  selectedDifficulty === diff ||
                  (diff === "Med." && selectedDifficulty === "Medium");
                let activeClass = "bg-neutral-700 text-white";

                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() =>
                      setSelectedDifficulty(diff === "Med." ? "Medium" : diff)
                    }
                    className={`flex-1 py-1 rounded-md text-[11px] font-medium transition cursor-pointer text-center ${
                      isDiffActive
                        ? activeClass
                        : "bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80"
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-y-auto min-h-0 p-2 flex flex-col gap-1">
          {filteredProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-neutral-500 gap-2">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-xl text-neutral-600"
              />
              <p className="text-xs font-mono text-center">No questions found</p>
            </div>
          ) : (
            filteredProblems.map((problem, index) => {
              const isSelected = problem.id === activeProblemId;
              const isElevated = index % 2 === 1;
              let diffClass = "text-emerald-400";
              if (problem.difficulty === "Medium") diffClass = "text-amber-400";
              if (problem.difficulty === "Hard") diffClass = "text-rose-400";

              return (
                <div
                  key={problem.id}
                  onClick={() => {
                    onSelectProblem?.(problem.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors select-none ${
                    isElevated
                      ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700/60 hover:text-white"
                      : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
                  } ${
                    isSelected
                      ? "border border-neutral-700/60 font-medium shadow-sm"
                      : "border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-3">
                    <span className="font-mono text-xs text-neutral-500 w-6 shrink-0">
                      {problem.id}.
                    </span>
                    <span className="text-xs font-medium truncate">
                      {problem.title}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 ml-1" />
                    )}
                  </div>
                  <span className={`text-xs font-medium shrink-0 ${diffClass}`}>
                    {problem.difficulty === "Medium"
                      ? "Med."
                      : problem.difficulty}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
