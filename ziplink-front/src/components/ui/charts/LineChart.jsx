export default function LineChart({ data = [], height = 220 }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 100;
  const stepX = width / (data.length - 1 || 1);

  const points = data.map((d, i) => `${i * stepX},${100 - (d.value / max) * 100}`).join(" ");
  const areaPoints = `0,100 ${points} ${width},100`;

  return (
    <div style={{ height }} className="w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <polygon points={areaPoints} fill="var(--color-primary)" opacity="0.12" />
        <polyline points={points} fill="none" stroke="var(--color-primary)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-xs text-body/70">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
