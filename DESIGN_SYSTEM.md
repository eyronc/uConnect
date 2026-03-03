# Refined Academic Design System

## Color Palette

### Primary Colors

```css
/* Background & Surfaces */
--background: #F8F7F4        /* Warm off-white background */
--card-background: #FFFFFF    /* Pure white for cards */
--border: #E8E4DE            /* Subtle warm gray borders */

/* Sidebar (Dark Theme) */
--sidebar-bg: #1C1917        /* Deep charcoal */
--sidebar-border: #292524    /* Lighter charcoal */
--sidebar-text: #FFFFFF      /* White text */
--sidebar-muted: #A8A29E     /* Muted text on dark */

/* Brand Colors */
--primary-blue: #2563EB      /* Professional blue for CTAs */
--accent-amber: #F59E0B      /* Warm amber for highlights */

/* Text Colors */
--text-primary: #1C1917      /* Primary text (charcoal) */
--text-secondary: #78716C    /* Secondary text (medium gray) */
--text-muted: #A8A29E        /* Muted text (light gray) */

/* Semantic Colors */
--success: #10B981           /* Green for success states */
--warning: #F59E0B           /* Amber for warnings */
--error: #EF4444             /* Red for errors */
```

## Typography

### Font Families

```css
/* Display/Headings */
font-family: 'Fraunces', serif;

/* Body Text */
font-family: 'DM Sans', 'Plus Jakarta Sans', sans-serif;
```

### Font Sizes

```css
/* Headings */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-2xl: 1.5rem;    /* 24px - Section headings */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-lg: 1.125rem;   /* 18px - Subsections */

/* Body */
--text-base: 1rem;     /* 16px - Default body text */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-xs: 0.75rem;    /* 12px - Captions */
```

### Font Weights

```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Spacing Scale

Based on 4px grid system:

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

## Border Radius

```css
--radius-sm: 0.375rem;   /* 6px - Small elements */
--radius-md: 0.5rem;     /* 8px - Default */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Large cards */
--radius-2xl: 1.5rem;    /* 24px - Hero sections */
--radius-full: 9999px;   /* Fully rounded */
```

## Shadows

```css
/* Card Shadows */
--shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-card-hover: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Large Shadows */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

## Component Styles

### Buttons

#### Primary Button
```jsx
className="h-12 px-6 rounded-lg bg-[#2563EB] text-white font-medium
           hover:opacity-90 transition-opacity"
```

#### Secondary Button
```jsx
className="h-12 px-6 rounded-lg border border-[#E8E4DE] bg-white text-[#1C1917]
           font-medium hover:bg-[#F8F7F4] transition-colors"
```

#### Demo/Tertiary Button
```jsx
className="h-12 px-6 rounded-lg bg-white/10 text-gray-300 font-medium
           hover:bg-white/15 hover:text-white transition-colors"
```

### Input Fields

```jsx
className="h-12 w-full rounded-lg border border-[#E8E4DE] bg-white
           pl-10 pr-4 text-[#1C1917] placeholder-[#A8A29E]
           focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20
           transition-colors"
```

### Cards

```jsx
className="rounded-xl border border-[#E8E4DE] bg-white p-6
           hover:shadow-lg transition-shadow"
```

### Sidebar Navigation Item

#### Active State
```jsx
className="flex items-center gap-3 px-3 py-2.5 rounded-lg
           bg-white/15 text-white font-medium"
```

#### Inactive State
```jsx
className="flex items-center gap-3 px-3 py-2.5 rounded-lg
           text-gray-400 hover:text-white hover:bg-white/10
           font-medium transition-all"
```

## Layout Guidelines

### Page Structure

```jsx
<Layout title="Page Title">
  <div className="space-y-6">
    {/* Page Header */}
    <div>
      <h2 className="text-2xl font-semibold text-[#1C1917]">Section Title</h2>
      <p className="text-[#78716C] mt-1">Description text</p>
    </div>

    {/* Content Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Cards */}
    </div>
  </div>
</Layout>
```

### Responsive Breakpoints

```css
/* Mobile First */
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Small laptops */
xl:  1280px  /* Desktops */
2xl: 1400px  /* Large desktops */
```

### Grid Patterns

