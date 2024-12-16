import React from 'react';
import { Gamepad2, Clock } from 'lucide-react';
import BookingCalendar from './components/BookingCalendar';
import BookingList from './components/BookingList';
import { BookingProvider } from './contexts/BookingContext';

function App() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Gamepad2 className="w-8 h-8 text-purple-500" />
                <h1 className="text-2xl font-bold text-white">Gaming club Aš</h1>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <p className="text-sm">Open 10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <BookingCalendar />
            </div>
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4">Gaming Session Info</h2>
                <div className="space-y-4">
                  <p className="text-sm text-gray-300 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>
                    <span>Gaming sessions are 60 minutes</span>
                  </p>
                  <p className="text-sm text-gray-300 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>
                    <span>Available 7 days a week, 10 AM - 10 PM</span>
                  </p>
                  <p className="text-sm text-gray-300 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>
                    <span>Book at least 1 hour in advance</span>
                  </p>
                  <p className="text-sm text-gray-300 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>
                    <span>Free cancellation up to 2 hours before</span>
                  </p>
                </div>
              </div>
              <BookingList />
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-purple-400 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-300">
                  Contact us at helpcallcz@gmail.com for assistance with booking.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BookingProvider>
  );
}

export default App;