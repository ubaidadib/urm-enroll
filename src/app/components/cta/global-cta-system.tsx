import { Link } from "react-router-dom";
import { m } from "motion/react";
import { ArrowRight, MessageCircle, Sparkles, Users, GraduationCap, Stethoscope, Building2 } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { trackCTA, trackPersonalizationApplied } from "@/utils/tracking";
import { trackExperimentConversion } from "@/utils/tracking";
import { openPartnershipModal } from "@/lib/partnership-modal";
import { useExperiment } from "@/hooks/useExperiment";
import { usePersonalization } from "@/hooks/usePersonalization";
import {
  CTA_BANNER_ACTION_BASE,
  CTA_BUTTON_BASE,
  CTA_DARK,
  CTA_FOCUS_RING,
  CTA_INLINE_BASE,
  CTA_PRIMARY_ELEVATED,
  CTA_PRIMARY_STANDARD,
  CTA_SECONDARY_GLASS,
  CTA_WHATSAPP,
} from "./cta-primitives";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CTAType = "primary" | "secondary" | "b2b";
type CTAContext = "student" | "agent" | "nursing" | "germany";
type IntentLevel = "low" | "medium" | "high";
type CTAVariant = "button" | "banner" | "inline";

interface GlobalCTAProps {
  type: CTAType;
  context: CTAContext;
  intentLevel: IntentLevel;
  variant: CTAVariant;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Route & action mapping                                             */
/* ------------------------------------------------------------------ */

const WHATSAPP_NUMBER = "96170585052";

function getCTADestination(type: CTAType, context: CTAContext): string | null {
  if (type === "primary") {
    return context === "nursing" ? "/nursing" : "/quiz";
  }

  if (type === "secondary") {
    return context === "nursing"
      ? "/contact?topic=nursing&action=application&destination=Germany#contact-form"
      : "/contact";
  }

  return null; // b2b uses modal
}

function getContextIcon(context: CTAContext) {
  switch (context) {
    case "student":
      return GraduationCap;
    case "agent":
      return Building2;
    case "nursing":
      return Stethoscope;
    case "germany":
      return Users;
  }
}

/* ------------------------------------------------------------------ */
/*  i18n key builder                                                   */
/* ------------------------------------------------------------------ */

function getI18nKey(context: CTAContext, type: CTAType, intentLevel: IntentLevel): string {
  return `globalCta.${context}.${type}.${intentLevel}`;
}

function getWhatsAppKey(context: CTAContext): string {
  return `globalCta.${context}.whatsapp`;
}

function getBannerSubKey(context: CTAContext, type: CTAType): string {
  return `globalCta.${context}.${type}.bannerSub`;
}

/* ------------------------------------------------------------------ */
/*  Variant: Button                                                    */
/* ------------------------------------------------------------------ */

function CTAButton({
  type,
  context,
  intentLevel,
  className = "",
}: Omit<GlobalCTAProps, "variant">) {
  const { t } = useLanguage();
  const { isVariantB, variant: ctaVariant } = useExperiment("cta_copy");
  const { resolveContent, isSlotPersonalized, segment } = usePersonalization();

  const useVariantB = isVariantB && context === "student" && type === "primary" && intentLevel === "high";

  // Priority: A/B variant > personalization > default
  let label: string;
  if (useVariantB) {
    label = t<string>(`${getI18nKey(context, type, intentLevel)}VariantB`);
  } else if (context === "student" && type === "primary" && isSlotPersonalized("cta.primary.label")) {
    label = t<string>(resolveContent("cta.primary.label"));
    trackPersonalizationApplied({ slot: "cta.primary.label", segment, contentKey: resolveContent("cta.primary.label") });
  } else {
    label = t<string>(getI18nKey(context, type, intentLevel));
  }
  const destination = getCTADestination(type, context);

  const handleClick = () => {
    trackCTA({ type, context, intentLevel, variant: "button" });
    if (useVariantB) {
      trackExperimentConversion({ experiment: "cta_copy", variant: ctaVariant, action: "cta_click", page: context });
    }
    if (type === "b2b") openPartnershipModal();
  };

  const typeClasses: Record<CTAType, string> = {
    primary: CTA_PRIMARY_ELEVATED,
    secondary: CTA_SECONDARY_GLASS,
    b2b: CTA_DARK,
  };

  const content = (
    <>
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
    </>
  );

  if (destination && type !== "b2b") {
    return (
      <m.div whileTap={{ scale: 0.97 }}>
        <Link
          to={destination}
          onClick={handleClick}
          className={`${CTA_BUTTON_BASE} ${typeClasses[type]} ${className}`}
        >
          {content}
        </Link>
      </m.div>
    );
  }

  return (
    <m.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`${CTA_BUTTON_BASE} ${typeClasses[type]} ${className}`}
    >
      {content}
    </m.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant: Banner                                                    */
/* ------------------------------------------------------------------ */

function CTABanner({
  type,
  context,
  intentLevel,
  className = "",
}: Omit<GlobalCTAProps, "variant">) {
  const { t } = useLanguage();
  const { resolveContent, isSlotPersonalized, segment } = usePersonalization();

  const label = context === "student" && type === "primary" && isSlotPersonalized("cta.primary.label")
    ? t<string>(resolveContent("cta.primary.label"))
    : t<string>(getI18nKey(context, type, intentLevel));
  const subtitle = t<string>(getBannerSubKey(context, type));
  const whatsappLabel = t<string>(getWhatsAppKey(context));
  const destination = getCTADestination(type, context);
  const Icon = getContextIcon(context);
  const showWhatsApp = intentLevel === "high" && (context === "student" || context === "nursing");

  const handleClick = () => {
    trackCTA({ type, context, intentLevel, variant: "banner" });
    if (type === "b2b") openPartnershipModal();
  };

  const handleWhatsApp = () => {
    trackCTA({ type: "secondary", context, intentLevel, variant: "banner" });
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full rounded-2xl border border-border/30 bg-linear-to-r from-surface-glass/5 via-surface-glass/10 to-surface-glass/5 backdrop-blur-sm p-6 sm:p-8 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
        {/* Icon */}
        <div className="shrink-0 w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-accent-primary" />
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-text-primary leading-tight">
            {label}
          </p>
          <p className="mt-1 text-sm text-text-secondary leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          {destination && type !== "b2b" ? (
            <Link
              to={destination}
              onClick={handleClick}
              className={`${CTA_BANNER_ACTION_BASE} ${CTA_PRIMARY_STANDARD}`}
            >
              <span>{label}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleClick}
              className={`${CTA_BANNER_ACTION_BASE} ${CTA_DARK}`}
            >
              <span>{label}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          )}

