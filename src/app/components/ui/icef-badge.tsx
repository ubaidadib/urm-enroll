import { Award } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

interface IcefBadgeProps {
  size: "sm" | "md";
  className?: string;
}

export function IcefBadge({ size, className = "" }: IcefBadgeProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <a
      href="https://www.icef.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg border border-gold-500/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-slate-700 ${sizeClasses[size]} ${className}`}
      title={t<string>("icef.tooltip")}
      aria-label={`${t<string>("icef.accredited")} - ${t<string>("icef.tooltip")}`}
    >
      <Award className={`${iconSize} text-gold-500`} />
      <div className="text-center">
        <div className="font-semibold text-slate-900 dark:text-white leading-tight">
          {t<string>("icef.accredited")}
        </div>
        {size === "md" && (
          <div className="text-xs text-slate-600 dark:text-slate-300 leading-tight">
            {t<string>("icef.member")}
          </div>
        )}
      </div>
    </a>
  );
}
