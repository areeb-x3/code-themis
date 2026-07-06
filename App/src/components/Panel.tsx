import React from "react";

interface PanelProps {
  className?: string;
  title: string;
  content: React.ReactNode;
}

function Panel({ className = "", title, content }: PanelProps) {
  return (
    <div className={`panel ${className}`}>
      <div className="panel-title p-1"> {title} </div>
      <div className="p-4"> {content} </div>
    </div>
  );
}

export default Panel;
