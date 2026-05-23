/* ------------------------------------------------------------------ */
/*  In-demand professions for the German labour market.                */
/*  Used by the GermanyProfessionCards section. Localised labels      */
/*  resolved via i18n key `germany.professions.<id>`.                  */
/* ------------------------------------------------------------------ */

import {
  Stethoscope,
  Code2,
  Wrench,
  GraduationCap,
  TrendingUp,
  Truck,
  HardHat,
  Cpu,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type GermanyProfession = {
  id: string;
  icon: LucideIcon;
  /** Average gross monthly salary, EUR — public figures from the BA / Destatis bands. */
  avgSalaryEur: number;
  /** Approximate annual openings reported by BA Engpassanalyse. */
  shortageIndex: "high" | "very_high" | "critical";
};

export const GERMANY_PROFESSIONS: GermanyProfession[] = [
  { id: "nursing", icon: Stethoscope, avgSalaryEur: 3400, shortageIndex: "critical" },
  { id: "software_engineering", icon: Code2, avgSalaryEur: 5500, shortageIndex: "very_high" },
  { id: "mechatronics", icon: Wrench, avgSalaryEur: 3900, shortageIndex: "very_high" },
  { id: "teaching", icon: GraduationCap, avgSalaryEur: 4200, shortageIndex: "high" },
  { id: "sales_business", icon: TrendingUp, avgSalaryEur: 4500, shortageIndex: "high" },
  { id: "logistics_truck", icon: Truck, avgSalaryEur: 2900, shortageIndex: "critical" },
  { id: "construction_skilled", icon: HardHat, avgSalaryEur: 3300, shortageIndex: "very_high" },
  { id: "electrical_engineering", icon: Cpu, avgSalaryEur: 4800, shortageIndex: "very_high" },
  { id: "hospitality_chef", icon: Sparkles, avgSalaryEur: 2700, shortageIndex: "high" },
];
