import React from 'react';
import { useBooking } from '../contexts/BookingContext';
import { format } from '../utils/dateUtils';
import type { BookingType, Duration } from '../contexts/BookingContext';
import { Monitor, Gamepad, Clock, Minus, Plus, Crown, Target, Mic2, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  date: Date;
  timeSlot: string;
  onClose: () => void;
  initialBookingType: BookingType;
}

const BOOKING_TYPES: { type: BookingType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    type: 'pc',
    label: 'PC Gaming',
    icon: <Monitor className="w-5 h-5" />,
    description: 'High-end gaming PCs with latest titles'
  },
  {
    type: 'playstation',
    label: 'PlayStation',
    icon: <Gamepad className="w-5 h-5" />,
    description: 'PS5 consoles with multiple games'
  },
  {
    type: 'billiards',
    label: 'Billiards',
    icon: <Target className="w-5 h-5" />,
    description: 'Professional billiard table'
  },
  {
    type: 'karaoke',
    label: 'Karaoke',
    icon: <Mic2 className="w-5 h-5" />,
    description: 'Private karaoke rooms with latest songs'
  }
];

const BASE_DURATIONS: { value: Duration; label: string; price: number }[] = [
  { value: '1h', label: '1 Hour', price: 3 },
  { value: '2h', label: '2 Hours', price: 6 },
  { value: '3h', label: '3 Hours', price: 9 },
  { value: '4h', label: '4 Hours', price: 12 }
];

export default function BookingForm({ date, timeSlot, onClose, initialBookingType }: BookingFormProps) {
  const { addBooking, getAvailableSlots, isMember, setIsMember } = useBooking();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [bookingType, setBookingType] = React.useState<BookingType>(initialBookingType);
  const [duration, setDuration] = React.useState<Duration>('1h');
  const [quantity, setQuantity] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const DURATIONS = BASE_DURATIONS.map(d => ({
    ...d,
    price: isMember ? d.price * 0.33 : d.price
  }));

  const selectedDuration = DURATIONS.find(d => d.value === duration);
  const availableSlots = getAvailableSlots(date, bookingType);
  const currentSlot = availableSlots.find(slot => slot.time === timeSlot);
  const maxItems = bookingType === 'pc' 
    ? currentSlot?.availablePCs || 0 
    : bookingType === 'karaoke'
      ? 1
      : 1;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newValue = prev + delta;
      return Math.max(1, Math.min(newValue, maxItems));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      addBooking({
        date,
        timeSlot,
        duration,
        name,
        email,
        phone,
        description,
        type: bookingType,
        quantity: bookingType === 'playstation' || bookingType === 'billiards' ? 1 : quantity
      });

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to complete booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showQuantitySelector = bookingType === 'pc' || bookingType === 'karaoke';
  const quantityLabel = bookingType === 'pc' ? 'PCs' : 'Rooms';

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Book Your Session
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-300">
            {format(date, 'MMMM d, yyyy')} at {timeSlot}
          </p>
          {selectedDuration && (
            <p className="text-sm font-medium text-purple-400">
              ${(selectedDuration.price * (showQuantitySelector ? quantity : 1)).toFixed(2)} for {selectedDuration.label}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isMember}
              onChange={(e) => setIsMember(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded border-gray-500 focus:ring-purple-500"
            />
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Member (67% off all bookings)</span>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {BOOKING_TYPES.map(({ type, label, icon, description }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setBookingType(type);
                setQuantity(1);
              }}
              className={`
                p-4 rounded-lg border text-left transition-colors
                ${bookingType === type
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={bookingType === type ? 'text-white' : 'text-purple-400'}>
                  {icon}
                </div>
                <span className="font-medium">{label}</span>
              </div>
              <p className="text-sm opacity-75">{description}</p>
            </button>
          ))}
        </div>

        {showQuantitySelector && (
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of {quantityLabel} ({maxItems} available)
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-1.5 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxItems}
                className="p-1.5 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DURATIONS.map(({ value, label, price }) => (
            <button
              key={value}
              type="button"
              onClick={() => setDuration(value)}
              className={`
                p-3 rounded-lg border text-center transition-colors
                ${duration === value
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              <Clock className={`w-5 h-5 mx-auto mb-1 ${duration === value ? 'text-white' : 'text-purple-400'}`} />
              <div className="font-medium">{label}</div>
              <div className="text-sm opacity-75">
                ${(price * (showQuantitySelector ? quantity : 1)).toFixed(2)}
                {isMember && <span className="text-yellow-400 ml-1">★</span>}
              </div>
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400
              focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(+420) 555 555 555"
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400
              focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400
              focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Special Requests
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any specific requirements or preferences?"
            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400
              focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg
              ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-purple-700'}
            `}
          >
            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}