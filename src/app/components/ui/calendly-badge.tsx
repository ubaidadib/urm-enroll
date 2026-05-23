import { useEffect } from 'react';
import { initBadgeWidget } from '../../utils/calendly-embed';

type Props = {
  url: string;
  text?: string;
  color?: string;
  textColor?: string;
  branding?: boolean;
};

export function CalendlyBadge({ url, text = 'Book time', color = '#00A2FF', textColor = '#fff', branding = true }: Props) {
  useEffect(() => {
    initBadgeWidget(url, { text, color, textColor, branding });

    return () => {
      // Remove fallback badge if one was created by our loader
      const el = document.getElementById('calendly-badge-fallback');
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };
  }, [url, text, color, textColor, branding]);

  return null;
}

export default CalendlyBadge;
