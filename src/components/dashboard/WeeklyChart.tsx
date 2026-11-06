import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function WeeklyChart({
  data,
}: {
  data: { day: string; questions: number; minutes: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-q" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-purple)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--brand-purple)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-m" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="var(--muted-foreground)"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="minutes"
            stroke="var(--brand-blue)"
            strokeWidth={2}
            fill="url(#grad-m)"
            name="Minutes"
          />
          <Area
            type="monotone"
            dataKey="questions"
            stroke="var(--brand-purple)"
            strokeWidth={2}
            fill="url(#grad-q)"
            name="Questions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
