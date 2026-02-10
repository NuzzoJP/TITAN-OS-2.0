'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Award, Dumbbell, BarChart3, Target } from 'lucide-react';
import { getStrengthMetrics, getExercisePRs, get1RMProgress } from '@/lib/actions/health';
import { getMetabolicProfile } from '@/lib/actions/nutrition';
import type { StrengthMetrics, ExercisePR } from '@/lib/actions/health';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { calculateStrengthLevel, getStrengthLevelBadge, STRENGTH_LEVELS } from '@/lib/utils/strength-standards';
import type { StrengthLevel } from '@/lib/utils/strength-standards';
import { StrengthLevelBadge } from './strength-level-badge';

export function StrengthMetricsDashboard() {
  const [metrics, setMetrics] = useState<StrengthMetrics | null>(null);
  const [prs, setPrs] = useState<ExercisePR[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bodyWeight, setBodyWeight] = useState<number>(70); // Default
  const [gender, setGender] = useState<'male' | 'female'>('male');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      loadProgressData(selectedExercise);
    }
  }, [selectedExercise]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsData, prsData, profileData] = await Promise.all([
        getStrengthMetrics(),
        getExercisePRs(),
        getMetabolicProfile(),
      ]);

      setMetrics(metricsData);
      setPrs(prsData);

      // Obtener peso corporal y género del perfil
      if (profileData) {
        setBodyWeight(profileData.current_weight_kg || 70);
        setGender(profileData.gender as 'male' | 'female');
      }

      // Seleccionar primer ejercicio por defecto
      if (prsData.length > 0 && !selectedExercise) {
        setSelectedExercise(prsData[0].exercise_id);
      }
    } catch (error) {
      console.error('Error loading strength metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressData = async (exerciseId: string) => {
    const data = await get1RMProgress(exerciseId, 90);
    setProgressData(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando métricas...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <Dumbbell className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No hay datos de entrenamiento aún</p>
      </div>
    );
  }

  const selectedPR = prs.find(pr => pr.exercise_id === selectedExercise);

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fuerza Total */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Fuerza Total</p>
              <p className="text-3xl font-bold">{metrics.totalStrength} kg</p>
              <p className="text-xs text-muted-foreground mt-1">
                Top 3 1RM combinados
              </p>
            </div>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="text-primary" size={32} />
            </div>
          </div>
        </div>

        {/* Volumen Mensual */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Volumen Este Mes</p>
              <p className="text-3xl font-bold">
                {(metrics.monthlyVolume / 1000).toFixed(1)}
                <span className="text-lg text-muted-foreground"> ton</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.monthlyVolume.toLocaleString()} kg levantados
              </p>
            </div>
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Dumbbell className="text-blue-500" size={32} />
            </div>
          </div>
        </div>

        {/* PRs Este Mes */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">PRs Este Mes</p>
              <p className="text-3xl font-bold">{metrics.prsThisMonth}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Récords personales
              </p>
            </div>
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <Award className="text-yellow-500" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Lifts */}
      {metrics.topLifts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="text-primary" size={20} />
            Top 3 Lifts (1RM)
          </h3>
          <div className="space-y-3">
            {metrics.topLifts.map((lift, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                    index === 1 ? 'bg-gray-400/20 text-gray-400' :
                    'bg-orange-500/20 text-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{lift.exercise}</p>
                    <p className="text-sm text-muted-foreground">1RM Estimado</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{lift.max1rm.toFixed(1)} kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRs por Ejercicio */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="text-primary" size={20} />
          Récords por Ejercicio
        </h3>

        {/* Selector de Ejercicio */}
        <div className="mb-6">
          <select
            value={selectedExercise || ''}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full h-12 px-4 bg-background border border-border rounded-lg text-base"
          >
            {prs.map((pr) => (
              <option key={pr.exercise_id} value={pr.exercise_id}>
                {pr.exercise_name} - {pr.max_1rm.toFixed(1)} kg
              </option>
            ))}
          </select>
        </div>

        {/* Detalles del Ejercicio Seleccionado */}
        {selectedPR && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">1RM Máximo</p>
                <p className="text-2xl font-bold">{selectedPR.max_1rm.toFixed(1)} kg</p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Peso Máximo</p>
                <p className="text-2xl font-bold">{selectedPR.max_weight} kg</p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Reps Máximas</p>
                <p className="text-2xl font-bold">{selectedPR.max_reps}</p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Total Sets</p>
                <p className="text-2xl font-bold">{selectedPR.total_sets}</p>
              </div>
            </div>

            {/* Nivel de Fuerza */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
              <StrengthLevelBadge
                exerciseName={selectedPR.exercise_name}
                oneRepMax={selectedPR.max_1rm}
                bodyWeight={bodyWeight}
                gender={gender}
                showDetails={true}
              />
            </div>

            {/* Gráfica de Progreso */}
            {progressData.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-4">Progreso de 1RM (Últimos 90 días)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="date"
                      stroke="#888"
                      tickFormatter={(date) => format(new Date(date), 'dd MMM', { locale: es })}
                    />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: es })}
                      formatter={(value: any) => [`${value.toFixed(1)} kg`, '1RM']}
                    />
                    <Line
                      type="monotone"
                      dataKey="max1rm"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de Todos los PRs */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Todos los Récords</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {prs.map((pr) => {
            const strengthLevel = calculateStrengthLevel(pr.exercise_name, pr.max_1rm, bodyWeight, gender);
            
            return (
            <div
              key={pr.exercise_id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedExercise(pr.exercise_id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{pr.exercise_name}</p>
                  {strengthLevel && (
                    <StrengthLevelBadge
                      exerciseName={pr.exercise_name}
                      oneRepMax={pr.max_1rm}
                      bodyWeight={bodyWeight}
                      gender={gender}
                      showDetails={false}
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground capitalize">{pr.category}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{pr.max_1rm.toFixed(1)} kg</p>
                <p className="text-xs text-muted-foreground">{pr.total_sets} sets</p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
