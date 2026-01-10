# Typography & Spacing System - Ocean Professional Theme

## Overview

This document describes the comprehensive typography and spacing system implemented for the Travel Stories frontend. The system establishes consistent design tokens, responsive behavior, and accessible typography across the application.

## Table of Contents

1. [Typography Scale](#typography-scale)
2. [Spacing System](#spacing-system)
3. [Usage Guidelines](#usage-guidelines)
4. [Responsive Behavior](#responsive-behavior)
5. [Accessibility](#accessibility)
6. [Migration Guide](#migration-guide)

---

## Typography Scale

### Design Principles

- **Modular Scale**: Uses a mathematically harmonious scale for visual hierarchy
- **Responsive**: Font sizes adapt fluidly using `clamp()` for optimal readability across devices
- **Consistent Line Heights**: Optimized for readability with proper line-height ratios
- **Letter Spacing**: Tight spacing for headings, normal for body text

### Typography Tokens

All typography tokens are defined as CSS custom properties in `src/styles/typography.css`.

#### Display & Headings

| Class | Font Size | Line Height | Font Weight | Usage |
|-------|-----------|-------------|-------------|-------|
| `.type-display` | 2.5rem - 3.5rem (responsive) | 1.1 | 900 | Hero text, landing pages |
| `.type-h1` | 2rem - 2.75rem | 1.15 | 800 | Page titles |
| `.type-h2` | 1.75rem - 2.25rem | 1.2 | 800 | Section titles |
| `.type-h3` | 1.5rem - 1.875rem | 1.3 | 700 | Subsection titles |
| `.type-h4` | 1.25rem - 1.5rem | 1.35 | 700 | Card titles |
| `.type-h5` | 1.125rem - 1.25rem | 1.4 | 600 | Small headings |
| `.type-h6` | 1rem - 1.125rem | 1.45 | 600 | Smallest headings |

#### Body Text

| Class | Font Size | Line Height | Font Weight | Usage |
|-------|-----------|-------------|-------------|-------|
| `.type-body-lg` | 1.0625rem - 1.125rem | 1.7 | 400 | Larger body text, introductions |
| `.type-body` | 1rem | 1.65 | 400 | Default body text |
| `.type-body-sm` | 0.9375rem | 1.6 | 400 | Smaller body text |

#### Labels & Captions

| Class | Font Size | Line Height | Font Weight | Usage |
|-------|-----------|-------------|-------------|-------|
| `.type-caption` | 0.875rem | 1.5 | 500 | Captions, metadata |
| `.type-caption-sm` | 0.8125rem | 1.45 | 500 | Smaller captions |
| `.type-label` | 0.75rem | 1.4 | 600 | Form labels, UI labels (uppercase) |
| `.type-label-sm` | 0.6875rem | 1.35 | 600 | Small labels (uppercase) |

### CSS Variables

Access typography tokens directly via CSS custom properties:

```css
/* Font sizes */
--font-size-display
--font-size-h1 through --font-size-h6
--font-size-body-lg, --font-size-body, --font-size-body-sm
--font-size-caption, --font-size-caption-sm
--font-size-label, --font-size-label-sm

/* Line heights */
--line-height-display
--line-height-h1 through --line-height-h6
--line-height-body-lg, --line-height-body, --line-height-body-sm
--line-height-caption, --line-height-caption-sm
--line-height-label, --line-height-label-sm

/* Font weights */
--font-weight-light: 300
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-extrabold: 800
--font-weight-black: 900

/* Letter spacing */
--letter-spacing-display through --letter-spacing-label-sm
```

### Usage Examples

```jsx
// Using utility classes
<h1 className="type-h1">Page Title</h1>
<p className="type-body">Body text content</p>
<span className="type-label">Form Label</span>

// Using CSS variables in custom components
.custom-heading {
  font-size: var(--font-size-h3);
  line-height: var(--line-height-h3);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-h3);
}
```

---

## Spacing System

### Design Principles

- **8px Rhythm**: Based on an 8px grid with 4px increments for flexibility
- **Consistent Gaps**: Predictable spacing between elements
- **Semantic Tokens**: Component-specific spacing for common patterns
- **Responsive Scaling**: Spacing adapts on smaller screens

### Spacing Scale

All spacing values use `rem` units for scalability:

| Token | Value | Pixels (at 16px base) | Usage |
|-------|-------|----------------------|-------|
| `--spacing-0` | 0 | 0px | Reset spacing |
| `--spacing-1` | 0.25rem | 4px | Tight spacing, icon gaps |
| `--spacing-2` | 0.5rem | 8px | Small gaps, button padding |
| `--spacing-3` | 0.75rem | 12px | Standard gaps |
| `--spacing-4` | 1rem | 16px | Medium spacing, paragraph gaps |
| `--spacing-5` | 1.25rem | 20px | Card padding |
| `--spacing-6` | 1.5rem | 24px | Section spacing |
| `--spacing-7` | 1.75rem | 28px | Larger spacing |
| `--spacing-8` | 2rem | 32px | Section gaps |
| `--spacing-10` | 2.5rem | 40px | Large section padding |
| `--spacing-12` | 3rem | 48px | Major section gaps |
| `--spacing-16` | 4rem | 64px | Extra large spacing |
| `--spacing-20` | 5rem | 80px | Hero spacing |
| `--spacing-24` | 6rem | 96px | Maximum spacing |
| `--spacing-32` | 8rem | 128px | Extreme spacing |

### Semantic Spacing Tokens

For common UI patterns, use semantic tokens:

```css
--space-card-padding: var(--spacing-5);      /* 20px */
--space-card-gap: var(--spacing-4);          /* 16px */
--space-section-gap: var(--spacing-8);       /* 32px */
--space-section-padding: var(--spacing-10);  /* 40px */
--space-button-padding-x: var(--spacing-6);  /* 24px */
--space-button-padding-y: var(--spacing-3);  /* 12px */
--space-input-padding-x: var(--spacing-4);   /* 16px */
--space-input-padding-y: var(--spacing-3);   /* 12px */
--space-header-padding: var(--spacing-6);    /* 24px */
--space-content-gap: var(--spacing-6);       /* 24px */
```

### Spacing Utility Classes

#### Margin Utilities

```css
/* All sides */
.m-0, .m-1, .m-2, .m-3, .m-4, .m-5, .m-6, .m-7, .m-8, .m-10, .m-12

/* Individual sides */
.mt-1 through .mt-20  /* margin-top */
.mb-1 through .mb-12  /* margin-bottom */
.ml-2, .ml-3, .ml-4   /* margin-left */
.mr-2, .mr-3, .mr-4   /* margin-right */

/* Axis */
.mx-2, .mx-3, .mx-4, .mx-6  /* horizontal margins */
.my-2, .my-3, .my-4, .my-6, .my-8  /* vertical margins */

/* Auto centering */
.mx-auto, .ml-auto, .mr-auto
```

#### Padding Utilities

```css
/* All sides */
.p-0 through .p-10

/* Axis */
.px-2 through .px-10  /* horizontal padding */
.py-2 through .py-10  /* vertical padding */

/* Individual sides */
.pt-2, .pt-3, .pt-4, .pt-6, .pt-8  /* padding-top */
.pb-2, .pb-3, .pb-4, .pb-6, .pb-8  /* padding-bottom */
```

#### Gap Utilities (Flexbox/Grid)

```css
.gap-1, .gap-2, .gap-3, .gap-4, .gap-5, .gap-6, .gap-8, .gap-10, .gap-12
```

### Usage Examples

```jsx
// Using utility classes
<div className="p-6 mb-8">
  <h2 className="mb-4">Section Title</h2>
  <div className="flex gap-4">
    <button className="px-6 py-3">Action</button>
  </div>
</div>

// Using CSS variables in custom styles
.custom-card {
  padding: var(--space-card-padding);
  gap: var(--space-card-gap);
  margin-bottom: var(--spacing-8);
}
```

---

## Usage Guidelines

### Component Development

1. **Always use spacing tokens** instead of arbitrary pixel values
2. **Use semantic tokens** when available for common patterns
3. **Maintain the 8px rhythm** for visual consistency
4. **Use utility classes** for simple spacing needs
5. **Create custom classes** with CSS variables for complex components

### Do's and Don'ts

✅ **Do:**
```css
.my-component {
  padding: var(--spacing-6);
  gap: var(--space-card-gap);
  margin-bottom: var(--spacing-8);
}
```

❌ **Don't:**
```css
.my-component {
  padding: 23px;  /* Arbitrary value */
  gap: 1.3rem;    /* Off the scale */
  margin-bottom: 2.7rem;  /* Random spacing */
}
```

### Typography Best Practices

1. **Use semantic heading levels** (h1-h6) for proper document structure
2. **Apply utility classes** for quick styling
3. **Use CSS variables** for custom components
4. **Maintain hierarchy** with consistent heading levels
5. **Ensure sufficient contrast** for readability

### Spacing Best Practices

1. **Be consistent** - use the same spacing for similar elements
2. **Follow the rhythm** - stick to 4px/8px increments
3. **Use semantic tokens** for common patterns (cards, sections)
4. **Test responsiveness** - spacing adapts on mobile
5. **Avoid ad-hoc values** - always use tokens

---

## Responsive Behavior

### Typography Scaling

All heading sizes use `clamp()` for fluid, responsive typography:

```css
/* Example: H1 scales from 2rem (mobile) to 2.75rem (desktop) */
--font-size-h1: clamp(2rem, 3vw + 0.5rem, 2.75rem);
```

This ensures:
- ✅ Optimal readability at all screen sizes
- ✅ No layout jumps at breakpoints
- ✅ Smooth scaling between breakpoints

### Spacing Adjustments

Semantic spacing tokens automatically adjust on smaller screens:

```css
/* Desktop */
--space-section-padding: var(--spacing-10);  /* 40px */
--space-header-padding: var(--spacing-6);    /* 24px */
--space-card-padding: var(--spacing-5);      /* 20px */

/* Tablet (≤768px) */
--space-section-padding: var(--spacing-6);   /* 24px */
--space-header-padding: var(--spacing-4);    /* 16px */
--space-card-padding: var(--spacing-4);      /* 16px */

/* Mobile (≤640px) */
--space-section-padding: var(--spacing-4);   /* 16px */
--space-header-padding: var(--spacing-3);    /* 12px */
--space-card-padding: var(--spacing-3);      /* 12px */
```

---

## Accessibility

### Color Contrast

All text colors meet WCAG 2.1 AA standards:
- **Dark text on light**: `#111827` on `#ffffff` (18.4:1 ratio)
- **Light text on dark**: `rgba(255,255,255,0.95)` on gradients (>7:1 ratio)

### Typography Accessibility

- ✅ **Minimum font size**: 14px (0.875rem) for body text
- ✅ **Line height**: 1.5+ for body text for comfortable reading
- ✅ **Letter spacing**: Optimized for each scale
- ✅ **Responsive**: Scales appropriately on mobile

### Reduced Motion

The system respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus States

All interactive elements have visible focus indicators:
- Keyboard-accessible with proper focus rings
- High-contrast focus states using primary color
- Consistent `box-shadow` based focus indicators

---

## Migration Guide

### Updating Existing Components

**Step 1: Replace hard-coded font sizes**

Before:
```css
.my-heading {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 700;
}
```

After:
```css
.my-heading {
  font-size: var(--font-size-h3);
  line-height: var(--line-height-h3);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-h3);
}

/* Or use the utility class */
<h3 className="type-h3">My Heading</h3>
```

**Step 2: Replace hard-coded spacing**

Before:
```css
.my-card {
  padding: 1.25rem;
  margin-bottom: 2rem;
  gap: 1rem;
}
```

After:
```css
.my-card {
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-8);
  gap: var(--spacing-4);
}

/* Or use utility classes */
<div className="p-5 mb-8 flex gap-4">...</div>
```

**Step 3: Use semantic tokens for common patterns**

```css
/* For cards */
.card {
  padding: var(--space-card-padding);
  gap: var(--space-card-gap);
}

/* For sections */
.section {
  padding: var(--space-section-padding);
  gap: var(--space-section-gap);
}

/* For buttons */
.button {
  padding: var(--space-button-padding-y) var(--space-button-padding-x);
}
```

### Common Patterns

**Dashboard Header**
```jsx
<header className="px-6 py-10">
  <h1 className="type-h1 mb-4">Dashboard</h1>
  <p className="type-body">Welcome back!</p>
</header>
```

**Card Component**
```jsx
<div className="p-5 flex flex-col gap-4">
  <h3 className="type-h4">Card Title</h3>
  <p className="type-caption">Card description</p>
</div>
```

**Form Elements**
```jsx
<div className="mb-5">
  <label className="type-label mb-2">Email</label>
  <input className="px-4 py-3" />
</div>
```

---

## Quick Reference

### Most Common Typography Classes

```
.type-h1, .type-h2, .type-h3, .type-h4
.type-body, .type-caption
.type-label
.font-semibold, .font-bold
```

### Most Common Spacing Classes

```
Padding: .p-4, .p-5, .p-6, .px-6, .py-4
Margin: .mb-4, .mb-8, .mt-6, .mt-8
Gap: .gap-4, .gap-6, .gap-8
```

### Most Common Semantic Tokens

```
--space-card-padding
--space-section-padding
--space-content-gap
```

---

## Support

For questions or suggestions about the typography and spacing system:

1. Check this documentation first
2. Review `src/styles/typography.css` for all available tokens
3. Examine existing components (Header, Filters, StoryCard) for examples
4. Maintain consistency with the Ocean Professional theme

**Remember**: Consistency is key. Always use the established tokens rather than creating one-off spacing or typography values.
