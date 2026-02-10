'use client';

import { useEffect, useState } from 'react';
import { Plus, GraduationCap, TrendingUp, BookOpen } from 'lucide-react';
import {
  getActiveTerm,
  getSubjectsByTerm,
  getTerms,
} from '@/lib/actions/wisdom';
import type { Term, Subject } from '@/lib/actions/wisdom';
import { SubjectCard } from '@/components/wisdom/subject-card';
import { AddTermModal } from '@/components/wisdom/add-term-modal';
import { AddSubjectModal } from '@/components/wisdom/add-subject-modal';

export default function WisdomPage() {
  const [activeTerm, setActiveTerm] = useState<Term | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const term = await getActiveTerm();
      setActiveTerm(term);

      if (term) {
        const subjectsData = await getSubjectsByTerm(term.id);
        setSubjects(subjectsData);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error loading wisdom data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowTermModal(false);
    setShowSubjectModal(false);
    loadData();
  };

  // Calcular estadísticas
  const totalUC = subjects.reduce((sum, s) => sum + s.credit_units, 0);
  const approvedSubjects = subjects.filter((s) => s.current_projection >= 10).length;
  const atRiskSubjects = subjects.filter((s) => s.current_projection < 10 && s.current_projection > 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!activeTerm) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wisdom</h1>
          <p className="text-muted-foreground">Gestión académica universitaria</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <GraduationCap size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No hay semestre activo</h2>
          <p className="text-muted-foreground mb-6">
            Crea tu primer semestre para comenzar a gestionar tus materias
          </p>
          <button
            onClick={() => setShowTermModal(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Crear Semestre
          </button>
        </div>

        <AddTermModal isOpen={showTermModal} onClose={handleModalClose} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{activeTerm.name}</h1>
          <p className="text-muted-foreground">Gestión académica universitaria</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTermModal(true)}
            className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <GraduationCap size={18} />
            <span>Cambiar Semestre</span>
          </button>
          <button
            onClick={() => setShowSubjectModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nueva Materia</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Term Average */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Promedio</p>
            <TrendingUp className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{activeTerm.term_average.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Escala 0-20</p>
        </div>

        {/* Total UC */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Unidades Crédito</p>
            <BookOpen className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{totalUC}</p>
          <p className="text-xs text-muted-foreground mt-1">{subjects.length} materias</p>
        </div>

        {/* Approved */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Aprobadas</p>
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <p className="text-3xl font-bold text-green-500">{approvedSubjects}</p>
          <p className="text-xs text-muted-foreground mt-1">≥ 10 puntos</p>
        </div>

        {/* At Risk */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">En Riesgo</p>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
          <p className="text-3xl font-bold text-red-500">{atRiskSubjects}</p>
          <p className="text-xs text-muted-foreground mt-1">{'< 10 puntos'}</p>
        </div>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">No hay materias registradas</h2>
          <p className="text-muted-foreground mb-6">
            Agrega tus materias para comenzar a gestionar tus notas
          </p>
          <button
            onClick={() => setShowSubjectModal(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar Materia
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddTermModal isOpen={showTermModal} onClose={handleModalClose} />
      {activeTerm && (
        <AddSubjectModal
          isOpen={showSubjectModal}
          onClose={handleModalClose}
          termId={activeTerm.id}
        />
      )}
    </div>
  );
}