          {showWhatsApp && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
              className={`${CTA_WHATSAPP} ${CTA_FOCUS_RING} focus-visible:outline-[#25D366]`}
              aria-label={whatsappLabel}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{whatsappLabel}</span>
            </a>
          )}
        </div>
      </div>
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant: Inline                                                    */
/* ------------------------------------------------------------------ */

function CTAInline({
  type,
  context,
  intentLevel,
  className = "",
}: Omit<GlobalCTAProps, "variant">) {
  const { t } = useLanguage();
  const { resolveContent, isSlotPersonalized } = usePersonalization();

  const label = context === "student" && type === "primary" && isSlotPersonalized("cta.primary.label")
    ? t<string>(resolveContent("cta.primary.label"))
    : t<string>(getI18nKey(context, type, intentLevel));
  const destination = getCTADestination(type, context);

  const handleClick = () => {
    trackCTA({ type, context, intentLevel, variant: "inline" });
    if (type === "b2b") openPartnershipModal();
  };

  if (destination && type !== "b2b") {
    return (
      <Link to={destination} onClick={handleClick} className={`${CTA_INLINE_BASE} ${className}`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span className="underline-offset-4 group-hover:underline">{label}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={`${CTA_INLINE_BASE} ${className}`}>
      <Sparkles className="w-3.5 h-3.5" />
      <span className="underline-offset-4 group-hover:underline">{label}</span>
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function GlobalCTA({ type, context, intentLevel, variant, className }: GlobalCTAProps) {
  const sharedProps = { type, context, intentLevel, className };

  switch (variant) {
    case "banner":
      return <CTABanner {...sharedProps} />;
    case "inline":
      return <CTAInline {...sharedProps} />;
    default:
      return <CTAButton {...sharedProps} />;
  }
}
