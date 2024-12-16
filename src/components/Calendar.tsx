import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getDaysInMonth, startOfMonth, format, addMonths, subMonths } from './dateUtils';
import AppointmentModal from './AppointmentModal';

export default function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Array<{
    id: string;
    date: Date;
    title: string;
    time: string;
  }>>([]);

  const days = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate).getDay();

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddAppointment = (appointment: { title: string; time: string }) => {
    if (!selectedDate) return;
    
    setAppointments([
      ...appointments,
      {
        id: Math.random().toString(36).substr(2, 9),
        date: selectedDate,
        ...appointment
      }
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-blue-500 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-blue-500 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-4 text-center text-gray-600 font-semibold">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-white p-4" />
          ))}
          
          {days.map((date, index) => {
            const dayAppointments = appointments.filter(
              app => format(app.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            );
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className="bg-white p-4 min-h-[100px] cursor-pointer hover:bg-blue-50 transition-colors relative"
              >
                <span className={`
                  text-sm font-medium
                  ${format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    ? 'text-white bg-blue-600 rounded-full w-7 h-7 flex items-center justify-center'
                    : 'text-gray-700'}
                `}>
                  {format(date, 'd')}
                </span>
                
                {dayAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="mt-1 p-1 text-xs bg-blue-100 text-blue-700 rounded truncate"
                  >
                    {appointment.time} - {appointment.title}
                  </div>
                ))}
                
                <button
                  className="absolute bottom-2 right-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDateClick(date);
                  }}
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAppointment}
        selectedDate={selectedDate}
      />
    </div>
  );
}