```jsx
/* Two-column layout */
className="grid grid-cols-1 lg:grid-cols-2 gap-6"

/* Three-column layout */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

/* Four-column stats */
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"

/* Sidebar + Main */
className="grid grid-cols-1 lg:grid-cols-3 gap-6"
/* With: lg:col-span-2 for main content */
```

## Animation & Transitions

### Standard Transitions

```css
transition-colors  /* Color changes */
transition-opacity /* Opacity changes */
transition-all     /* All properties */
transition-shadow  /* Shadow changes */
```

### Durations

```css
duration-150  /* Fast interactions (150ms) */
duration-200  /* Default (200ms) */
duration-300  /* Smooth animations (300ms) */
```

### Hover States

```jsx
/* Standard hover */
hover:bg-[#F8F7F4]

/* Opacity hover */
hover:opacity-90

/* Scale hover (for cards) */
hover:scale-[1.02]

/* Shadow hover */
hover:shadow-lg
```

## Accessibility

### Focus States

```jsx
focus:outline-none
focus:ring-2
focus:ring-[#2563EB]/20
focus:border-[#2563EB]
```

### Color Contrast

- Primary text (#1C1917) on white: 17.3:1 (AAA)
- Secondary text (#78716C) on white: 4.6:1 (AA)
- White text on sidebar (#FFFFFF on #1C1917): 17.3:1 (AAA)
- Primary blue (#2563EB) on white: 6.4:1 (AA)

### Interactive Elements

- Minimum touch target: 44x44px (iOS) / 48x48px (Android)
- Clear focus indicators on all interactive elements
- Sufficient spacing between clickable items

## Icon Usage

### Lucide React Icons

```jsx
import { Icon } from 'lucide-react';

/* Standard size */
<Icon className="h-5 w-5" />

/* Small size */
<Icon className="h-4 w-4" />

/* Large size */
<Icon className="h-6 w-6" />

/* With color */
<Icon className="h-5 w-5 text-[#2563EB]" />
```

### Common Icons

- Navigation: `LayoutDashboard`, `BookOpen`, `Calendar`, `Users`
- Actions: `Plus`, `Trash2`, `Edit`, `Search`, `Filter`
- Status: `CheckCircle2`, `AlertCircle`, `Clock`, `X`
- UI: `ChevronRight`, `ChevronDown`, `Menu`, `Bell`

## Best Practices

### Do's

- Use exact hex colors from the palette
- Maintain consistent spacing (4px grid)
- Follow responsive patterns
- Implement proper loading states
- Use semantic HTML
- Add aria labels for accessibility
- Test on mobile devices

### Don'ts

- Don't use arbitrary colors
- Don't skip hover states
- Don't ignore loading states
- Don't use inconsistent spacing
- Don't forget focus indicators
- Don't use fixed heights for text content

## Examples

### Stat Card

```jsx
<div className="rounded-xl border border-[#E8E4DE] bg-white p-6">
  <div className="flex items-center gap-3">
    <div className="p-3 bg-[#2563EB]/10 rounded-lg">
      <Icon className="h-6 w-6 text-[#2563EB]" />
    </div>
    <div>
      <p className="text-2xl font-bold text-[#1C1917]">3.74</p>
      <p className="text-sm text-[#78716C]">Current GPA</p>
    </div>
  </div>
</div>
```

### List Item

```jsx
<div className="flex items-center gap-4 p-4 border border-[#E8E4DE]
                rounded-lg hover:border-[#2563EB]/50
                transition-colors cursor-pointer">
  <div className="flex-1">
    <p className="font-medium text-[#1C1917]">Item Title</p>
    <p className="text-sm text-[#78716C]">Description</p>
  </div>
  <ChevronRight className="h-5 w-5 text-[#78716C]" />
</div>
```

### Status Badge

```jsx
/* Success */
<span className="px-2.5 py-1 rounded-full text-xs font-semibold
               bg-[#10B981]/10 text-[#10B981]">
  Active
</span>

/* Warning */
<span className="px-2.5 py-1 rounded-full text-xs font-semibold
               bg-[#F59E0B]/10 text-[#F59E0B]">
  Pending
</span>

/* Error */
<span className="px-2.5 py-1 rounded-full text-xs font-semibold
               bg-[#EF4444]/10 text-[#EF4444]">
  Overdue
</span>
```
