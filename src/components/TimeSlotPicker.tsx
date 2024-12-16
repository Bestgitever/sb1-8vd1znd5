import React from 'react';
import { useBooking } from '../contexts/BookingContext';
import { format } from '../utils/dateUtils';
import type { BookingType } from '../contexts/BookingContext';
import { Monitor, Gamepad, Target, Mic2 } from 'lucide-react';

interface TimeSlotPickerProps {
  date: Date;
  onSelect: (time: string) => void;
  selectedTime: string | null;
  selectedBookingType: BookingType;
  onBookingTypeChange: (type: BookingType) => void;
}

const BOOKING_TYPES: { type: BookingType; label: string; icon: React.ReactNode }[] = [
  { type: 'pc', label: 'PC Gaming', icon: <Monitor className="w-4 h-4" /> },
  { type: 'playstation', label: 'PlayStation', icon: <Gamepad className="w-4 h-4" /> },
  { type: 'billiards', label: 'Billiards', icon: <Target className="w-4 h-4" /> },
  { type: 'karaoke', label: 'Karaoke', icon: <Mic2 className="w-4 h-4" /> }
];

export default function TimeSlotPicker({ 
  date, 
  onSelect, 
  selectedTime,
  selectedBookingType,
  onBookingTypeChange
}: TimeSlotPickerProps) {
  const { getAvailableSlots } = useBooking();
  const availableSlots = getAvailableSlots(date, selectedBookingType);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Choose a time for {format(date, 'MMMM d, yyyy')}
        </h3>
        
        <div className="grid grid-cols-2 gap-2 mb-6">
          {BOOKING_TYPES.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => onBookingTypeChange(type)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                ${selectedBookingType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              <span className={selectedBookingType === type ? 'text-white' : 'text-purple-400'}>
                {icon}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {availableSlots.map(({ id, time, available }) => (
          <button
            key={id}
            onClick={() => available && onSelect(time)}
            disabled={!available}
            className={`
              p-3 text-sm font-medium rounded-lg transition-colors
              ${available
                ? selectedTime === time
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-900 text-gray-500 cursor-not-allowed'}
            `}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}