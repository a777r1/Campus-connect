import React from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Event } from '../../types';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const navigate = useNavigate();

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(`${event.date}T${event.time}`),
    end: new Date(new Date(`${event.date}T${event.time}`).getTime() + 2 * 60 * 60 * 1000), // Default 2 hours
    resource: event,
  }));

  const handleSelectEvent = (event: any) => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="h-[700px] w-full p-4 sm:p-8 bg-white dark:bg-[#1a1a2e] rounded-[2.5rem]">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleSelectEvent}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.MONTH}
        eventPropGetter={() => ({
          className: "!bg-slate-900 dark:!bg-white !border-slate-900 dark:!border-white !text-white dark:!text-slate-900 !font-bold !rounded-lg !text-xs !px-2 !py-1 !shadow-sm hover:!bg-slate-800 dark:hover:!bg-slate-100 transition-all"
        })}
        dayPropGetter={(date) => ({
          className: "hover:bg-slate-50 dark:hover:bg-[#16213e] transition-colors"
        })}
      />
      <style>{`
        .rbc-calendar { font-family: inherit; }
        .rbc-header { padding: 12px 0; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .rbc-toolbar { margin-bottom: 24px; }
        .rbc-toolbar button { border-radius: 0.75rem; font-weight: 600; transition: all 0.2s; }
        
        /* Light mode calendar */
        .rbc-header { color: #64748b; border-bottom: 2px solid #f1f5f9; }
        .rbc-toolbar button { border: 1px solid #e2e8f0; color: #64748b; }
        .rbc-toolbar button:active, .rbc-toolbar button.rbc-active { background-color: #1a1a1a !important; color: white !important; border-color: #1a1a1a !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2); }
        .rbc-toolbar button:hover { background-color: #f8fafc; color: #0f172a; }
        .rbc-month-view { border-radius: 1.5rem; border: 1px solid #f1f5f9; overflow: hidden; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f1f5f9; }
        .rbc-month-row + .rbc-month-row { border-top: 1px solid #f1f5f9; }
        .rbc-off-range-bg { background-color: #f8fafc; }
        .rbc-today { background-color: #f0f0f0; }
        .rbc-date-cell { color: #1a1a1a; }
        
        /* Dark mode calendar */
        html.dark .rbc-header { color: #9ca3af; border-bottom-color: #2a2a3e; }
        html.dark .rbc-toolbar button { border-color: #2a2a3e; color: #9ca3af; background: transparent; }
        html.dark .rbc-toolbar button:hover { background-color: #16213e; color: #f0f0f0; }
        html.dark .rbc-toolbar button:active, html.dark .rbc-toolbar button.rbc-active { background-color: #ffffff !important; color: #1a1a1a !important; border-color: #ffffff !important; }
        html.dark .rbc-month-view { border-color: #2a2a3e; }
        html.dark .rbc-day-bg + .rbc-day-bg { border-left-color: #2a2a3e; }
        html.dark .rbc-month-row + .rbc-month-row { border-top-color: #2a2a3e; }
        html.dark .rbc-off-range-bg { background-color: #0d0d0d; }
        html.dark .rbc-today { background-color: #16213e; }
        html.dark .rbc-date-cell { color: #f0f0f0; }
        html.dark .rbc-off-range { color: #4a4a5a; }
        html.dark .rbc-toolbar-label { color: #f0f0f0; }
        html.dark .rbc-btn-group button { color: #9ca3af; }
        html.dark .rbc-event { background: #ffffff !important; color: #1a1a1a !important; }
      `}</style>
    </div>
  );
}
