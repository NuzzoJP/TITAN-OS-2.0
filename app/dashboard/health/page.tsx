'use client';

import { useState } from 'react';
import { Dumbbell, Utensils, ListChecks, TrendingUp } from 'lucide-react';
import { GymDashboard } from '@/components/health/gym-dashboard';
import { NutritionDashboard } from '@/components/health/nutrition-dashboard';
import { RoutinesManager } from '@/components/health/routines-manager';
import { ProgressDashboard } from '@/components/health/progress-dashboard';

type Tab = 'gym' | 'routines' | 'progress' | 'nutrition';

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState<Tab>('gym');

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Titan Health</h1>
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          <TabButton
            active={activeTab === 'gym'}
            onClick={() => setActiveTab('gym')}
            icon={<Dumbbell size={20} />}
            label="Gym Tracker"
          />
          <TabButton
            active={activeTab === 'routines'}
            onClick={() => setActiveTab('routines')}
            icon={<ListChecks size={20} />}
            label="Rutinas"
          />
          <TabButton
            active={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
            icon={<TrendingUp size={20} />}
            label="Progreso"
          />
          <TabButton
            active={activeTab === 'nutrition'}
            onClick={() => setActiveTab('nutrition')}
            icon={<Utensils size={20} />}
            label="Titan Fuel AI"
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === 'gym' && <GymDashboard />}
      {activeTab === 'routines' && <RoutinesManager />}
      {activeTab === 'progress' && <ProgressDashboard />}
      {activeTab === 'nutrition' && <NutritionDashboard />}
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
