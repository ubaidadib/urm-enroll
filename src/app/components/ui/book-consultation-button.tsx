import { useBookingModal } from './booking-modal';
import { useLanguage } from '@/i18n/language-context';
import { Calendar } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BookConsultationButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
} as const;

const variantClasses = {
  primary:
    'bg-[var(--accent-primary)] text-[var(--ink)] font-bold transition-all duration-300 rounded-[var(--border-radius-md)] hover:bg-[var(--accent-primary-strong)] hover:shadow-md active:scale-[0.98] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]',
  secondary:
    'border border-[var(--accent-primary)] bg-transparent text-[var(--accent-primary)] font-bold transition-all duration-300 rounded-[var(--border-radius-md)] hover:bg-[var(--accent-primary)]/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]',
  ghost:
    'bg-transparent text-[var(--accent-primary)] font-bold transition-all duration-300 hover:text-[var(--accent-primary-strong)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]',
} as const;

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

/**
 * Calendar Icon SVG Component
 */
function CalendarIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

export function BookConsultationButton({
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}: BookConsultationButtonProps) {
  const { openBooking } = useBookingModal();
  const { t } = useLanguage();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    openBooking();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 font-semibold ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={t<string>('booking.ariaLabel')}
    >
      <CalendarIcon className={iconSizes[size]} />
      <span>{t<string>('booking.cta')}</span>
    </button>
  );
}
