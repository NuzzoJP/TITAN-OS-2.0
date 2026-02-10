'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Award, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCubittProgress, getLatestCubittData } from '@/lib/actions/cubitt';
import { ScanCubittModal } from './scan-cubitt-modal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProgressData {
  measured_at: string;
  weight_kg: number;
  body_fat_percent: number;
  muscle_mass_kg: number;
  water_percent: number;
  basal_metabolism: number;
  metabolic_age: number;
}

export function ProgressDashboard() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [latestData, setLatestData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [showScanModal, setShowScanModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    const [progressResult, latestResult] = await Promise.all([
      getCubittProgress(timeRange),
      getLatestCubittData(),
    ]);

    if (progressResult.success && progressResult.data) {
      setProgressData(progressResult.data);
    }

    if (latestResult.success && latestResult.data) {
      setLatestData(latestResult.data);
    }

    setLoading(false);
  };

  // Calcular cambios (primera vs última medición)
  const getChange = (key: keyof ProgressData) => {
    if (progressData.length < 2) return null;
    const first = progressData[0][key] as number;
    const last = progressData[progressData.length - 1][key] as number;
    const change = last - first;
    const percentChange = ((change / first) * 100).toFixed(1);
    return { change, percentChange };
  };

  // Formatear datos para gráficas
  const chartData = progressData.map(item => ({
    date: format(new Date(item.measured_at), 'dd MMM', { locale: es }),
    peso: item.weight_kg,
    musculo: item.muscle_mass_kg,
    grasa: item.body_fat_percent,
    agua: item.water_percent,
  }));

  // Análisis de rendimiento
  const getPerformanceInsights = () => {
    if (!latestData || progressData.length < 2) return [];

    const insights = [];
    const muscleChange = getChange('muscle_mass_kg');
    const fatChange = getChange('body_fat_percent');
    const metabolismChange = getChange('basal_metabolism');

    // Análisis de masa muscular
    if (muscleChange && muscleChange.change > 0) {
      insights.push({
        type: 'success',
        icon: Award,
        title: '¡Ganancia Muscular!',
        description: `Has ganado ${muscleChange.change.toFixed(1)}kg de músculo (+${muscleChange.percentChange}%)`,
      });
    } else if (muscleChange && muscleChange.change < -0.5) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Pérdida Muscular',
        description: `Has perdido ${Math.abs(muscleChange.change).toFixed(1)}kg de músculo. Aumenta proteína y volumen de entrenamiento.`,
      });
    }

    // Análisis de grasa corporal
    if (fatChange && fatChange.change < -1) {
      insights.push({
        type: 'success',
        icon: TrendingDown,
        title: 'Reducción de Grasa',
        description: `Has reducido ${Math.abs(fatChange.change).toFixed(1)}% de grasa corporal`,
      });
    } else if (fatChange && fatChange.change > 1) {
      insights.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'Aumento de Grasa',
        description: `Tu grasa corporal aumentó ${fatChange.change.toFixed(1)}%. Revisa tu déficit calórico.`,
      });
    }

    // Análisis de metabolismo
    if (metabolismChange && metabolismChange.change > 50) {
      insights.push({
        type: 'success',
        icon: Target,
        title: 'Metabolismo Mejorado',
        description: `Tu metabolismo basal aumentó ${metabolismChange.change.toFixed(0)} kcal/día`,
      });
    }

    // Análisis de hidratación
    if (latestData.water_percent < 60) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Hidratación Baja',
        description: `Tu % de agua corporal es ${latestData.water_percent}%. Objetivo: >60%`,
      });
    }

    return insights;
  };

  const insights = getPerformanceInsights();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (progressData.length === 0) {
    return (
      <div className="space-y-6">
        {/* Empty State */}
        <div className="bg-card border border-border rounded-lg p-8 md:p-12 text-center">
          <div className="max-w-md mx-auto">
            <TrendingUp className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Comienza a Trackear tu Progreso</h2>
            <p className="text-muted-foreground mb-6">
              Escanea tu reporte de Cubitt para ver tus métricas de composición corporal y seguir tu evolución.
            </p>
            
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-14"
                onClick={() => setShowScanModal(true)}
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Escanear Reporte de Cubitt
              </Button>
            </div>

            {/* Info Cards */}
            <div className="mt-8 grid grid-cols-2 gap-3 text-left">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-1">📊 Métricas</h3>
                <p className="text-xs text-muted-foreground">
                  Peso, masa muscular, % grasa, BMR
                </p>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-1">📈 Gráficas</h3>
                <p className="text-xs text-muted-foreground">
                  Visualiza tu progreso en el tiempo
                </p>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-1">🎯 Objetivos</h3>
                <p className="text-xs text-muted-foreground">
                  Bulk, cut o mantenimiento
                </p>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-1">🤖 IA</h3>
                <p className="text-xs text-muted-foreground">
                  Escaneo automático con cámara
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-left">
              <p className="font-medium mb-2">💡 Tip:</p>
              <p className="text-muted-foreground">
                Escanea tu Cubitt 1 vez por semana, mismo día y hora (ej: Lunes en ayunas) para resultados consistentes.
              </p>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-left">
              <p className="font-medium mb-2 text-yellow-500">⚠️ Importante:</p>
              <p className="text-muted-foreground">
                Primero debes ejecutar el SQL para crear las tablas. Ve a <span className="font-mono text-primary">GUIA_CUBITT.md</span> para instrucciones.
              </p>
            </div>
          </div>
        </div>

        {/* Scan Modal */}
        <ScanCubittModal
          open={showScanModal}
          onOpenChange={(open) => {
            setShowScanModal(open);
            if (!open) loadData();
          }}
          onSuccess={() => {
            loadData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Progreso</h2>
        <Button
          onClick={() => setShowScanModal(true)}
          className="h-12"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Actualizar Métricas
        </Button>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days as 7 | 30 | 90)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === days
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {days === 7 ? '7 días' : days === 30 ? '30 días' : '3 meses'}
          </button>
        ))}
      </div>

      {/* Performance Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Análisis de Rendimiento</h3>
          <div className="grid gap-3">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    insight.type === 'success'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`h-5 w-5 mt-0.5 ${
                        insight.type === 'success' ? 'text-green-500' : 'text-yellow-500'
                      }`}
                    />
                    <div>
                      <h4 className="font-semibold">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Métricas Clave */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {latestData && (
          <>
            <MetricCard
              label="Peso"
              value={`${latestData.weight_kg} kg`}
              change={getChange('weight_kg')}
            />
            <MetricCard
              label="Masa Muscular"
              value={`${latestData.muscle_mass_kg} kg`}
              change={getChange('muscle_mass_kg')}
              positive="up"
            />
            <MetricCard
              label="Grasa Corporal"
              value={`${latestData.body_fat_percent}%`}
              change={getChange('body_fat_percent')}
              positive="down"
            />
            <MetricCard
              label="Metabolismo"
              value={`${latestData.basal_metabolism} kcal`}
              change={getChange('basal_metabolism')}
              positive="up"
            />
          </>
        )}
      </div>

      {/* Gráfica de Composición Corporal */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Composición Corporal</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="musculo"
              stackId="1"
              stroke="#22d3ee"
              fill="#22d3ee"
              fillOpacity={0.6}
              name="Masa Muscular (kg)"
            />
            <Area
              type="monotone"
              dataKey="grasa"
              stackId="2"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.6}
              name="Grasa Corporal (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Peso y Agua */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Peso e Hidratación</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis yAxisId="left" stroke="#888" />
            <YAxis yAxisId="right" orientation="right" stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="peso"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
              name="Peso (kg)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="agua"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
              name="Agua Corporal (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  change: { change: number; percentChange: string } | null;
  positive?: 'up' | 'down';
}

function MetricCard({ label, value, change, positive = 'up' }: MetricCardProps) {
  const getTrendIcon = () => {
    if (!change) return <Minus className="h-4 w-4 text-muted-foreground" />;
    
    const isPositive = positive === 'up' ? change.change > 0 : change.change < 0;
    const isNegative = positive === 'up' ? change.change < 0 : change.change > 0;
    
    if (isPositive) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (isNegative) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (!change) return 'text-muted-foreground';
    
    const isPositive = positive === 'up' ? change.change > 0 : change.change < 0;
    const isNegative = positive === 'up' ? change.change < 0 : change.change > 0;
    
    if (isPositive) return 'text-green-500';
    if (isNegative) return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-mono font-bold">{value}</p>
      {change && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{change.percentChange}%</span>
        </div>
      )}
    </div>
  );
}
