export default function BarList({ data = [], valueKey = "value", labelKey = "label" }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item[labelKey]}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-heading">{item[labelKey]}</span>
            <span className="text-body">{item[valueKey].toLocaleString()}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-border">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(item[valueKey] / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
