// src/utils/theme.ts

// 1. Colors
export const COLORS = {
  brandPrimary:   '#dd1a1b',
  brandSecondary: '#e76415',
  brandTertiary:  '#ffeb00',
} as const

// 2. Fonts (pointing at your /public/assets/fonts files)
export const FONTS = {
  heading: "'Permanent Marker', sans-serif",
  body:    "'Bangers', sans-serif",
  code:    "'Share Tech Mono', monospace, sans-serif",
}

// 3. Full theme object
export const theme = {
  colors: COLORS,
  fonts:  FONTS,
}

export type Theme = typeof theme
