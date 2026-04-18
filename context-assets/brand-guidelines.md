# TOKY Brand Guidelines for Internal Webapps

## Overview

These guidelines define how to apply the TOKY color palette to internal web applications. Dark mode is the default and primary design target. Purple is the primary color family.

Source: `brand_assets/TOKY Colors.pdf` (Q1 2024)

---

## Master Palette

### Neutrals

| Name | Hex | RGB | Role |
|------|-----|-----|------|
| Black | `#000000` | 0, 0, 0 | True black (use sparingly) |
| Dk Gray | `#5E5E5E` | 94, 94, 94 | Disabled states, decorative borders |
| David Gray | `#A6ACAC` | 166, 172, 172 | Secondary text, captions |
| Lt Gray | `#F0F0F0` | 240, 240, 240 | Primary text (light mode), borders (dark mode) |

### Purple Family (Primary)

| Name | Hex | RGB | Role |
|------|-----|-----|------|
| Dk Purple | `#9E0085` | 158, 0, 133 | Button fills, active states, key accents |
| Purple | `#E28CFF` | 226, 140, 255 | Primary interactive color, links, text accents |
| Light Purple | `#FEDBFF` | 254, 219, 255 | High-emphasis text on dark, hover highlights |

### Warm Accents

| Name | Hex | RGB | Role |
|------|-----|-----|------|
| Poppy | `#F23E27` | 242, 62, 39 | Error, destructive actions |
| Tangerine | `#FFAE00` | 255, 174, 0 | Warning, attention |
| Yellow | `#FFEF77` | 255, 239, 119 | Highlight, badge backgrounds |

### Cool Accents

| Name | Hex | RGB | Role |
|------|-----|-----|------|
| Dk Green | `#6B802F` | 107, 128, 47 | Reserved (print only) |
| Green | `#9FBF38` | 159, 191, 56 | Success, positive indicators |
| Lt Green | `#DBE03C` | 219, 224, 60 | Reserved (print only) |
| Dk Blue | `#00069C` | 0, 6, 156 | Reserved (large text/icons only in dark mode) |
| Blue | `#004CEE` | 0, 76, 238 | Large text, icons (fails AA for normal text on dark) |
| Lt Blue | `#00B7FF` | 0, 183, 255 | Info states, links (when blue is needed over purple) |

---

## Dark Mode Color System

Dark mode is the default. All surfaces use purple-tinted dark tones derived from the palette, not pure grays.

### Surface Layers

Use these layered surfaces to create depth. Each step up is slightly lighter and slightly more purple.

| Token | Hex | Usage |
|-------|-----|-------|
| `--surface-base` | `#110B14` | Page background, app shell |
| `--surface-raised` | `#1C1420` | Cards, panels, sidebars |
| `--surface-overlay` | `#271D2E` | Modals, dropdowns, popovers |
| `--surface-input` | `#1C1420` | Form field backgrounds |
| `--surface-hover` | `#271D2E` | Row/item hover state |
| `--surface-active` | `#331F3D` | Active/pressed state on surfaces |

### Text Colors

| Token | Hex | Source | Contrast on Base | Usage |
|-------|-----|--------|-----------------|-------|
| `--text-primary` | `#FEDBFF` | Light Purple | 15.5:1 (AAA) | Headings, primary content |
| `--text-secondary` | `#A6ACAC` | David Gray | 8.4:1 (AAA) | Captions, labels, metadata |
| `--text-muted` | `#5E5E5E` | Dk Gray | 3.0:1 (decorative only) | Placeholder text, decorative |
| `--text-accent` | `#E28CFF` | Purple | 8.7:1 (AAA) | Links, highlighted values |
| `--text-on-accent` | `#FEDBFF` | Light Purple | 6.0:1 on Dk Purple (AA) | Text on Dk Purple buttons |
| `--text-inverse` | `#000000` | Black | 9.4:1 on Purple (AAA) | Text on light/accent backgrounds |

### Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--border-default` | `#271D2E` | Card borders, dividers |
| `--border-subtle` | `#1C1420` | Faint separators |
| `--border-emphasis` | `#9E0085` | Focus rings, selected states |
| `--border-input` | `#5E5E5E` | Form field borders |
| `--border-input-focus` | `#E28CFF` | Focused form field borders |

### Interactive Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--interactive-primary` | `#9E0085` | Primary button background |
| `--interactive-primary-hover` | `#B8009B` | Primary button hover (10% lighter) |
| `--interactive-primary-text` | `#FEDBFF` | Primary button label |
| `--interactive-secondary` | `transparent` | Secondary/ghost button background |
| `--interactive-secondary-border` | `#E28CFF` | Secondary button border |
| `--interactive-secondary-text` | `#E28CFF` | Secondary button label |
| `--interactive-secondary-hover` | `rgba(226, 140, 255, 0.1)` | Secondary button hover fill |
| `--interactive-link` | `#E28CFF` | Inline links |
| `--interactive-link-hover` | `#FEDBFF` | Link hover |
| `--interactive-focus-ring` | `rgba(226, 140, 255, 0.5)` | Focus outline (3px) |

