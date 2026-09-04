import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faBackwardStep,
  faForwardStep,
  faRotateLeft,
  faCheck,
  faPlus,
  faXmark,
  faTable,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import {
  useTwoSum,
  CODE_SNIPPET,
  type TwoSumState,
} from "./TwoSumState.ts";

const elementBoxRadius = {
  borderBottomLeftRadius: "0.5rem",
  borderTopRightRadius: "0.5rem",
  borderTopLeftRadius: "0px",
  borderBottomRightRadius: "0px",
};

interface StructureInspectorProps {
  state: TwoSumState;
  onPlay?: () => void;
}

export function StructureInspector({ state, onPlay }: StructureInspectorProps) {
  const {
    nums,
    step,
    trace,
    currentTrace,
    isPlaying,
    speed,
    setSpeed,
    handleForward,
    handleBackward,
    handleReset,
    handlePlayToggle,
  } = state;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Controls Bar - opaque, no padding, no border/bg on buttons or dropdown */}
      <div className="flex items-center justify-between p-0 px-2 h-9 border-b border-neutral-800 bg-neutral-900 shrink-0">
        {/* Buttons in order: (Previous, Play, Next, Reset), no border/bg, 5px radius */}
        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            onClick={handleBackward}
            disabled={step === 0}
            className="bg-transparent border-0 disabled:opacity-25 h-6 w-7 flex items-center justify-center text-neutral-400 hover:text-white transition duration-150 cursor-pointer text-xs"
            style={{ borderRadius: "5px" }}
            title="Previous Step"
          >
            <FontAwesomeIcon icon={faBackwardStep} className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => {
              onPlay?.();
              handlePlayToggle();
            }}
            className={`bg-transparent border-0 h-6 w-7 flex items-center justify-center transition duration-150 cursor-pointer text-xs ${
              isPlaying
                ? "text-amber-400 hover:text-amber-300"
                : "text-neutral-300 hover:text-white"
            }`}
            style={{ borderRadius: "5px" }}
            title={isPlaying ? "Pause" : "Play"}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="w-3.5 h-3.5" />
          </button>

          {/* Next */}
          <button
            onClick={handleForward}
            disabled={step === trace.length - 1}
            className="bg-transparent border-0 disabled:opacity-25 h-6 w-7 flex items-center justify-center text-neutral-400 hover:text-white transition duration-150 cursor-pointer text-xs"
            style={{ borderRadius: "5px" }}
            title="Next Step"
          >
            <FontAwesomeIcon icon={faForwardStep} className="w-3.5 h-3.5" />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="bg-transparent border-0 h-6 w-7 flex items-center justify-center text-neutral-400 hover:text-white transition duration-150 cursor-pointer text-xs"
            style={{ borderRadius: "5px" }}
            title="Reset"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed dropdown menu - no border, no bg, text for speed */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-neutral-400 font-medium">Speed:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-transparent border-0 text-neutral-200 text-xs px-1 h-6 outline-none cursor-pointer"
            style={{ borderRadius: "5px" }}
          >
            <option value={500} className="bg-neutral-900 text-neutral-200">0.5</option>
            <option value={750} className="bg-neutral-900 text-neutral-200">0.75</option>
            <option value={1000} className="bg-neutral-900 text-neutral-200">1.0</option>
            <option value={1500} className="bg-neutral-900 text-neutral-200">1.5</option>
            <option value={1750} className="bg-neutral-900 text-neutral-200">1.75</option>
            <option value={2000} className="bg-neutral-900 text-neutral-200">2.0</option>
          </select>
        </div>
      </div>

      {/* Visualising Space: Left ARRAY, Right HASH MAP */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 p-4 gap-4 overflow-hidden">
        {/* LEFT: ARRAY */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-2 shrink-0 self-start">
            <FontAwesomeIcon icon={faHashtag} className="w-3.5 h-3.5 text-neutral-400" />
            <h3 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">
              ARRAY
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              Length: {nums.length}
            </span>
          </div>

          <div className="flex-1 flex flex-wrap gap-3 items-center justify-center content-center overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nums.map((num, index) => {
              const isCurrent =
                currentTrace.currentIndex === index &&
                currentTrace.type !== "end";
              const isSolution =
                currentTrace.solution &&
                currentTrace.solution.includes(index);
              const isVisited =
                currentTrace.currentIndex > index ||
                (currentTrace.currentIndex === index &&
                  (currentTrace.type === "add" || currentTrace.type === "found"));

              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Fixed box size, constant border-2, NO scale transforms */}
                  <div
                    className={`w-14 h-14 flex items-center justify-center font-bold text-lg border-2 transition-colors duration-200 font-mono relative ${
                      isSolution
                        ? "bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/10"
                        : isCurrent
                          ? "bg-amber-950/40 border-amber-400 text-amber-200 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/10"
                          : isVisited
                            ? "bg-neutral-900 border-neutral-700 text-neutral-300 opacity-90"
                            : "bg-neutral-950 border-neutral-800 text-neutral-500"
                    }`}
                    style={elementBoxRadius}
                  >
                    {num}
                    {isSolution && (
                      <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-neutral-950 rounded-full w-4 h-4 flex items-center justify-center text-[9px] border border-neutral-950 shadow-md">
                        <FontAwesomeIcon icon={faCheck} className="stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Fixed-height label slot so element blocks stay at the exact same place */}
                  <div className="mt-1.5 h-10 flex flex-col items-center justify-start">
                    <span className="text-[10px] text-neutral-500 font-mono leading-tight">
                      i = {index}
                    </span>
                    {/* Match pointer */}
                    {isSolution && (
                      <span className="text-[10px] text-emerald-400 font-semibold leading-tight">
                        Match
                      </span>
                    )}
                    {/* Current pointer: below match */}
                    {isCurrent && (
                      <span className="text-[10px] text-amber-400 font-semibold leading-tight">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: HASH MAP (No slider/scrollbar bug) */}
        <div className="flex flex-col h-full overflow-hidden border-t md:border-t-0 md:border-l border-neutral-800/60 pt-4 md:pt-0 md:pl-4">
          <div className="flex items-center gap-2 mb-2 shrink-0 self-start">
            <FontAwesomeIcon icon={faTable} className="w-3.5 h-3.5 text-neutral-400" />
            <h3 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">
              HASH MAP
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              Entries: {Object.keys(currentTrace.hashMap).length}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Object.keys(currentTrace.hashMap).length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-neutral-500 gap-2">
                <FontAwesomeIcon icon={faTable} className="text-xl text-neutral-600" />
                <p className="text-xs text-neutral-500 font-mono">HashMap is empty</p>
              </div>
            ) : (
              <div className="w-full max-w-xs flex flex-col gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* Table Headers */}
                <div className="grid grid-cols-2 text-[11px] font-mono text-neutral-400 uppercase tracking-wider px-3">
                  <span className="text-center font-medium">Key</span>
                  <span className="text-center font-medium">Value</span>
                </div>

                {/* Combined single table box per entry with same border radius styling */}
                <div className="flex flex-col gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {Object.entries(currentTrace.hashMap).map(([key, val]) => {
                    const isComplementHighlight =
                      currentTrace.complement !== null &&
                      currentTrace.complement === Number(key);

                    return (
                      <div
                        key={key}
                        className={`grid grid-cols-2 text-center text-sm font-mono font-bold border transition-all ${
                          isComplementHighlight
                            ? "bg-emerald-950/40 border-2 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30 scale-[1.02] shadow-sm"
                            : "bg-neutral-900 border border-neutral-700 text-neutral-100"
                        }`}
                        style={elementBoxRadius}
                      >
                        <div className="py-2 px-3 border-r border-neutral-700/60">
                          {key}
                        </div>
                        <div
                          className={`py-2 px-3 ${
                            isComplementHighlight ? "text-emerald-300" : "text-neutral-300"
                          }`}
                        >
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Opaque, step explanation mirroring top bar */}
      <div className="flex items-center border-t border-neutral-800 bg-neutral-900 shrink-0 h-9 p-0 px-2 gap-2">
        {/* Step [X/Y] box sticking to the left */}
        <div
          className="h-6 px-2 flex items-center justify-center text-xs font-mono font-semibold bg-neutral-800 text-neutral-200 shrink-0"
          style={{ borderRadius: "5px" }}
        >
          Step [{step + 1}/{trace.length}]
        </div>

        {/* Step description taking all the right side */}
        <div
          className="flex-1 text-xs text-neutral-300 truncate"
          title={currentTrace.action}
        >
          {currentTrace.action}
        </div>
      </div>
    </div>
  );
}

export function TraceExecution({ state }: { state: TwoSumState }) {
  const { currentTrace } = state;

  return (
    <div className="flex-1 h-full w-full flex flex-col bg-neutral-900 overflow-hidden font-jetbrains">
      {/* Top Bar (Same as Structure Inspector top bar) */}
      <div className="flex items-center px-3 h-9 border-b border-neutral-800 bg-neutral-900 shrink-0">
        <span className="text-xs text-neutral-300 font-jetbrains select-none">
          Solution.java
        </span>
      </div>

      {/* Code Editor Container */}
      <div className="flex-1 min-h-0 overflow-auto relative py-3 px-0 flex flex-col leading-relaxed">
        {/* Full-height vertical dividing line that goes to the bottom of the tab */}
        <div className="absolute top-0 bottom-0 left-12 w-px bg-neutral-800 pointer-events-none" />

        {CODE_SNIPPET.map((code) => {
          const isActive = currentTrace.activeLine === code.line;
          return (
            <div
              key={code.line}
              className={`w-full py-0.5 flex items-center transition-colors duration-75 relative z-10 ${
                isActive ? "bg-neutral-800/90" : "hover:bg-neutral-800/30"
              }`}
            >
              {/* Centered Line Number with matching right border */}
              <div
                className={`w-12 shrink-0 text-center select-none text-[11px] font-normal border-r border-neutral-800 ${
                  isActive ? "text-[#f8f8f2]" : "text-neutral-500"
                }`}
              >
                {code.line}
              </div>

              {/* Code Tokens (Monokai Theme, no bold) */}
              <div
                className="flex-1 whitespace-pre pl-4 pr-4 font-normal text-xs"
                style={{ paddingLeft: `${16 + code.indent * 16}px` }}
              >
                {code.tokens.map((token, tIdx) => {
                  let tokenColor = "text-[#f8f8f2]";
                  if (token.type === "keyword" || token.type === "operator") {
                    tokenColor = "text-[#f92672]";
                  } else if (token.type === "type") {
                    tokenColor = "text-[#66d9ef]";
                  } else if (token.type === "method") {
                    tokenColor = "text-[#a6e22e]";
                  } else if (token.type === "variable") {
                    tokenColor = "text-[#fd971f]";
                  } else if (token.type === "number") {
                    tokenColor = "text-[#ae81ff]";
                  }
                  return (
                    <span key={tIdx} className={`${tokenColor} font-normal`}>
                      {token.text}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TestCaseTab({ state }: { state: TwoSumState }) {
  const {
    testCases,
    activeCaseIndex,
    selectCase,
    addCase,
    removeCase,
    updateActiveCaseNums,
    updateActiveCaseTarget,
  } = state;

  const currentCase = testCases[activeCaseIndex] || testCases[0];
  const rawNumsValue = currentCase.rawNums ?? `[${currentCase.nums.join(", ")}]`;
  const rawTargetValue = currentCase.rawTarget ?? String(currentCase.target);

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Case Navigation Tabs - wraps into rows when overflowing */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {testCases.map((_, index) => {
          const isActive = index === activeCaseIndex;
          return (
            <div
              key={index}
              className={`relative group flex items-center px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer select-none ${
                isActive
                  ? "bg-neutral-800 text-white"
                  : "bg-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
              }`}
              onClick={() => selectCase(index)}
            >
              <span>Case {index + 1}</span>
              {testCases.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCase(index);
                  }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-neutral-700 hover:bg-rose-500 text-neutral-300 hover:text-white flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                  title="Remove case"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>
          );
        })}

        {/* Plus Button */}
        <button
          type="button"
          onClick={addCase}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-xs text-neutral-400 hover:text-white bg-transparent hover:bg-neutral-800/60 transition cursor-pointer"
          title="Add test case"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
        </button>
      </div>

      {/* Case Variables Section */}
      <div className="flex flex-col gap-3.5 mt-1">
        {/* nums */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-neutral-400 font-semibold">
            nums =
          </label>
          <div className="bg-neutral-800 rounded-lg p-2.5 transition">
            <input
              type="text"
              value={rawNumsValue}
              onChange={(e) => updateActiveCaseNums(e.target.value)}
              placeholder="[2, 7, 11, 15]"
              className="w-full bg-transparent text-sm font-mono text-neutral-200 outline-none"
            />
          </div>
        </div>

        {/* target */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-neutral-400 font-semibold">
            target =
          </label>
          <div className="bg-neutral-800 rounded-lg p-2.5 transition">
            <input
              type="text"
              value={rawTargetValue}
              onChange={(e) => updateActiveCaseTarget(e.target.value)}
              placeholder="9"
              className="w-full bg-transparent text-sm font-mono text-neutral-200 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TwoSumQuestion() {
  const state = useTwoSum();
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <StructureInspector state={state} />
      </div>
      <div>
        <TraceExecution state={state} />
      </div>
    </div>
  );
}
