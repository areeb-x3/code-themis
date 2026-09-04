import { useState, useEffect, useMemo } from "react";

export interface TestCase {
  nums: number[];
  target: number;
  rawNums?: string;
  rawTarget?: string;
}

export interface TraceStep {
  type: "start" | "check" | "evaluate" | "found" | "add" | "end";
  currentIndex: number;
  hashMap: Record<number, number>;
  complement: number | null;
  solution: [number, number] | null;
  activeLine: number;
  action: string;
}

export type TokenType = "keyword" | "type" | "method" | "variable" | "number" | "operator";

export interface CodeToken {
  text: string;
  type?: TokenType;
}

export interface CodeLine {
  line: number;
  indent: number;
  tokens: CodeToken[];
}

export const JAVA_CODE_SNIPPET: CodeLine[] = [
  {
    line: 1,
    indent: 0,
    tokens: [
      { text: "class", type: "keyword" },
      { text: " " },
      { text: "Solution", type: "type" },
      { text: " {" },
    ],
  },
  {
    line: 2,
    indent: 1,
    tokens: [
      { text: "public", type: "keyword" },
      { text: " " },
      { text: "int[]", type: "type" },
      { text: " " },
      { text: "twoSum", type: "method" },
      { text: "(" },
      { text: "int[]", type: "type" },
      { text: " " },
      { text: "nums", type: "variable" },
      { text: ", " },
      { text: "int", type: "type" },
      { text: " " },
      { text: "target", type: "variable" },
      { text: ") {" },
    ],
  },
  {
    line: 3,
    indent: 2,
    tokens: [
      { text: "Map", type: "type" },
      { text: "<" },
      { text: "Integer", type: "type" },
      { text: ", " },
      { text: "Integer", type: "type" },
      { text: "> " },
      { text: "map", type: "variable" },
      { text: " = ", type: "operator" },
      { text: "new", type: "keyword" },
      { text: " " },
      { text: "HashMap", type: "type" },
      { text: "<>();" },
    ],
  },
  {
    line: 4,
    indent: 2,
    tokens: [
      { text: "for", type: "keyword" },
      { text: " (" },
      { text: "int", type: "type" },
      { text: " " },
      { text: "i", type: "variable" },
      { text: " = ", type: "operator" },
      { text: "0", type: "number" },
      { text: "; " },
      { text: "i", type: "variable" },
      { text: " < ", type: "operator" },
      { text: "nums", type: "variable" },
      { text: "." },
      { text: "length", type: "variable" },
      { text: "; " },
      { text: "i", type: "variable" },
      { text: "++", type: "operator" },
      { text: ") {" },
    ],
  },
  {
    line: 5,
    indent: 3,
    tokens: [
      { text: "int", type: "type" },
      { text: " " },
      { text: "complement", type: "variable" },
      { text: " = ", type: "operator" },
      { text: "target", type: "variable" },
      { text: " - ", type: "operator" },
      { text: "nums", type: "variable" },
      { text: "[" },
      { text: "i", type: "variable" },
      { text: "];" },
    ],
  },
  {
    line: 6,
    indent: 3,
    tokens: [
      { text: "if", type: "keyword" },
      { text: " (" },
      { text: "map", type: "variable" },
      { text: "." },
      { text: "containsKey", type: "method" },
      { text: "(" },
      { text: "complement", type: "variable" },
      { text: ")) {" },
    ],
  },
  {
    line: 7,
    indent: 4,
    tokens: [
      { text: "return", type: "keyword" },
      { text: " " },
      { text: "new", type: "keyword" },
      { text: " " },
      { text: "int[]", type: "type" },
      { text: " { " },
      { text: "map", type: "variable" },
      { text: "." },
      { text: "get", type: "method" },
      { text: "(" },
      { text: "complement", type: "variable" },
      { text: "), " },
      { text: "i", type: "variable" },
      { text: " };" },
    ],
  },
  {
    line: 8,
    indent: 3,
    tokens: [{ text: "}" }],
  },
  {
    line: 9,
    indent: 3,
    tokens: [
      { text: "map", type: "variable" },
      { text: "." },
      { text: "put", type: "method" },
      { text: "(" },
      { text: "nums", type: "variable" },
      { text: "[" },
      { text: "i", type: "variable" },
      { text: "], " },
      { text: "i", type: "variable" },
      { text: ");" },
    ],
  },
  {
    line: 10,
    indent: 2,
    tokens: [{ text: "}" }],
  },
  {
    line: 11,
    indent: 2,
    tokens: [
      { text: "return", type: "keyword" },
      { text: " " },
      { text: "new", type: "keyword" },
      { text: " " },
      { text: "int[]", type: "type" },
      { text: " {};" },
    ],
  },
  {
    line: 12,
    indent: 1,
    tokens: [{ text: "}" }],
  },
  {
    line: 13,
    indent: 0,
    tokens: [{ text: "}" }],
  },
];

