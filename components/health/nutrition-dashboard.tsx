'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Target, TrendingUp, Scale, Flame } from 'lucide-react';
import {
  getTodayNutritionLogs,
  getDailyNutritionSummary,
  getMetabolicProfile,
} from '@/lib/actions/nutrition';
import type { NutritionLog, MetabolicProfile } from '@/lib/actions/nutrition';
import { ScanFoodModal } from './scan-food-modal';

export function NutritionDashboard() {
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [profile, setProfile] = useState<MetabolicProfile | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [logsData, summaryData, profileData] = await Promise.all([
        getTodayNutritionLogs(),
        getDailyNutritionSummary(),
        getMetabolicProfile(),
      ]);

      setLogs(logsData);
      setSummary(summaryData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading nutrition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowScanModal(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  const calorieProgress = profile?.daily_calorie_target
    ? (summary?.total_calories / profile.daily_calorie_target) * 100
    : 0;

  const proteinProgress = profile?.daily_protein_target_g
    ? (summary?.total_protein / profile.daily_protein_target_g) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Titan Fuel AI</h2>
        </div>
        <button
          onClick={() => setShowScanModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Sparkles size={18} />
          <span>Escanear Comida</span>
        </button>
      </div>

      {/* Metabolic Profile Alert */}
      {!profile && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-yellow-500">
            ⚠️ Configura tu perfil metabólico para obtener recomendaciones personalizadas
          </p>
        </div>
      )}

      {/* Daily Progress */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calories */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Calorías Hoy</p>
                <p className="text-3xl font-bold">
                  {summary?.total_calories || 0}
                  <span className="text-lg text-muted-foreground">
                    {' '}/ {profile.daily_calorie_target?.toFixed(0)}
                  </span>
                </p>
              </div>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Flame className="text-primary" size={32} />
              </div>
            </div>
            <div className="w-full bg-background/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {calorieProgress.toFixed(0)}% del objetivo diario
            </p>
          </div>

          {/* Protein */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Proteína Hoy</p>
                <p className="text-3xl font-bold">
                  {summary?.total_protein?.toFixed(0) || 0}g
                  <span className="text-lg text-muted-foreground">
                    {' '}/ {profile.daily_protein_target_g?.toFixed(0)}g
                  </span>
                </p>
              </div>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <Target className="text-green-500" size={32} />
              </div>
            </div>
            <div className="w-full bg-background/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${Math.min(proteinProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {proteinProgress.toFixed(0)}% del objetivo diario
            </p>
          </div>
        </div>
      )}

      {/* Macros Breakdown */}
      {profile && summary && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Desglose de Macros</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {summary.total_protein?.toFixed(0) || 0}g
              </p>
              <p className="text-xs text-muted-foreground mt-1">Proteína</p>
              <p className="text-xs text-muted-foreground">
                Meta: {profile.daily_protein_target_g?.toFixed(0)}g
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {summary.total_carbs?.toFixed(0) || 0}g
              </p>
              <p className="text-xs text-muted-foreground mt-1">Carbohidratos</p>
              <p className="text-xs text-muted-foreground">
                Meta: {profile.daily_carbs_target_g?.toFixed(0)}g
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">
                {summary.total_fats?.toFixed(0) || 0}g
              </p>
              <p className="text-xs text-muted-foreground mt-1">Grasas</p>
              <p className="text-xs text-muted-foreground">
                Meta: {profile.daily_fats_target_g?.toFixed(0)}g
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metabolic Info */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale size={18} className="text-primary" />
              <p className="text-sm text-muted-foreground">Peso Actual</p>
            </div>
            <p className="text-2xl font-bold">
              {profile.current_weight_kg?.toFixed(1) || '--'} kg
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={18} className="text-primary" />
              <p className="text-sm text-muted-foreground">TDEE</p>
            </div>
            <p className="text-2xl font-bold">
              {profile.tdee?.toFixed(0) || '--'} cal
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-primary" />
              <p className="text-sm text-muted-foreground">Objetivo</p>
            </div>
            <p className="text-2xl font-bold capitalize">{profile.goal}</p>
          </div>
        </div>
      )}

      {/* Today's Meals */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Comidas de Hoy</h3>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No has registrado comidas hoy</p>
            <p className="text-sm text-muted-foreground mt-1">
              Usa el botón "Escanear Comida" para empezar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
              >
                <div className="flex items-center gap-4">
                  {log.ai_provider && (
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Sparkles className="text-primary" size={20} />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{log.food_name || 'Sin nombre'}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {log.meal_type} •{' '}
                      {new Date(log.logged_at).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{log.calories} cal</p>
                  <p className="text-xs text-muted-foreground">
                    P: {log.protein_g}g • C: {log.carbs_g}g • F: {log.fats_g}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ScanFoodModal isOpen={showScanModal} onClose={handleModalClose} />
    </div>
  );
}
