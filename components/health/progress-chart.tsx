'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProgressChartProps {
  data: Array<{
    one_rep_max_est: number | null;
    weight_kg: number;
    reps: number;
    created_at: string;
    health_workout_sessions: {
      date: string;
    };
  }>;
}

export function ProgressChart({ data }: ProgressChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No hay datos suficientes para mostrar el gráfico
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: format(new Date(item.health_workout_sessions.date), 'dd MMM', { locale: es }),
    '1RM': item.one_rep_max_est ? parseFloat(item.one_rep_max_est.toFixed(1)) : 0,
    peso: parseFloat(item.weight_kg.toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="date" 
          stroke="#888"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#888"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Line
          type="monotone"
          dataKey="1RM"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          name="1RM Estimado (kg)"
        />
        <Line
          type="monotone"
          dataKey="peso"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          name="Peso Usado (kg)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
