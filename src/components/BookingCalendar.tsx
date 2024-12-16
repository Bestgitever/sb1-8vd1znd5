import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { getDaysInMonth, startOfMonth, format, addMonths, subMonths, addDays } from '../utils/dateUtils';
import TimeSlotPicker from './TimeSlotPicker';
import BookingForm from './BookingForm';
import type { BookingType } from '../contexts/BookingContext';

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [showBookingForm, setShowBookingForm] = React.useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<string | null>(null);
  const [selectedBookingType, setSelectedBookingType] = React.useState<BookingType>('pc');
  
  const { selectedDate, setSelectedDate, getAvailableSlots } = useBooking();

  const days = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate).getDay();
  const tomorrow = addDays(new Date(), 1);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    if (date >= tomorrow) {
      setSelectedDate(date);
      setSelectedTimeSlot(null);
      setShowBookingForm(false);
    }
  };

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
    setShowBookingForm(true);
  };

  const handleCloseForm = () => {
    setShowBookingForm(false);
    setSelectedTimeSlot(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900 to-purple-700">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-purple-600 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">
            {format(currentDate, 'MM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-purple-600 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-800 p-2 text-center text-gray-400 text-sm font-semibold">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-gray-800 p-2" />
          ))}
          
          {days.map((date, index) => {
            const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const isPast = date < tomorrow;
            const availableSlots = getAvailableSlots(date, selectedBookingType);
            const hasAvailability = availableSlots.some(slot => slot.available);
            
            return (
              <div
                key={index}
                onClick={() => !isPast && handleDateClick(date)}
                className={`
                  bg-gray-800 p-2 min-h-[80px] relative
                  ${isPast ? 'cursor-not-allowed opacity-50' : hasAvailability ? 'cursor-pointer hover:bg-gray-700' : 'cursor-not-allowed opacity-75'}
                  ${isSelected ? 'ring-2 ring-purple-500 ring-inset' : ''}
                `}
              >
                <span className={`
                  inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full
                  ${isToday ? 'bg-purple-600 text-white' : 'text-gray-300'}
                `}>
                  {format(date, 'd')}
                </span>
                
                {!isPast && hasAvailability && (
                  <div className="mt-1 text-xs text-purple-400">
                    {availableSlots.filter(slot => slot.available).length} slots
                  </div>
                )}

                {isPast && (
                  <div className="mt-1 text-xs text-gray-500">
                    Unavailable
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && !showBookingForm && (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <TimeSlotPicker
            date={selectedDate}
            onSelect={handleTimeSlotSelect}
            selectedTime={selectedTimeSlot}
            selectedBookingType={selectedBookingType}
            onBookingTypeChange={setSelectedBookingType}
          />
        </div>
      )}

      {showBookingForm && selectedDate && selectedTimeSlot && (
        <BookingForm
          date={selectedDate}
          timeSlot={selectedTimeSlot}
          onClose={handleCloseForm}
          initialBookingType={selectedBookingType}
        />
      )}
    </div>
  );
}