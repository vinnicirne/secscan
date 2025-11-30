import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SecurityFinding } from '../types';

interface AnalysisChartProps {
  findings: SecurityFinding[];
}

const COLORS = {
  CRITICAL: '#ef4444', // red-500
  HIGH: '#f97316',    // orange-500
  MEDIUM: '#eab308',  // yellow-500
  LOW: '#3b82f6',     // blue-500
  INFO: '#94a3b8',    // slate-400
};

const AnalysisChart: React.FC<AnalysisChartProps> = ({ findings }) => {
  const data = React.useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 };
    findings.forEach(f => {
      if (counts[f.severity] !== undefined) {
        counts[f.severity]++;
      }
    });

    return Object.keys(counts)
      .filter(key => counts[key as keyof typeof counts] > 0)
      .map(key => ({
        name: key,
        value: counts[key as keyof typeof counts],
        color: COLORS[key as keyof typeof COLORS]
      }));
  }, [findings]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 border border-slate-200 rounded-lg bg-slate-50">
        Nenhuma vulnerabilidade encontrada.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#0f172a' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisChart;