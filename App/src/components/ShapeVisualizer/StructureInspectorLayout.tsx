import React from "react";

export interface StructureInspectorLayoutProps {
  topBar: React.ReactNode;
  bottomBar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const StructureInspectorLayout: React.FC<
  StructureInspectorLayoutProps
> = ({ topBar, bottomBar, children, className = "" }) => {
  return (
    <div className={`h-full flex flex-col overflow-hidden ${className}`}>
      {topBar}
      <div className="flex-1 min-h-0 min-w-0 relative overflow-hidden">
        {children}
      </div>
      {bottomBar}
    </div>
  );
};
