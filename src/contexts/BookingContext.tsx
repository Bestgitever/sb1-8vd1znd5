import React, { createContext, useContext, useState } from 'react';
import { addDays, isSameDay } from '../utils/dateUtils';
import { sendBookingNotification } from '../utils/emailService';

export type BookingType = 'pc' | 'playstation' | 'billiards' | 'karaoke';
export type Duration = '1h' | '2h' | '3h' | '4h';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  availablePCs?: number;
  availableTables?: number;
  availableRooms?: number;
}

interface Booking {
  id: string;
  date: Date;
  timeSlot: string;
  duration: Duration;
  name: string;
  email: string;
  phone: string;
  description?: string;
  type: BookingType;
  quantity?: number;
  isMember?: boolean;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  removeBooking: (id: string) => void;
  getAvailableSlots: (date: Date, type: BookingType) => TimeSlot[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  isMember: boolean;
  setIsMember: (value: boolean) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const DEFAULT_TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', 
  '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const MAX_BOOKINGS_PER_TYPE = {
  pc: 5,
  playstation: 3,
  billiards: 1,
  karaoke: 1
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMember, setIsMember] = useState(false);

  const addBooking = async (booking: Omit<Booking, 'id'>) => {
    const newBooking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      isMember
    };

    const emailSent = await sendBookingNotification(newBooking);
    if (!emailSent) {
      console.warn('Booking created but notification email could not be sent.');
    }

    setBookings(prevBookings => [...prevBookings, newBooking]);
  };

  const removeBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const getAvailableSlots = (date: Date, type: BookingType): TimeSlot[] => {
    const tomorrow = addDays(new Date(), 1);
    if (date < tomorrow) return [];

    return DEFAULT_TIME_SLOTS.map(time => {
      const sameTimeBookings = bookings.filter(
        booking => isSameDay(booking.date, date) && booking.timeSlot === time && booking.type === type
      );

      const bookedQuantity = sameTimeBookings.reduce((sum, booking) => sum + (booking.quantity || 1), 0);
      const availableQuantity = MAX_BOOKINGS_PER_TYPE[type] - bookedQuantity;

      return {
        id: `${date.toISOString()}-${time}`,
        time,
        available: availableQuantity > 0,
        availablePCs: type === 'pc' ? availableQuantity : undefined,
        availableTables: type === 'billiards' ? availableQuantity : undefined,
        availableRooms: type === 'karaoke' ? availableQuantity : undefined
      };
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        removeBooking,
        getAvailableSlots,
        selectedDate,
        setSelectedDate,
        isMember,
        setIsMember
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}