### Semantic / Status Colors

| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `--status-success` | `#9FBF38` | Green | Success messages, positive badges |
| `--status-warning` | `#FFAE00` | Tangerine | Warnings, caution states |
| `--status-error` | `#F23E27` | Poppy | Errors, destructive confirmations |
| `--status-info` | `#00B7FF` | Lt Blue | Informational notices |

For status backgrounds (e.g., toast notifications), use the status color at 10-15% opacity over `--surface-raised`:
- Success bg: `rgba(159, 191, 56, 0.12)`
- Warning bg: `rgba(255, 174, 0, 0.12)`
- Error bg: `rgba(242, 62, 39, 0.12)`
- Info bg: `rgba(0, 183, 255, 0.12)`

---

## Light Mode Color System

Light mode is secondary but should be available for user preference.

### Surface Layers (Light)

| Token | Hex | Usage |
|-------|-----|-------|
| `--surface-base` | `#FFFFFF` | Page background |
| `--surface-raised` | `#F0F0F0` | Cards, panels |
| `--surface-overlay` | `#FFFFFF` | Modals (with shadow for depth) |
| `--surface-input` | `#FFFFFF` | Form fields |
| `--surface-hover` | `#F0F0F0` | Row/item hover |
| `--surface-active` | `#FEDBFF` | Active/selected (purple tint) |

### Text Colors (Light)

| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| `--text-primary` | `#000000` | Black | Headings, primary content |
| `--text-secondary` | `#5E5E5E` | Dk Gray | Captions, labels |
| `--text-muted` | `#A6ACAC` | David Gray | Placeholder, decorative |
| `--text-accent` | `#9E0085` | Dk Purple | Links, highlighted values |
| `--text-on-accent` | `#FEDBFF` | Light Purple | Text on Dk Purple buttons |
| `--text-inverse` | `#FEDBFF` | Light Purple | Text on dark backgrounds |

### Interactive Colors (Light)

| Token | Hex | Usage |
|-------|-----|-------|
| `--interactive-primary` | `#9E0085` | Primary button background |
| `--interactive-primary-hover` | `#7A0068` | Primary button hover (darker) |
| `--interactive-primary-text` | `#FEDBFF` | Primary button label |
| `--interactive-secondary-border` | `#9E0085` | Secondary button border |
| `--interactive-secondary-text` | `#9E0085` | Secondary button label |
| `--interactive-link` | `#9E0085` | Inline links |
| `--interactive-link-hover` | `#7A0068` | Link hover |

---

## Accessibility Constraints

These are non-negotiable rules based on WCAG 2.1 contrast testing against the dark mode surfaces.

### Safe for all text sizes (4.5:1+ on dark surfaces)
- Light Purple (`#FEDBFF`) -- 15.5:1
- Lt Gray (`#F0F0F0`) -- 17.0:1
- Purple (`#E28CFF`) -- 8.7:1
- David Gray (`#A6ACAC`) -- 8.4:1
- Tangerine (`#FFAE00`) -- 10.5:1
- Green (`#9FBF38`) -- 9.2:1
- Lt Blue (`#00B7FF`) -- 8.5:1
- Poppy (`#F23E27`) -- 5.1:1

### Large text only (3:1+, meaning 18px+ or 14px bold)
- Blue (`#004CEE`) -- 3.0:1
- Purple on Dk Purple (`#E28CFF` on `#9E0085`) -- 3.4:1

### Decorative/non-text only (below 3:1)
- Dk Gray (`#5E5E5E`) on dark surfaces -- 3.0:1 (borderline, no text)
- Dk Purple (`#9E0085`) on dark surfaces -- 2.6:1 (fills and borders only)
- Black (`#000000`) on dark surfaces -- 1.1:1 (invisible, do not use)

### Button-specific rules
- Primary buttons (Dk Purple fill): use Light Purple (`#FEDBFF`) for label text. Ratio is 6.0:1 (AA pass). Do not use Purple (`#E28CFF`) as button text on Dk Purple -- it's only 3.4:1.
- On any purple-filled surface, prefer `#FEDBFF` or `#FFFFFF` for text.

---

## Typography

