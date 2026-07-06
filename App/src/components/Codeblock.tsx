interface CodeblockProps {
  code: string;
  highlightedLine?: number;
}

function Codeblock({ code, highlightedLine }: CodeblockProps) {
  const lines = code.split("\n");

  return (
    <div className="w-full h-full text-sm flex flex-col">
      <div className="code-block flex-1 overflow-x-auto">
        <pre className="inline-block min-w-full text-neutral-300">
          <code className="w-full">
            {lines.map((lineText, index) => {
              const lineNumber = index + 1;
              const isActive = lineNumber === highlightedLine;

              return (
                <div
                  key={`row-${lineNumber}`}
                  className={`flex items-stretch w-full min-w-max transition-colors duration-150 ${
                    isActive ? "bg-neutral-800/40" : "hover:bg-neutral-900/30"
                  }`}
                >
                  <div
                    className={`w-10 select-none pr-3 text-right text-xs font-medium tracking-tight border-r border-neutral-700/50 flex items-center justify-end sticky left-0 z-10 bg-neutral-950 ${
                      isActive ? "text-white font-bold" : "text-neutral-600"
                    }`}
                  >
                    {lineNumber}
                  </div>

                  <div className="flex-1 whitespace-pre pl-4 pr-6 py-1 leading-relaxed">
                    {lineText === "" ? " " : lineText}
                  </div>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default Codeblock;