'use client';

import { useState } from 'react';
import { Dumbbell, Utensils } from 'lucide-react';
import { GymDashboard } from '@/components/health/gym-dashboard';
import { NutritionDashboard } from '@/components/health/nutrition-dashboard';

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState<'gym' | 'nutrition'>('gym');

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Health</h1>
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('gym')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'gym'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Dumbbell size={20} />
            <span className="font-medium">Gym Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'nutrition'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Utensils size={20} />
            <span className="font-medium">Titan Fuel AI</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'gym' ? <GymDashboard /> : <NutritionDashboard />}
    </div>
  );
}
