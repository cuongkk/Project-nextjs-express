/**
 * Design System Tokens
 * Centralized colors, spacing, typography, and elevation
 * Theme: Modern Clean SaaS Design
 */

// ============================================
// COLOR PALETTE
// ============================================
export const colors = {
  // Primary Brand Color
  primary: {
    50: "#f0f7ff",
    100: "#e0f1fe",
    200: "#bae5fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Main primary
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c3d66",
  },

  // Secondary (Darker blue for accent)
  secondary: {
    50: "#f0f4ff",
    100: "#e6eeff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1", // Secondary
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },

  // Neutral Colors
  neutral: {
    0: "#ffffff",
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Semantic Colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },

  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
  },

  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },

  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
  },
};

// ============================================
// SPACING SCALE (4px base)
// ============================================
export const spacing = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  // Headings
  h1: {
    size: "32px",
    weight: 700,
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
  },
  h2: {
    size: "28px",
    weight: 700,
    lineHeight: "1.3",
    letterSpacing: "-0.3px",
  },
  h3: {
    size: "24px",
    weight: 600,
    lineHeight: "1.35",
    letterSpacing: "0",
  },
  h4: {
    size: "20px",
    weight: 600,
    lineHeight: "1.4",
    letterSpacing: "0",
  },
  h5: {
    size: "16px",
    weight: 600,
    lineHeight: "1.5",
    letterSpacing: "0",
  },

  // Body Text
  body: {
    lg: {
      size: "16px",
      weight: 400,
      lineHeight: "1.6",
      letterSpacing: "0",
    },
    md: {
      size: "14px",
      weight: 400,
      lineHeight: "1.6",
      letterSpacing: "0",
    },
    sm: {
      size: "13px",
      weight: 400,
      lineHeight: "1.5",
      letterSpacing: "0",
    },
    xs: {
      size: "12px",
      weight: 400,
      lineHeight: "1.4",
      letterSpacing: "0.2px",
    },
  },

  // Special
  button: {
    size: "14px",
    weight: 600,
    lineHeight: "1.4",
    letterSpacing: "0",
  },
  label: {
    size: "13px",
    weight: 500,
    lineHeight: "1.5",
    letterSpacing: "0",
  },
  caption: {
    size: "12px",
    weight: 400,
    lineHeight: "1.4",
    letterSpacing: "0.3px",
  },
};

// ============================================
// ELEVATION / SHADOWS
// ============================================
export const shadows = {
  none: "none",
  xs: "0px 1px 2px rgba(0, 0, 0, 0.05)",
  sm: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
  md: "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)",
  lg: "0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)",
  xl: "0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)",
  hover: "0px 4px 12px rgba(0, 0, 0, 0.15)",
};

// ============================================
// BORDER RADIUS
// ============================================
export const borderRadius = {
  none: "0",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  "3xl": "20px",
  full: "9999px",
};

// ============================================
// TRANSITIONS
// ============================================
export const transitions = {
  fast: "all 0.15s ease-in-out",
  normal: "all 0.3s ease-in-out",
  slow: "all 0.5s ease-in-out",
};

// ============================================
// Z-INDEX SCALE
// ============================================
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  backdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
};
