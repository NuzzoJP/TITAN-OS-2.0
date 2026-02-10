'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import {
  getAllEvents,
  getEventStats,
  deleteEvent,
} from '@/lib/actions/chronos';
import type { ChronosEvent } from '@/lib/actions/chronos';
import { getEventColor } from '@/lib/utils/chronos-utils';
import { AddEventModal } from '@/components/chronos/add-event-modal';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: ChronosEvent;
}

export default function ChronosPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    monthEvents: 0,
    wisdomEvents: 0,
    financeEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsData, statsData] = await Promise.all([
        getAllEvents(),
        getEventStats(),
      ]);

      // Convertir eventos a formato de react-big-calendar
      const calendarEvents: CalendarEvent[] = eventsData.map((event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : new Date(event.start_time),
        allDay: event.is_all_day,
        resource: event,
      }));

      setEvents(calendarEvents);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading chronos data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setSelectedDate(undefined);
    loadData();
  };

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
    setShowAddModal(true);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    // Mostrar detalles del evento
    const confirmDelete = window.confirm(
      `¿Eliminar evento "${event.title}"?\n\nNota: Los eventos sincronizados de Wisdom/Finance deben eliminarse desde su módulo original.`
    );
    
    if (confirmDelete && event.resource.source_type === 'manual') {
      deleteEvent(event.id).then(() => loadData());
    }
  }, []);

  // Estilos personalizados para eventos
  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = getEventColor(event.resource);
    const isHardBlock = event.resource.source_type === 'wisdom' || event.resource.category === 'hard';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: isHardBlock ? '2px solid #dc2626' : 'none',
        display: 'block',
        fontWeight: isHardBlock ? 'bold' : 'normal',
      },
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chronos</h1>
          <p className="text-muted-foreground">Calendario maestro y gestión de tiempo</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Nuevo Evento</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Eventos</p>
            <CalendarIcon className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.totalEvents}</p>
          <p className="text-xs text-muted-foreground mt-1">Registrados</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Este Mes</p>
            <Clock className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold">{stats.monthEvents}</p>
          <p className="text-xs text-muted-foreground mt-1">Eventos programados</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Exámenes</p>
            <AlertCircle className="text-red-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-red-500">{stats.wisdomEvents}</p>
          <p className="text-xs text-muted-foreground mt-1">Hard blocks</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pagos</p>
            <CheckCircle className="text-yellow-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-yellow-500">{stats.financeEvents}</p>
          <p className="text-xs text-muted-foreground mt-1">Deadlines</p>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm font-medium mb-3">Leyenda de Colores</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-600" />
            <span className="text-sm">Hard Block (Exámenes - No movible)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-sm">Soft Block (Flexible)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-sm">Finance (Pagos)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm">Health (Entrenamientos)</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            messages={{
              next: 'Siguiente',
              previous: 'Anterior',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay eventos en este rango',
              showMore: (total) => `+ Ver más (${total})`,
            }}
            formats={{
              dayHeaderFormat: (date) => moment(date).format('dddd DD/MM'),
              dayRangeHeaderFormat: ({ start, end }) =>
                `${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`,
              monthHeaderFormat: (date) => moment(date).format('MMMM YYYY'),
              weekdayFormat: (date) => moment(date).format('ddd'),
            }}
          />
        </div>
      </div>

      <AddEventModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        defaultDate={selectedDate}
      />
    </div>
  );
}
