import { useEffect } from "react";
import { InstitutionalPartnership } from "../sections/institutional-partnership";
import { AgentPortalShowcase } from "../sections/agent-portal-showcase";
import { AgencyComparison } from "../sections/agency-comparison";
import { GlobalCTA } from "../components/cta/global-cta-system";
import { trackPageView } from "@/utils/tracking";
import { usePersonalization } from "@/hooks/usePersonalization";

export function PartnershipsPage() {
  useEffect(() => { trackPageView({ page: "partnerships" }); }, []);
  const { recordSignal } = usePersonalization();
  useEffect(() => { recordSignal({ type: "page_view", page: "/partnerships" }); }, [recordSignal]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-500">
      <InstitutionalPartnership />
      <div className="max-w-5xl mx-auto page-gutter py-10">
        <GlobalCTA
          type="b2b"
          context="agent"
          intentLevel="medium"
          variant="banner"
        />
      </div>
      <AgencyComparison />
      <AgentPortalShowcase />
      <div className="max-w-5xl mx-auto page-gutter py-10">
        <GlobalCTA
          type="b2b"
          context="agent"
          intentLevel="high"
          variant="banner"
        />
      </div>
    </div>
  );
}