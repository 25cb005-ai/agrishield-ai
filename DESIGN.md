# Design Brief — AgriShield AI

## Overview
Premium agricultural crop health diagnostic app with dark sidebar navigation, card-based dashboard, severity-driven visual hierarchy, and mobile-responsive interface. Offline-first with animated transitions.

## Direction & Tone
Professional, trustworthy, agricultural. Earthy green palette paired with high-contrast severity indicators (green/yellow/orange/red). Refined typography (Fraunces for headings, Plus Jakarta Sans for body) creates premium SaaS aesthetic. Functional density with intentional breathing space.

## Color Palette

| Token                | OKLCH           | Purpose                          |
|:-------------------|:----------------|:---------------------------------|
| `--primary`        | 0.42 0.13 142   | Agricultural green (buttons, accents) |
| `--secondary`      | 0.94 0.08 142   | Light green tint (backgrounds)  |
| `--accent`         | 0.68 0.19 142   | Vibrant green (interactive states) |
| `--destructive`    | 0.57 0.27 29    | Warning red (critical status)   |
| `--background`     | 0.995 0 0       | Clean white content area        |
| `--card`           | 0.98 0 0        | Elevated card surfaces          |
| `--sidebar`        | 0.18 0.04 143   | Dark green navigation           |
| `--muted`          | 0.92 0.02 0     | Disabled/secondary text         |
| `--border`         | 0.88 0.03 142   | Light green dividers            |

## Severity System

| Status    | Color Class     | OKLCH             | Usage                           |
|:----------|:----------------|:------------------|:--------------------------------|
| Healthy   | `badge-success` | 0.42 0.13 142     | Green - normal crop status     |
| Caution   | `badge-warning` | 0.73 0.20 55      | Yellow - mild disease warning  |
| Moderate  | `badge-moderate`| 0.62 0.21 39      | Orange - moderate risk disease |
| Critical  | `badge-critical`| 0.57 0.27 29      | Red - urgent action needed     |

## Typography

| Layer     | Font               | Scale  | Weight | Usage                           |
|:----------|:------------------|:-------|:-------|:--------------------------------|
| Display   | Fraunces (serif)   | 32-48  | 700    | Headings, page titles           |
| Body      | Plus Jakarta Sans  | 14-16  | 400-600| Content, labels, descriptions   |
| Mono      | Geist Mono         | 12-14  | 400    | Code, diagnostics, timestamps   |

## Structural Zones

| Zone              | Background        | Border           | Purpose                    |
|:-----------------|:------------------|:-----------------|:---------------------------|
| Header/Top Nav   | `--background`    | Green bottom     | Title, offline banner      |
| Sidebar (Dark)   | `--sidebar`       | None             | Nav links, profile         |
| Content Main     | `--background`    | None             | Cards, dashboards          |
| Content Cards    | `--card`          | Light green      | Elevated content surfaces  |
| Footer/Bottom Nav| `--card`          | Green top        | Mobile nav, action buttons |
| Offline Banner   | Yellow/orange     | None             | Network status indicator   |

## Spacing & Rhythm
Consistent padding/margin scale: `4px, 8px, 12px, 16px, 24px, 32px`. Cards use 16-24px padding. Sections separated by 32px vertical rhythm. Mobile density increased (12px base).

## Component Patterns
- **Buttons**: Primary green, secondary outline, destructive red. Hover: +10% lightness, active: -5% lightness.
- **Badges**: Severity colors with dark backgrounds in dark mode. Rounded-lg (10px).
- **Cards**: Subtle shadow, light green border, 16px padding, rounded-lg.
- **Form Inputs**: Light border, green focus ring, 8px padding.
- **Navigation**: Dark sidebar with icon + label. Mobile bottom nav with 5 icons (crop, shop, history, weather, settings).

## Motion & Animation
- **Page transitions**: Fade-in + slide-up (0.4s, ease-out) on route change
- **Micro-interactions**: Button hover (0.2s), badge pulse-gentle (2s loop)
- **Offline indicator**: Yellow banner slides down from top (0.3s)
- **Accordion open/close**: 0.2s ease-out

## Differentiation
Green agricultural color palette paired with high-contrast severity system creates instant visual scanning for crop health status. Dark sidebar reduces eye strain during extended agricultural work sessions. Premium typography (Fraunces) elevates trust in diagnostic accuracy.

## Accessibility
- Minimum AA contrast (7:1 on text-heavy zones)
- Severity conveyed by color + icon + text
- Touch targets 44px minimum (mobile)
- Motion respects `prefers-reduced-motion`
- Semantic HTML with ARIA labels

## Dark Mode
Primary green adjusted to 0.72 lightness for readability. Sidebar remains 0.14 lightness. Card backgrounds at 0.19 to prevent eye fatigue. All badge backgrounds use `dark:bg-{color}-900/30` with muted foreground text.

## Constraints & Signature Detail
No gradients on primary surfaces (maintain agricultural professionalism). Green accent line under headers reinforces agricultural identity. Offline banner uses warm yellow-orange to signal network disruption without alarm. Typography hierarchy (Fraunces/Plus Jakarta) establishes SaaS-premium positioning against generic commodity ag apps.
