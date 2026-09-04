import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  StructureInspectorLayout,
  VisualizerTopBar,
  VisualizerBottomBar,
  FlowchartCanvas,
  ArrayVisualizer,
  HashMapVisualizer,
} from "../../components/ShapeVisualizer";
import {
  useTwoSum,
  CODE_SNIPPET,
  type TwoSumState,
} from "./two-sum";

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

  return (
    <StructureInspectorLayout
      topBar={
        <VisualizerTopBar
          step={step}
          totalSteps={trace.length}
          isPlaying={isPlaying}
          speed={speed}
          onPrevious={handleBackward}
          onNext={handleForward}
          onPlayToggle={() => {
            onPlay?.();
            handlePlayToggle();
          }}
          onReset={handleReset}
          onSpeedChange={setSpeed}
        />
      }
      bottomBar={
        <VisualizerBottomBar
          step={step}
          totalSteps={trace.length}
          actionText={currentTrace.action}
        />
      }
    >
      <FlowchartCanvas
        className="w-full h-full"
        options={{
          minScale: 0.3,
          maxScale: 2.5,
        }}
      >
        <div className="flex items-start gap-8 p-6 select-none w-max">
          {/* ARRAY Visualizer */}
          <ArrayVisualizer
            elements={nums}
            currentIndex={
              currentTrace.type !== "end" ? currentTrace.currentIndex : null
            }
            matchIndices={currentTrace.solution ?? null}
            isVisited={(index) =>
              currentTrace.currentIndex > index ||
              (currentTrace.currentIndex === index &&
                (currentTrace.type === "add" || currentTrace.type === "found"))
            }
          />

          {/* DIVIDER */}
          <div className="w-px self-stretch bg-neutral-800/60 mx-1" />

          {/* HASH MAP Visualizer */}
          <HashMapVisualizer entries={currentTrace.hashMap} />
        </div>
      </FlowchartCanvas>
    </StructureInspectorLayout>
  );
}

export function TraceExecution({ state }: { state: TwoSumState }) {
  const { currentTrace } = state;

  return (
    <div className="flex-1 h-full w-full flex flex-col bg-neutral-900 overflow-hidden font-jetbrains">
      {/* Top Bar */}
      <div className="flex items-center px-3 h-9 border-b border-neutral-800 bg-neutral-900 shrink-0 select-none">
        <span className="text-xs text-neutral-300 font-jetbrains">
          Solution.java
        </span>
      </div>

      {/* Code Editor Container */}
      <div className="flex-1 min-h-0 overflow-auto relative py-3 px-0 flex flex-col leading-relaxed">
        {/* Vertical divider line */}
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
              {/* Centered Line Number */}
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
