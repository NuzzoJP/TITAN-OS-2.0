'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Flame, GraduationCap, Clock, TrendingUp, AlertCircle, Target, Calendar } from 'lucide-react';
import { usePrivacy } from '@/lib/contexts/privacy-context';
import { OmniFAB } from '@/components/home/command-palette';
import {
  getDailySafeToSpend,
  getTotalBalance,
  getMonthlyExpenses,
} from '@/lib/actions/finance';
import {
  getDailyNutritionSummary,
  getMetabolicProfile,
  getRecentHealthStats,
} from '@/lib/actions/nutrition';
import {
  getActiveTerm,
} from '@/lib/actions/wisdom';
import {
  getUpcomingEvents,
  getTodayEvents,
} from '@/lib/actions/chronos';
import { formatCurrency } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function DashboardPage() {
  const { privacyMode } = usePrivacy();
  const [loading, setLoading] = useState(true);
  
  // Finance data
  const [dailySafe, setDailySafe] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  
  // Health data
  const [nutritionSummary, setNutritionSummary] = useState<any>(null);
  const [metabolicProfile, setMetabolicProfile] = useState<any>(null);
  const [latestWeight, setLatestWeight] = useState<any>(null);
  
  // Wisdom data
  const [activeTerm, setActiveTerm] = useState<any>(null);
  
  // Chronos data
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [todayEvents, setTodayEvents] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        safe,
        balance,
        expenses,
        nutrition,
        profile,
        healthStats,
        term,
        upcoming,
        today,
      ] = await Promise.all([
        getDailySafeToSpend(),
        getTotalBalance(),
        getMonthlyExpenses(),
        getDailyNutritionSummary(),
        getMetabolicProfile(),
        getRecentHealthStats(1),
        getActiveTerm(),
        getUpcomingEvents(3),
        getTodayEvents(),
      ]);

      setDailySafe(safe);
      setTotalBalance(balance);
      setMonthlyExpenses(expenses);
      setNutritionSummary(nutrition);
      setMetabolicProfile(profile);
      setLatestWeight(healthStats[0] || null);
      setActiveTerm(term);
      setUpcomingEvents(upcoming);
      setTodayEvents(today);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-card border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const caloriesRemaining = metabolicProfile?.daily_calorie_target
    ? metabolicProfile.daily_calorie_target - (nutritionSummary?.total_calories || 0)
    : 0;

  const calorieProgress = metabolicProfile?.daily_calorie_target
    ? ((nutritionSummary?.total_calories || 0) / metabolicProfile.daily_calorie_target) * 100
    : 0;

  const nextEvent = upcomingEvents[0];
  const currentEvent = todayEvents.find((e) => {
    const now = new Date();
    const start = new Date(e.start_time);
    const end = e.end_time ? new Date(e.end_time) : null;
    return start <= now && (!end || end >= now);
  });

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Centro de Mando</h1>
        <p className="text-muted-foreground">
          Vista general de tu vida en tiempo real
        </p>
      </div>

      {/* The Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. FINANCE CARD */}
        <Link href="/dashboard/finance">
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-colors cursor-pointer h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="text-green-500" size={24} />
                <h3 className="text-lg font-semibold">Finance</h3>
              </div>
              <div className="text-xs text-muted-foreground">El Combustible</div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Puedes gastar hoy</p>
                <p className={`text-4xl font-bold font-mono ${privacyMode ? 'blur-md' : ''}`}>
                  {formatCurrency(dailySafe)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Balance Total</span>
                  <span className={`font-mono ${privacyMode ? 'blur-md' : ''}`}>
                    {formatCurrency(totalBalance)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gastado este mes</span>
                  <span className={`font-mono ${privacyMode ? 'blur-md' : ''}`}>
                    {formatCurrency(monthlyExpenses)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-green-500">
                <TrendingUp size={16} />
                <span>Ver detalles →</span>
              </div>
            </div>
          </div>
        </Link>

        {/* 2. HEALTH CARD */}
        <Link href="/dashboard/health">
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-colors cursor-pointer h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="text-cyan-500" size={24} />
                <h3 className="text-lg font-semibold">Health</h3>
              </div>
              <div className="text-xs text-muted-foreground">El Motor</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Fuel (Nutrition) */}
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Calorías Restantes</p>
                <p className={`text-2xl font-bold font-mono ${privacyMode ? 'blur-md' : ''}`}>
                  {caloriesRemaining > 0 ? caloriesRemaining.toFixed(0) : 0}
                </p>
                <div className="mt-2 w-full bg-background rounded-full h-2">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Machine (Weight) */}
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Peso Actual</p>
                <p className={`text-2xl font-bold font-mono ${privacyMode ? 'blur-md' : ''}`}>
                  {latestWeight ? `${latestWeight.weight_kg} kg` : '--'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {latestWeight
                    ? formatDistanceToNow(new Date(latestWeight.measured_at), {
                        addSuffix: true,
                        locale: es,
                      })
                    : 'Sin datos'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-cyan-500 mt-4">
              <Target size={16} />
              <span>Ver detalles →</span>
            </div>
          </div>
        </Link>

        {/* 3. WISDOM CARD */}
        <Link href="/dashboard/wisdom">
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-lg p-6 hover:border-amber-500/40 transition-colors cursor-pointer h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="text-amber-500" size={24} />
                <h3 className="text-lg font-semibold">Wisdom</h3>
              </div>
              <div className="text-xs text-muted-foreground">El Cerebro</div>
            </div>

            {activeTerm ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Promedio del Semestre</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-4xl font-bold font-mono ${privacyMode ? 'blur-md' : ''}`}>
                      {activeTerm.term_average.toFixed(2)}
                    </p>
                    <span className="text-lg text-muted-foreground">/ 20</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeTerm.term_average >= 16 ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm">Excelente</span>
                    </div>
                  ) : activeTerm.term_average >= 12 ? (
                    <div className="flex items-center gap-2 text-yellow-500">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm">Bien</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-500 animate-pulse">
                      <AlertCircle size={16} />
                      <span className="text-sm">Riesgo</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  Semestre: {activeTerm.name}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay semestre activo</p>
                <p className="text-sm text-muted-foreground mt-2">Crea uno para empezar</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-amber-500 mt-4">
              <GraduationCap size={16} />
              <span>Ver detalles →</span>
            </div>
          </div>
        </Link>

        {/* 4. CHRONOS CARD */}
        <Link href="/dashboard/chronos">
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition-colors cursor-pointer h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="text-purple-500" size={24} />
                <h3 className="text-lg font-semibold">Chronos</h3>
              </div>
              <div className="text-xs text-muted-foreground">El Radar</div>
            </div>

            <div className="space-y-4">
              {currentEvent ? (
                <div className="bg-background/50 rounded-lg p-4">
                  <p className="text-xs text-purple-500 mb-2">AHORA</p>
                  <p className="font-semibold">{currentEvent.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(currentEvent.start_time), 'HH:mm', { locale: es })} -{' '}
                    {currentEvent.end_time
                      ? format(new Date(currentEvent.end_time), 'HH:mm', { locale: es })
                      : 'Sin fin'}
                  </p>
                </div>
              ) : (
                <div className="bg-background/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Sin eventos activos</p>
                </div>
              )}

              {nextEvent ? (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">PRÓXIMO</p>
                  <p className="font-semibold">{nextEvent.title}</p>
                  <p className="text-sm text-purple-500 mt-1">
                    {formatDistanceToNow(new Date(nextEvent.start_time), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">No hay eventos próximos</p>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                {todayEvents.length} eventos hoy
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-purple-500 mt-4">
              <Calendar size={16} />
              <span>Ver calendario →</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Omni-FAB */}
      <OmniFAB />
    </div>
  );
}
