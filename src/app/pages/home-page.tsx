import { Suspense, lazy, useEffect, useRef, useState } from "react";
import React from "react";
import { SeoManager } from "../seo/seo-manager";
import { HeroSection } from "../sections/hero-section";
import { TrustSection } from "../sections/trust-section";
import { ProgramCategoriesSection } from "../sections/program-categories-section";

import { trackPageView } from "@/utils/tracking";
import { usePersonalization } from "@/hooks/usePersonalization";

const GlobalPartnersMarquee = lazy(() =>
  import("../sections/global-partners-marquee").then((module) => ({ default: module.GlobalPartnersMarquee }))
);
const DestinationsCompact = lazy(() =>
  import("../sections/destinations-compact").then((module) => ({ default: module.DestinationsCompact }))
);
const FeaturedUniversitiesCarousel = lazy(() =>
  import("../sections/featured-universities-carousel").then((module) => ({ default: module.FeaturedUniversitiesCarousel }))
);
const HomeHowItWorks = lazy(() =>
  import("../sections/home-how-it-works").then((module) => ({ default: module.HomeHowItWorks }))
);
const HomeFinalCtaBanner = lazy(() =>
  import("../sections/home-final-cta-banner").then((module) => ({ default: module.HomeFinalCtaBanner }))
);
const InstagramReelsSection = lazy(() =>
  import("../sections/instagram-reels-section").then((module) => ({ default: module.InstagramReelsSection }))
);

function DeferredSection({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  // Check for hash targeting on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.slice(1); // Remove #
      // Check if any child element has the matching id
      const childWithId = React.Children.toArray(children).find((child) => {
        if (React.isValidElement(child) && child.props.id === hash) {
          return true;
        }
        return false;
      });
      if (childWithId) {
        setIsVisible(true);
        return;
      }
    }
  }, [children]);

  useEffect(() => {
    const node = placeholderRef.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  if (isVisible) {
    return <>{children}</>;
  }

  return <div ref={placeholderRef} className="min-h-35 overflow-hidden" aria-hidden="true" />;
}

export function HomePage() {
  useEffect(() => { trackPageView({ page: "home" }); }, []);

  const { recordSignal } = usePersonalization();

  useEffect(() => { recordSignal({ type: "page_view", page: "/home" }); }, [recordSignal]);

  return (
    <div className="dark overflow-x-hidden" style={{ background: "rgb(5,10,24)" }}>
      <SeoManager />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust / Accreditation */}
      <TrustSection />

      {/* 3. Program Categories — Discover Paths */}
      <ProgramCategoriesSection />

      {/* 4. Featured Universities */}
      <DeferredSection>
        <Suspense fallback={<div className="min-h-35" aria-hidden="true" />}>
          <FeaturedUniversitiesCarousel />
        </Suspense>
      </DeferredSection>

      {/* 5. Destinations Preview */}
      <DeferredSection>
        <Suspense fallback={<div className="min-h-30" aria-hidden="true" />}>
          <DestinationsCompact />
        </Suspense>
      </DeferredSection>

      {/* 6. How It Works */}
      <DeferredSection>
        <Suspense fallback={<div className="min-h-30" aria-hidden="true" />}>
          <HomeHowItWorks />
        </Suspense>
      </DeferredSection>

      {/* 7. Instagram Reels — live embeds via Instagram embed.js (SEO-friendly) */}
      <DeferredSection>
        <Suspense fallback={<div className="min-h-[480px]" aria-hidden="true" />}>
          <InstagramReelsSection />
        </Suspense>
      </DeferredSection>

      {/* 8. Partners Marquee */}
      <DeferredSection>
        <Suspense fallback={<div className="min-h-[480px]" aria-hidden="true" />}>
          <GlobalPartnersMarquee />
        </Suspense>
      </DeferredSection>

      {/* 9. Final CTA */}
      <DeferredSection>
        <Suspense fallback={<div className="min-h-25" aria-hidden="true" />}>
          <HomeFinalCtaBanner />
        </Suspense>
      </DeferredSection>

    </div>
  );
}