**Primary font: [Public Sans](https://fonts.google.com/specimen/Public+Sans)** (Google Fonts)

Public Sans is a strong, neutral sans-serif with a wide weight range (Thin 100 through Black 900 + italics). Use it for both headings and body text, differentiating through weight and size rather than typeface pairing.

### Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
```

### Type Scale

| Role | Weight | Size | Tracking | Line Height |
|------|--------|------|----------|-------------|
| Display / Page title | 700-800 | 32-48px | -0.03em | 1.1 |
| Section heading | 700 | 24px | -0.02em | 1.2 |
| Subheading | 600 | 18px | -0.01em | 1.3 |
| Body | 400 | 15-16px | normal | 1.6-1.7 |
| Caption / Label | 500 | 13px | 0.01em | 1.4 |
| Overline (section labels, table headers) | 600 | 11-12px | 0.08em | 1.4, uppercase |
| Monospace (data, code) | Use system monospace | -- | -- | -- |

### Usage Notes

- Tight tracking on headings (negative letter-spacing) gives Public Sans a more editorial, less generic feel at large sizes.
- Body text at 400 weight with generous line height (1.6-1.7) reads well on dark backgrounds where eye strain is a concern.
- For emphasis within body text, prefer 600 (SemiBold) over 700 (Bold) -- it's enough to stand out without feeling heavy.
- Never use weights below 400 for body text on dark backgrounds. Thin strokes on glowing pixels lose legibility fast.

---

## Spacing and Layout

- Use a consistent spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px.
- Cards and panels: 16-24px internal padding. 8-12px gap between stacked cards.
- Minimum touch target: 44x44px for interactive elements.
- Border radius: Choose one value per project (4px for compact/data-heavy, 8px for standard, 12px for friendly). Mix at most two radius sizes (one for small elements like badges, one for containers).

---

## Depth and Shadows (Dark Mode)

On dark backgrounds, traditional box-shadows are nearly invisible. Use these techniques instead:

1. **Surface color stepping**: Primary depth cue. Each layer uses a progressively lighter surface color (base -> raised -> overlay).
2. **Subtle border**: Use `--border-default` (`#271D2E`) on elevated surfaces to define edges.
3. **Glow shadows for floating elements**: Modals and popovers can use a faint purple glow: `box-shadow: 0 8px 32px rgba(158, 0, 133, 0.15), 0 2px 8px rgba(0, 0, 0, 0.3)`.
4. **Never use gray/black shadows alone** on dark surfaces. Always add a tinted color component.

---

## Component Patterns

### Buttons

```
Primary:    bg #9E0085, text #FEDBFF, hover bg #B8009B, focus ring rgba(226,140,255,0.5)
Secondary:  bg transparent, border #E28CFF, text #E28CFF, hover bg rgba(226,140,255,0.1)
Ghost:      bg transparent, text #E28CFF, hover bg rgba(226,140,255,0.06)
Danger:     bg #F23E27, text #FEDBFF, hover bg #D93520
Disabled:   bg #271D2E, text #5E5E5E, no pointer events
```

### Form Inputs

```
Default:    bg #1C1420, border #5E5E5E, text #FEDBFF, placeholder #5E5E5E
Focused:    border #E28CFF, ring rgba(226,140,255,0.25)
Error:      border #F23E27, helper text #F23E27
Disabled:   bg #110B14, border #271D2E, text #5E5E5E
```

### Status Badges

```
Success:    bg rgba(159,191,56,0.15), text #9FBF38, border rgba(159,191,56,0.3)
Warning:    bg rgba(255,174,0,0.15), text #FFAE00, border rgba(255,174,0,0.3)
Error:      bg rgba(242,62,39,0.15), text #F23E27, border rgba(242,62,39,0.3)
Info:       bg rgba(0,183,255,0.15), text #00B7FF, border rgba(0,183,255,0.3)
Neutral:    bg rgba(166,172,172,0.15), text #A6ACAC, border rgba(166,172,172,0.3)
```

### Navigation / Sidebar

```
Background:     #110B14 or #1C1420
Item default:   text #A6ACAC
Item hover:     bg #271D2E, text #FEDBFF
Item active:    bg rgba(158,0,133,0.2), text #E28CFF, left border #9E0085
Section header: text #5E5E5E, uppercase, letter-spacing 0.08em, font-size 11px
```

### Tables / Data Grids

```
Header bg:      #1C1420
Header text:    #A6ACAC, uppercase, small, tracked out
Row bg:         transparent (alternating optional: #1C1420 every other)
Row hover:      #271D2E
Row text:       #FEDBFF
Cell border:    #271D2E (horizontal only, 1px)
Selected row:   bg rgba(158,0,133,0.15), left border #9E0085
```

---

## CSS Custom Properties Template

Use these as the base token set. Swap values for light mode by toggling a class on `<html>` or `<body>`.

```css
:root {
  /* Palette */
  --color-black: #000000;
  --color-dk-gray: #5E5E5E;
  --color-david-gray: #A6ACAC;
  --color-lt-gray: #F0F0F0;
  --color-dk-purple: #9E0085;
  --color-purple: #E28CFF;
  --color-light-purple: #FEDBFF;
  --color-poppy: #F23E27;
  --color-tangerine: #FFAE00;
  --color-yellow: #FFEF77;
  --color-dk-green: #6B802F;
  --color-green: #9FBF38;
  --color-lt-green: #DBE03C;
  --color-dk-blue: #00069C;
  --color-blue: #004CEE;
  --color-lt-blue: #00B7FF;
}

/* Dark mode (default) */
[data-theme="dark"] {
  --surface-base: #110B14;
  --surface-raised: #1C1420;
  --surface-overlay: #271D2E;
  --surface-active: #331F3D;

  --text-primary: #FEDBFF;
  --text-secondary: #A6ACAC;
  --text-muted: #5E5E5E;
  --text-accent: #E28CFF;

  --border-default: #271D2E;
  --border-subtle: #1C1420;
  --border-emphasis: #9E0085;
  --border-input: #5E5E5E;
  --border-input-focus: #E28CFF;

  --interactive-primary: #9E0085;
  --interactive-primary-hover: #B8009B;
  --interactive-primary-text: #FEDBFF;
  --interactive-link: #E28CFF;
  --interactive-link-hover: #FEDBFF;
  --interactive-focus-ring: rgba(226, 140, 255, 0.5);

  --status-success: #9FBF38;
  --status-warning: #FFAE00;
  --status-error: #F23E27;
  --status-info: #00B7FF;
}

/* Light mode */
[data-theme="light"] {
  --surface-base: #FFFFFF;
  --surface-raised: #F0F0F0;
  --surface-overlay: #FFFFFF;
  --surface-active: #FEDBFF;

  --text-primary: #000000;
  --text-secondary: #5E5E5E;
  --text-muted: #A6ACAC;
  --text-accent: #9E0085;

  --border-default: #F0F0F0;
  --border-subtle: #F0F0F0;
  --border-emphasis: #9E0085;
  --border-input: #A6ACAC;
  --border-input-focus: #9E0085;

  --interactive-primary: #9E0085;
  --interactive-primary-hover: #7A0068;
  --interactive-primary-text: #FEDBFF;
  --interactive-link: #9E0085;
  --interactive-link-hover: #7A0068;
  --interactive-focus-ring: rgba(158, 0, 133, 0.3);

  --status-success: #6B802F;
  --status-warning: #FFAE00;
  --status-error: #F23E27;
  --status-info: #004CEE;
}
```

---

## Tailwind Configuration

When using Tailwind CSS, extend the default config with TOKY colors. Do not use default Tailwind palette colors (indigo, blue-600, etc.) as primary UI colors.

```js
// tailwind.config.js (extend section)
colors: {
  toky: {
    black: '#000000',
    'dk-gray': '#5E5E5E',
    'david-gray': '#A6ACAC',
    'lt-gray': '#F0F0F0',
    'dk-purple': '#9E0085',
    purple: '#E28CFF',
    'light-purple': '#FEDBFF',
    poppy: '#F23E27',
    tangerine: '#FFAE00',
    yellow: '#FFEF77',
    'dk-green': '#6B802F',
    green: '#9FBF38',
    'lt-green': '#DBE03C',
    'dk-blue': '#00069C',
    blue: '#004CEE',
    'lt-blue': '#00B7FF',
  },
  // Semantic aliases
  surface: {
    base: 'var(--surface-base)',
    raised: 'var(--surface-raised)',
    overlay: 'var(--surface-overlay)',
    active: 'var(--surface-active)',
  },
}
```

---

## Quick Reference: What Color Goes Where

| Element | Dark Mode | Light Mode |
|---------|-----------|------------|
| Page background | `#110B14` | `#FFFFFF` |
| Card background | `#1C1420` | `#F0F0F0` |
| Primary heading | `#FEDBFF` | `#000000` |
| Body text | `#FEDBFF` | `#000000` |
| Secondary text | `#A6ACAC` | `#5E5E5E` |
| Link text | `#E28CFF` | `#9E0085` |
| Primary button bg | `#9E0085` | `#9E0085` |
| Primary button text | `#FEDBFF` | `#FEDBFF` |
| Form border | `#5E5E5E` | `#A6ACAC` |
| Focus ring | `#E28CFF` | `#9E0085` |
| Divider line | `#271D2E` | `#F0F0F0` |
| Error text | `#F23E27` | `#F23E27` |
| Success text | `#9FBF38` | `#6B802F` |
| Warning text | `#FFAE00` | `#FFAE00` |
