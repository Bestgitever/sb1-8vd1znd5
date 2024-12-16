import React from 'react';
import { useBooking } from '../contexts/BookingContext';
import { format } from '../utils/dateUtils';
import { Monitor, Gamepad, Clock, X, Crown, Target, Mic2 } from 'lucide-react';

export default function BookingList() {
  const { bookings, removeBooking } = useBooking();
  
  const getBookingIcon = (type: 'pc' | 'playstation' | 'billiards' | 'karaoke') => {
    switch (type) {
      case 'pc':
        return <Monitor className="w-4 h-4 text-purple-400" />;
      case 'playstation':
        return <Gamepad className="w-4 h-4 text-purple-400" />;
      case 'billiards':
        return <Target className="w-4 h-4 text-purple-400" />;
      case 'karaoke':
        return <Mic2 className="w-4 h-4 text-purple-400" />;
    }
  };

  const getQuantityLabel = (type: 'pc' | 'playstation' | 'billiards' | 'karaoke') => {
    switch (type) {
      case 'pc':
        return 'PCs';
      case 'karaoke':
        return 'Rooms';
      default:
        return '';
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => a.date.getTime() - b.date.getTime());

  if (bookings.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <p className="text-gray-400 text-center">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Your Bookings</h2>
      </div>
      <div className="divide-y divide-gray-700">
        {sortedBookings.map((booking) => (
          <div key={booking.id} className="p-4 hover:bg-gray-750">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">{getBookingIcon(booking.type)}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-medium">{booking.name}</p>
                    {booking.isMember && (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>{format(booking.date, 'MMMM d, yyyy')}</span>
                    <span>•</span>
                    <span>{booking.timeSlot}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {booking.duration}
                    </span>
                    {booking.quantity && booking.quantity > 1 && (
                      <>
                        <span>•</span>
                        <span>{booking.quantity} {getQuantityLabel(booking.type)}</span>
                      </>
                    )}
                  </div>
                  {booking.description && (
                    <p className="mt-1 text-sm text-gray-300">{booking.description}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => removeBooking(booking.id)}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                title="Cancel booking"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}