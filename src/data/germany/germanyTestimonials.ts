/* ------------------------------------------------------------------ */
/*  Germany testimonials. Story copy localised via                     */
/*  `chancenkarte.successStories.entries.<id>.*`.                       */
/* ------------------------------------------------------------------ */

export type GermanyTestimonial = {
  id: string;
  /** Profession key — references `germany.professions.<id>.label`. */
  professionKey: string;
  cityKey: "berlin" | "munich" | "hamburg" | "frankfurt" | "stuttgart" | "cologne";
  countryOfOrigin: string;
  yearArrived: number;
  rating: 1 | 2 | 3 | 4 | 5;
};

export const GERMANY_TESTIMONIALS: GermanyTestimonial[] = [
  {
    id: "rami_nurse",
    professionKey: "nursing",
    cityKey: "munich",
    countryOfOrigin: "Lebanon",
    yearArrived: 2025,
    rating: 5,
  },
  {
    id: "sara_software",
    professionKey: "software_engineering",
    cityKey: "berlin",
    countryOfOrigin: "Lebanon",
    yearArrived: 2025,
    rating: 5,
  },
  {
    id: "khalil_mechatronics",
    professionKey: "mechatronics",
    cityKey: "stuttgart",
    countryOfOrigin: "Lebanon",
    yearArrived: 2026,
    rating: 5,
  },
  {
    id: "lara_teaching",
    professionKey: "teaching",
    cityKey: "hamburg",
    countryOfOrigin: "Syria",
    yearArrived: 2025,
    rating: 4,
  },
];