export const CODE_SNIPPET = JAVA_CODE_SNIPPET;

export function useTwoSum() {
  const [testCases, setTestCases] = useState<TestCase[]>([
    { nums: [2, 7, 11, 15], target: 9, rawNums: "[2, 7, 11, 15]", rawTarget: "9" },
    { nums: [3, 2, 4], target: 6, rawNums: "[3, 2, 4]", rawTarget: "6" },
    { nums: [3, 3], target: 6, rawNums: "[3, 3]", rawTarget: "6" },
    { nums: [1, 5, 8, 3, 14], target: 11, rawNums: "[1, 5, 8, 3, 14]", rawTarget: "11" },
    { nums: [5, 2, 9, 1, 7], target: 20, rawNums: "[5, 2, 9, 1, 7]", rawTarget: "20" },
  ]);
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);

  const [nums, setNums] = useState<number[]>([2, 7, 11, 15]);
  const [target, setTarget] = useState<number>(9);
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);

  const trace = useMemo<TraceStep[]>(() => {
    if (isNaN(target)) {
      return [
        {
          type: "end",
          currentIndex: 0,
          hashMap: {},
          complement: null,
          solution: null,
          activeLine: 2,
          action: "Invalid target value. Please enter a valid number.",
        },
      ];
    }

    const traceList: TraceStep[] = [];

    traceList.push({
      type: "start",
      currentIndex: 0,
      hashMap: {},
      complement: null,
      solution: null,
      activeLine: 3,
      action: "Initialize HashMap map = new HashMap<>() to store visited numbers and their indices.",
    });

    const map: Record<number, number> = {};
    for (let i = 0; i < nums.length; i++) {
      const currentVal = nums[i];
      const comp = target - currentVal;

      traceList.push({
        type: "check",
        currentIndex: i,
        hashMap: { ...map },
        complement: comp,
        solution: null,
        activeLine: 5,
        action: `Calculate complement: ${target} - ${currentVal} = ${comp}. Check if complement is in the map.`,
      });

      traceList.push({
        type: "evaluate",
        currentIndex: i,
        hashMap: { ...map },
        complement: comp,
        solution: null,
        activeLine: 6,
        action: `map.containsKey(${comp})? ${comp in map ? "true" : "false"}.`,
      });

      if (comp in map) {
        traceList.push({
          type: "found",
          currentIndex: i,
          hashMap: { ...map },
          complement: comp,
          solution: [map[comp], i],
          activeLine: 7,
          action: `Found complement ${comp} at index ${map[comp]}. Returning new int[] { ${map[comp]}, ${i} }.`,
        });
        return traceList;
      }

      map[currentVal] = i;
      traceList.push({
        type: "add",
        currentIndex: i,
        hashMap: { ...map },
        complement: comp,
        solution: null,
        activeLine: 9,
        action: `map.put(${currentVal}, ${i}) - Add current number and index to the map for future checks.`,
      });
    }

    traceList.push({
      type: "end",
      currentIndex: nums.length,
      hashMap: { ...map },
      complement: null,
      solution: null,
      activeLine: 11,
      action: "Finished scanning the array. No pair found that sums up to the target. Returning new int[] {}.",
    });

    return traceList;
  }, [nums, target]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isPlaying) {
      timer = setTimeout(() => {
        setStep((prev) => {
          if (prev + 1 >= trace.length - 1) {
            setIsPlaying(false);
          }
          return Math.min(prev + 1, trace.length - 1);
        });
      }, speed);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, step, speed, trace.length]);

  const currentTrace: TraceStep = trace[step] || trace[0];

  const validateTestCase = () => {
    const current = testCases[activeCaseIndex] || testCases[0];
    const targetStr = (current?.rawTarget ?? String(target)).trim();
    if (targetStr === "" || isNaN(Number(targetStr))) {
      alert("Error: Invalid target. Please enter a valid number.");
      return false;
    }
    return true;
  };

  const handlePlayToggle = () => {
    if (!isPlaying) {
      if (!validateTestCase()) return;
      if (step >= trace.length - 1) {
        setStep(0);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleForward = () => {
    if (!validateTestCase()) return;
    if (step < trace.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBackward = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const selectCase = (index: number) => {
    const selected = testCases[index];
    if (!selected) return;
    setActiveCaseIndex(index);
    setNums(selected.nums);
    setTarget(selected.target);
    setStep(0);
    setIsPlaying(false);
  };

  const addCase = () => {
    const current = testCases[activeCaseIndex] || testCases[0];
    const newCase: TestCase = {
      nums: [...current.nums],
      target: current.target,
      rawNums: current.rawNums ?? `[${current.nums.join(", ")}]`,
      rawTarget: current.rawTarget ?? String(current.target),
    };
    const nextCases = [...testCases, newCase];
    const newIndex = nextCases.length - 1;
    setTestCases(nextCases);
    setActiveCaseIndex(newIndex);
    setNums(newCase.nums);
    setTarget(newCase.target);
    setStep(0);
    setIsPlaying(false);
  };

  const removeCase = (index: number) => {
    if (testCases.length <= 1) return;
    const nextCases = testCases.filter((_, i) => i !== index);
    const newActiveIndex =
      activeCaseIndex >= nextCases.length
        ? nextCases.length - 1
        : activeCaseIndex === index
          ? Math.max(0, index - 1)
          : activeCaseIndex > index
            ? activeCaseIndex - 1
            : activeCaseIndex;

    setTestCases(nextCases);
    setActiveCaseIndex(newActiveIndex);
    setNums(nextCases[newActiveIndex].nums);
    setTarget(nextCases[newActiveIndex].target);
    setStep(0);
    setIsPlaying(false);
  };

  const updateActiveCaseNums = (rawVal: string) => {
    const cleaned = rawVal.replace(/[[\]]/g, "");
    const parsed = cleaned
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));

    setTestCases((prev) =>
      prev.map((tc, idx) => {
        if (idx !== activeCaseIndex) return tc;
        return {
          ...tc,
          rawNums: rawVal,
          nums: parsed.length > 0 ? parsed : tc.nums,
        };
      })
    );

    if (parsed.length > 0) {
      setNums(parsed);
      setStep(0);
      setIsPlaying(false);
    }
  };

  const updateActiveCaseTarget = (rawVal: string) => {
    const trimmed = rawVal.trim();
    const parsed = Number(trimmed);
    const isValid = trimmed !== "" && !isNaN(parsed);

    setTestCases((prev) =>
      prev.map((tc, idx) => {
        if (idx !== activeCaseIndex) return tc;
        return {
          ...tc,
          rawTarget: rawVal,
          target: isValid ? parsed : NaN,
        };
      })
    );

    setTarget(isValid ? parsed : NaN);
    setStep(0);
    setIsPlaying(false);
  };

  return {
    nums,
    setNums,
    target,
    setTarget,
    step,
    setStep,
    isPlaying,
    setIsPlaying,
    speed,
    setSpeed,
    testCases,
    activeCaseIndex,
    trace,
    currentTrace,
    validateTestCase,
    handlePlayToggle,
    handleForward,
    handleBackward,
    handleReset,
    selectCase,
    addCase,
    removeCase,
    updateActiveCaseNums,
    updateActiveCaseTarget,
  };
}

export type TwoSumState = ReturnType<typeof useTwoSum>;
