import { useState, useRef, useEffect } from "react";
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
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FlowchartCanvas } from "../../components/ShapeVisualizer";
import {
  useTwoSum,
  CODE_SNIPPET,
  type TwoSumState,
} from "./two-sum";

const elementBoxRadius = {
  borderBottomLeftRadius: "0.5rem",
  borderTopRightRadius: "0.5rem",
  borderTopLeftRadius: "0px",
  borderBottomRightRadius: "0px",
};

const SPEED_OPTIONS = [
  { label: "0.5x", value: 2000 },
  { label: "0.75x", value: 1333 },
  { label: "1.0x", value: 1000 },
  { label: "1.25x", value: 800 },
  { label: "1.5x", value: 667 },
  { label: "2.0x", value: 500 },
];

export interface StructureInspectorProps {
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

  const [isSpeedOpen, setIsSpeedOpen] = useState<boolean>(false);
  const speedDropdownRef = useRef<HTMLDivElement>(null);

  // Close speed dropdown on outside click
  useEffect(() => {
    if (!isSpeedOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        speedDropdownRef.current &&
        !speedDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSpeedOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSpeedOpen]);

  const currentSpeedOption =
    SPEED_OPTIONS.find((opt) => Math.abs(opt.value - speed) < 50) ||
    SPEED_OPTIONS[2];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Controls Bar - opaque, no padding, no border/bg on buttons or dropdown */}
      <div className="flex items-center justify-between p-0 px-2 h-9 border-b border-neutral-800 bg-neutral-900 shrink-0 select-none relative z-30 overflow-visible">
        {/* Playback Controls (Previous, Play, Next, Reset) */}
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
                ? "text-neutral-100 hover:text-neutral-200"
                : "text-neutral-300 hover:text-white"
            }`}
            style={{ borderRadius: "5px" }}
            title={isPlaying ? "Pause" : "Play"}
          >
            <FontAwesomeIcon
              icon={isPlaying ? faPause : faPlay}
              className="w-3.5 h-3.5"
            />
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

        {/* Custom Speed dropdown menu */}
        <div className="relative" ref={speedDropdownRef}>
          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-400 font-medium">Speed:</span>
            <button
              type="button"
              onClick={() => setIsSpeedOpen((prev) => !prev)}
              className="bg-transparent border-0 flex items-center gap-1.5 px-2 h-6 text-neutral-200 hover:text-white hover:bg-neutral-800/80 transition duration-150 cursor-pointer text-xs font-mono"
              style={{ borderRadius: "5px" }}
              title="Select playback speed"
            >
              <span>{currentSpeedOption.label}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-2.5 h-2.5 text-neutral-400 transition-transform duration-150 ${
                  isSpeedOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>
          </div>

          {/* Custom Dropdown Popup */}
          {isSpeedOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-24 py-1 bg-neutral-900 border border-neutral-700 shadow-2xl z-50 overflow-hidden"
              style={{ borderRadius: "5px" }}
            >
              {SPEED_OPTIONS.map((opt) => {
                const isSelected = opt.value === currentSpeedOption.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setSpeed(opt.value);
                      setIsSpeedOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? "bg-neutral-800 text-white font-semibold"
                        : "text-neutral-300 hover:bg-neutral-800/70 hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-2.5 h-2.5 text-emerald-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Workspace with Classic Blocks */}
      <div className="flex-1 min-h-0 min-w-0 relative overflow-hidden">
        <FlowchartCanvas
          className="w-full h-full"
          options={{
            minScale: 0.3,
            maxScale: 2.5,
          }}
        >
          {/* Classic Blocks rendered inside the pannable & zoomable canvas */}
          <div className="flex items-start gap-8 p-6 select-none w-max">
            {/* LEFT: ARRAY */}
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-2 mb-3 shrink-0 self-start">
                <FontAwesomeIcon
                  icon={faHashtag}
                  className="w-3.5 h-3.5 text-neutral-400"
                />
                <h3 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">
                  ARRAY
                </h3>
                <span className="text-[11px] text-neutral-400 font-mono bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800">
                  Length: {nums.length}
                </span>
              </div>

              <div className="flex flex-nowrap gap-3 items-center justify-start">
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
                      (currentTrace.type === "add" ||
                        currentTrace.type === "found"));

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center shrink-0"
                    >
                      {/* Fixed box size, constant border-2, NO scale transforms */}
                      <div
                        className={`w-14 h-14 flex items-center justify-center font-bold text-lg border-2 transition-colors duration-150 font-mono relative ${
                          isSolution
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : isCurrent
                            ? "bg-neutral-200 border-neutral-200 text-neutral-950 font-bold"
                            : isVisited
                            ? "bg-neutral-900 border-neutral-700 text-neutral-300 opacity-90"
                            : "bg-neutral-950 border-neutral-800 text-neutral-500"
                        }`}
                        style={elementBoxRadius}
                      >
                        {num}
                        {isSolution && (
                          <div className="absolute -top-1.5 -right-1.5 bg-white text-emerald-700 rounded-full w-4 h-4 flex items-center justify-center text-[9px] border border-neutral-900 shadow">
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="stroke-[3]"
                            />
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
                          <span className="text-[10px] text-white font-semibold leading-tight">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VERTICAL DIVIDER */}
            <div className="w-px self-stretch bg-neutral-800/60 mx-1" />

            {/* RIGHT: HASH MAP */}
            <div className="flex flex-col min-w-[240px]">
              <div className="flex items-center gap-2 mb-3 shrink-0 self-start">
                <FontAwesomeIcon
                  icon={faTable}
                  className="w-3.5 h-3.5 text-neutral-400"
                />
                <h3 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider">
                  HASH MAP
                </h3>
                <span className="text-[11px] text-neutral-400 font-mono bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800">
                  Entries: {Object.keys(currentTrace.hashMap).length}
                </span>
              </div>

              <div className="flex flex-col">
                {Object.keys(currentTrace.hashMap).length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-neutral-500 gap-2 border border-dashed border-neutral-800/80 rounded-lg">
                    <FontAwesomeIcon
                      icon={faTable}
                      className="text-lg text-neutral-600"
                    />
                    <p className="text-xs text-neutral-500 font-mono">
                      HashMap is empty
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-xs flex flex-col gap-2">
                    {/* Table Headers */}
                    <div className="grid grid-cols-2 text-[11px] font-mono text-neutral-400 uppercase tracking-wider px-3">
                      <span className="text-center font-medium">Key</span>
                      <span className="text-center font-medium">Value</span>
                    </div>

                    {/* Combined single table box per entry with same border radius styling */}
                    <div className="flex flex-col gap-2">
                      {Object.entries(currentTrace.hashMap).map(
                        ([key, val]) => {
                          return (
                            <div
                              key={key}
                              className="grid grid-cols-2 text-center text-sm font-mono font-bold border bg-neutral-900 border-neutral-700 text-neutral-100"
                              style={elementBoxRadius}
                            >
                              <div className="py-2 px-3 border-r border-neutral-700/60">
                                {key}
                              </div>
                              <div className="py-2 px-3 text-neutral-300">
                                {val}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FlowchartCanvas>
      </div>

      {/* Bottom Bar: Opaque, step explanation mirroring top bar */}
      <div className="flex items-center border-t border-neutral-800 bg-neutral-900 shrink-0 h-9 p-0 px-2 gap-2 select-none">
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
      <div className="flex items-center px-3 h-9 border-b border-neutral-800 bg-neutral-900 shrink-0 select-none">
        <span className="text-xs text-neutral-300 font-jetbrains">
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
              className={`w-full min-w-max py-0.5 flex items-center transition-colors duration-75 relative z-10 ${
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
    <div className="flex-1 h-full w-full min-h-0 overflow-auto p-4 flex flex-col gap-4 bg-neutral-900">
      {/* Case Navigation Tabs */}
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
