import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { initPopupWidget } from '../../utils/calendly-embed';
import { getCalendlyUrl } from '../../utils/calendly-embed';
import { useLanguage } from '@/i18n/language-context';

interface BookingModalContextValue {
  openBooking: () => void;
  isOpen: boolean;
}

const BookingModalContext = createContext<BookingModalContextValue | undefined>(undefined);

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  // scriptLoaded state not needed — loader handles single load and queuing

  const calendlyUrl = getCalendlyUrl(import.meta.env.VITE_CALENDLY_URL);

  const openBooking = useCallback(() => {
    setIsOpen(true);
    // Use the loader which returns a singleton promise and then init the popup.
    initPopupWidget(calendlyUrl);
  }, [calendlyUrl]);

  return (
    <BookingModalContext.Provider value={{ openBooking, isOpen }}>
      {children}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal(): BookingModalContextValue {
  const context = useContext(BookingModalContext);
  if (context === undefined) {
    throw new Error('useBookingModal must be used within BookingModalProvider');
  }
  return context;
}
