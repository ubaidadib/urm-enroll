# Accessibility Compliance

## WCAG 2.2 AA Targets
- Keyboard navigation across all sections.
- Focus-visible states for all interactive elements.
- Reduced motion support for users with vestibular sensitivity.
- Clear ARIA labeling for menus, dialogs, and progress states.

## Implemented Enhancements
- Skip link, focus-visible styling, and reduced motion in [src/styles/theme.css](src/styles/theme.css).
- ARIA roles and labels in [src/app/components/layout/header.tsx](src/app/components/layout/header.tsx).
- Focus management and keyboard-visible actions in [src/app/components/cta/sticky-cta-bar.tsx](src/app/components/cta/sticky-cta-bar.tsx).
- Focus trap and dialog semantics in [src/app/components/ui/filter-drawer.tsx](src/app/components/ui/filter-drawer.tsx).
- Live regions in [src/app/sections/smart-quiz.tsx](src/app/sections/smart-quiz.tsx).

## Audit Checklist
- Verify contrast ratio for all text over gradients.
- Validate keyboard navigation for header menus, language switcher, and mobile menu toggle.
- Validate filter drawer focus trap behavior (open focus, tab loop, escape close, focus restore).
- Confirm quiz step announcements and result state screen reader flow.
