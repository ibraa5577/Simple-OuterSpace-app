import { useState } from "react";

export function TextExpander({
  collapsedNumWords = 15,
  expandButtonText = "show more",
  collapseButtonText = "show less",
  expanded = false,
  className,
  children,
}) {
  const [exp, setExpanded] = useState(expanded);

  const collapsString = children
    .split(" ")
    .filter((word, i) => collapsedNumWords >= i + 1)
    .join(" ");

  return (
    <div className={className}>
      {exp ? children : collapsString + "..."}
      <button
        className="text-expander-button"
        onClick={() => setExpanded(!exp)}
      >
        {exp ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
}
