import { useState } from "react";

const COLORS = ["#7C8B5E", "#5B6B3C", "#C6954D", "#E07A5F", "#3D405B", "#81B29A", "#F2CC8F", "#264653"];

export default function DonutChart({ data = [], size = 180, thickness = 28 }) {
  const [hovered, setHovered] = useState(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulative = 0;
  const arcs = data.map((d, i) => {
    const pct = d.value / total;
    const offset = circumference * (1 - cumulative);
    cumulative += pct;
    return {
      ...d,
      pct,
      offset,
      length: circumference * pct,
      color: d.color || COLORS[i % COLORS.length],
      index: i,
    };
  });

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-8">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
          {arcs.map((arc) => (
            <circle
              key={arc.index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness}
              strokeDasharray={`${arc.length} ${circumference - arc.length}`}
              strokeDashoffset={-arc.offset + circumference}
              opacity={hovered !== null && hovered !== arc.index ? 0.3 : 1}
              className="transition-opacity duration-200"
              onMouseEnter={() => setHovered(arc.index)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {hovered !== null ? (
            <>
              <span className="text-lg font-semibold text-heading">
                {Math.round(arcs[hovered].pct * 100)}%
              </span>
              <span className="max-w-[80px] truncate text-center text-xs text-body">{arcs[hovered].label}</span>
            </>
          ) : (
            <>
              <span className="text-lg font-semibold text-heading">
                {total.toLocaleString()}
              </span>
              <span className="text-xs text-body">Total</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2.5 sm:flex-col">
        {arcs.map((arc) => (
          <div
            key={arc.index}
            className="flex items-center gap-2 text-sm"
            onMouseEnter={() => setHovered(arc.index)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: arc.color }}
            />
            <span className="text-body">
              {arc.label}{" "}
              <span className="font-medium text-heading">
                {arc.value.toLocaleString()}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
