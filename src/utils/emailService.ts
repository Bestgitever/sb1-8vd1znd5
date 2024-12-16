import emailjs from '@emailjs/browser';
import { format } from './dateUtils';

interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  date: Date;
  timeSlot: string;
  duration: string;
  type: string;
  quantity?: number;
  description?: string;
  isMember?: boolean;
}

const formatBookingType = (type: string): string => {
  const types = {
    pc: 'PC Gaming',
    playstation: 'PlayStation',
    billiards: 'Billiards',
    karaoke: 'Karaoke'
  };
  return types[type as keyof typeof types] || type;
};

const formatBookingDetails = (booking: BookingDetails): string => {
  return `
New Booking Details:
------------------
Name: ${booking.name}
Phone: ${booking.phone}
Email: ${booking.email}
Date: ${format(booking.date, 'MMMM d, yyyy')}
Time: ${booking.timeSlot}
Duration: ${booking.duration}
Type: ${formatBookingType(booking.type)}
${booking.quantity ? `Quantity: ${booking.quantity}` : ''}
${booking.isMember ? 'Member: Yes' : 'Member: No'}
${booking.description ? `\nSpecial Requests: ${booking.description}` : ''}
  `.trim();
};

export const sendBookingNotification = async (booking: BookingDetails): Promise<boolean> => {
  if (!import.meta.env.VITE_EMAILJS_SERVICE_ID || 
      !import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 
      !import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS configuration is missing. Please check your environment variables.');
    return false;
  }

  try {
    const templateParams = {
      to_email: 'helpcallcz@gmail.com',
      booking_details: formatBookingDetails(booking)
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      }
    );

    return true;
  } catch (error) {
    console.error('Failed to send booking notification:', error);
    return false;
  }
};