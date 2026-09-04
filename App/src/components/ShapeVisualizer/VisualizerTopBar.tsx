import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faBackwardStep,
  faForwardStep,
  faRotateLeft,
  faChevronDown,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import type { SpeedOption } from "./types";
import { DEFAULT_SPEED_OPTIONS } from "./types";

export interface VisualizerTopBarProps {
  step: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPrevious: () => void;
  onNext: () => void;
  onPlayToggle: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  speedOptions?: SpeedOption[];
  rightContent?: React.ReactNode;
  className?: string;
}

export const VisualizerTopBar: React.FC<VisualizerTopBarProps> = ({
  step,
  totalSteps,
  isPlaying,
  speed,
  onPrevious,
  onNext,
  onPlayToggle,
  onReset,
  onSpeedChange,
  speedOptions = DEFAULT_SPEED_OPTIONS,
  rightContent,
  className = "",
}) => {
  const [isSpeedOpen, setIsSpeedOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close speed dropdown on outside click
  useEffect(() => {
    if (!isSpeedOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsSpeedOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSpeedOpen]);

  const currentOption =
    speedOptions.find((opt) => Math.abs(opt.value - speed) < 50) ||
    speedOptions[2] ||
    speedOptions[0];

  return (
    <div
      className={`flex items-center justify-between p-0 px-2 h-9 border-b border-neutral-800 bg-neutral-900 shrink-0 select-none relative z-30 overflow-visible ${className}`}
    >
      {/* Playback Controls (Previous, Play, Next, Reset) */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={step <= 0}
          className="bg-transparent border-0 disabled:opacity-25 h-6 w-7 flex items-center justify-center text-neutral-400 hover:text-white transition duration-150 cursor-pointer text-xs"
          style={{ borderRadius: "5px" }}
          title="Previous Step"
        >
          <FontAwesomeIcon icon={faBackwardStep} className="w-3.5 h-3.5" />
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          onClick={onPlayToggle}
          className={`bg-transparent border-0 h-6 w-7 flex items-center justify-center transition duration-150 cursor-pointer text-xs ${
            isPlaying
              ? "text-amber-400 hover:text-amber-300"
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
          type="button"
          onClick={onNext}
          disabled={step >= totalSteps - 1}
          className="bg-transparent border-0 disabled:opacity-25 h-6 w-7 flex items-center justify-center text-neutral-400 hover:text-white transition duration-150 cursor-pointer text-xs"
          style={{ borderRadius: "5px" }}
          title="Next Step"
        >
          <FontAwesomeIcon icon={faForwardStep} className="w-3.5 h-3.5" />
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="bg-transparent border-0 h-6 w-7 flex items-center justify-center text-neutral-400 hover:text-white transition duration-150 cursor-pointer text-xs"
          style={{ borderRadius: "5px" }}
          title="Reset"
        >
          <FontAwesomeIcon icon={faRotateLeft} className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right side: Speed dropdown or custom actions */}
      <div className="flex items-center gap-2">
        {rightContent}

        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-400 font-medium">Speed:</span>
            <button
              type="button"
              onClick={() => setIsSpeedOpen((prev) => !prev)}
              className="bg-transparent border-0 flex items-center gap-1.5 px-2 h-6 text-neutral-200 hover:text-white hover:bg-neutral-800/80 transition duration-150 cursor-pointer text-xs font-mono"
              style={{ borderRadius: "5px" }}
              title="Select playback speed"
            >
              <span>{currentOption.label}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-2.5 h-2.5 text-neutral-400 transition-transform duration-150 ${
                  isSpeedOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>
          </div>

          {/* Custom Dropdown Menu */}
          {isSpeedOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-24 py-1 bg-neutral-900 border border-neutral-700 shadow-2xl z-50 overflow-hidden"
              style={{ borderRadius: "5px" }}
            >
              {speedOptions.map((opt) => {
                const isSelected = opt.value === currentOption.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onSpeedChange(opt.value);
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
    </div>
  );
};
