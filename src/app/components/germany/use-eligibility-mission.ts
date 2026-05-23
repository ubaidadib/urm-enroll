import { useCallback, useEffect, useRef } from "react";
import { useExperiment } from "@/hooks/useExperiment";
import {
  trackCTA,
  trackEngagement,
  trackExperimentConversion,
  trackExperimentView,
  trackFormStart,
  trackStepCompletion,
} from "@/utils/tracking";

export type MissionVariant = "A" | "B";

export type MissionPhase = "intro" | "quiz" | "bridge" | "gate" | "result";

type MilestoneType = "mission_start" | "step_complete" | "bridge_complete" | "gate_complete" | "result_reveal";

export type MilestoneState = {
  id: number;
  type: MilestoneType;
  title: string;
  subtitle: string;
};

const EXPERIMENT_ID = "lead_form_steps";

export function useEligibilityMissionVariant(): {
  variant: MissionVariant;
  isVariantB: boolean;
} {
  const { variant, isVariantB } = useExperiment(EXPERIMENT_ID);
  return {
    variant,
    isVariantB,
  };
}

export function useEligibilityMissionTracking(variant: MissionVariant) {
  const hasTrackedVariantView = useRef(false);

  useEffect(() => {
    if (hasTrackedVariantView.current) return;
    hasTrackedVariantView.current = true;
    trackExperimentView({
      experiment: EXPERIMENT_ID,
      variant,
      page: "chancenkarte-eligibility",
    });
  }, [variant]);

  const trackMissionStart = useCallback(() => {
    trackFormStart({ page: "chancenkarte-eligibility-quiz" });
    trackEngagement({
      page: "chancenkarte-eligibility",
      interactionCount: 1,
      trigger: "mission_start",
    });
  }, []);

  const trackMissionStepComplete = useCallback((step: number) => {
    trackStepCompletion({
      step,
      page: "chancenkarte-eligibility-quiz",
    });
  }, []);

  const trackBridgeSeen = useCallback(() => {
    trackEngagement({
      page: "chancenkarte-eligibility",
      interactionCount: 1,
      trigger: "bridge_view",
    });
  }, []);

  const trackGateProgress = useCallback((gateStep: number) => {
    trackStepCompletion({
      step: 90 + gateStep,
      page: "chancenkarte-eligibility-quiz",
    });
  }, []);

  const trackGateSubmitted = useCallback(() => {
    trackExperimentConversion({
      experiment: EXPERIMENT_ID,
      variant,
      action: "gate_submit",
      page: "chancenkarte-eligibility",
    });
  }, [variant]);

  const trackResultReveal = useCallback(() => {
    trackExperimentConversion({
      experiment: EXPERIMENT_ID,
      variant,
      action: "result_reveal",
      page: "chancenkarte-eligibility",
    });
  }, [variant]);

  const trackStickyCTA = useCallback((kind: "continue" | "book" | "retake", phase: MissionPhase) => {
    trackCTA({
      type: kind,
      context: "germany",
      intentLevel: "high",
      variant: `eligibility-sticky-${phase}`,
    });
  }, []);

  return {
    trackMissionStart,
    trackMissionStepComplete,
    trackBridgeSeen,
    trackGateProgress,
    trackGateSubmitted,
    trackResultReveal,
    trackStickyCTA,
  };
}

export function buildMilestone(type: MilestoneType, id: number): MilestoneState {
  if (type === "mission_start") {
    return {
      id,
      type,
      title: "Mission started",
      subtitle: "You are now in assessment mode.",
    };
  }
  if (type === "step_complete") {
    return {
      id,
      type,
      title: "Checkpoint unlocked",
      subtitle: "Progress saved. Keep your streak alive.",
    };
  }
  if (type === "bridge_complete") {
    return {
      id,
      type,
      title: "Analysis ready",
      subtitle: "One final unlock to reveal your result.",
    };
  }
  if (type === "gate_complete") {
    return {
      id,
      type,
      title: "Gate complete",
      subtitle: "Your score board is loading.",
    };
  }
  return {
    id,
    type,
    title: "Mission complete",
    subtitle: "Your eligibility result is now visible.",
  };
}