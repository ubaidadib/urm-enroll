import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/language-context";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export function Breadcrumbs({ items = [], className }: { items?: BreadcrumbItem[]; className?: string }) {
  const { t } = useLanguage();
  if (!items.length) return null;

  return (
    <nav aria-label={t<string>("common.breadcrumb")} className={`text-sm ${className ?? ""}`}>
      <ol className="flex flex-wrap items-center gap-2 text-text-muted">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-text-muted/60">/</span>}
            <Link
              to={item.href}
              className="hover:text-text-primary transition-colors"
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
