// Design tokens ported from the traveler web app:
// ~/Development/rent-a-view/DESIGN.md and the :root block in src/index.css.
// Use these instead of hardcoding values in components.

export const colors = {
  page: '#f7f7f7', // every screen background
  card: 'rgba(0,0,0,0.04)', // borderless cards: black at 4% over the page
  canvas: '#ffffff', // raised controls inside cards: inputs, chips, sheets
  ink: '#1d1d1b', // text, primary buttons, selected outlines, pins
  body: '#4a4945',
  muted: '#6b6a65',
  mutedSoft: '#9a9993',
  hairline: '#dcdbd6',
  hairlineSoft: '#e7e6e1',
  accent: '#ffdc5c', // sunny yellow, used sparingly: section labels (Kicker) and the tour-guide badge
  accentActive: '#ffcb30',
  accentTint: '#fff3c4',
  accentInk: '#6b5200',
  sunrise: '#ffb854', // warm CTA on photography (landing hero)
  cream: '#fffceb', // type over photography
  surfaceStrong: 'rgba(0,0,0,0.04)',
  success: '#166534',
  successTint: '#e7f5ea',
  warning: '#8a4b00',
  warningTint: '#ffecd2',
  live: '#dc2626',
  filmerRing: '#2563eb', // the filmer's position dot, as on the web map
  successBright: '#4ade80', // success on dark camera screens
  successVivid: '#16a34a', // done-and-paid check on light screens
  white: '#ffffff',
  black: '#000000',
  // Camera and call screens are dark so footage reads as real
  camera: '#0d0d0c',
  cameraTile: '#2b2a28', // the other person's tile in a call
  onDarkWarning: '#fdba74', // overtime hints on dark camera screens
  scrim: 'rgba(0,0,0,0.45)',
} as const

export const radius = { sm: 12, md: 20, lg: 28, pill: 999 } as const

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 64,
} as const

// Static instances of Fraunces with SOFT 100 (as on the web), cut from the
// OFL variable font into assets/fonts. Inter comes from @expo-google-fonts.
export const fonts = {
  display: 'FrauncesSoft-Display', // 600, WONK on: big quirky headlines
  serif: 'FrauncesSoft-Medium', // 500: screen titles, totals
  serifSemiBold: 'FrauncesSoft-SemiBold', // 600: wordmark
  serifItalic: 'FrauncesSoft-Italic', // 400 italic: leads, captions
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const

// Strict type scale: 12 / 14 / 16 / 20 / 24 / 32 / 44 / 72. No all-caps.
// Letter spacing is in points here (the web uses em).
export const type = {
  hero: { fontFamily: fonts.display, fontSize: 44, lineHeight: 44, letterSpacing: -1.5 },
  display: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 35, letterSpacing: -0.96 },
  headline: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 28, letterSpacing: -0.6 },
  lead: { fontFamily: fonts.serifItalic, fontSize: 20, lineHeight: 26, color: colors.muted },
  title: { fontFamily: fonts.sansSemiBold, fontSize: 16, lineHeight: 22 },
  titleLarge: { fontFamily: fonts.sansSemiBold, fontSize: 20, lineHeight: 26 },
  // Section headings sit below the serif screen title: smaller and muted
  section: { fontFamily: fonts.sansSemiBold, fontSize: 16, lineHeight: 22 }, // muted by default (see Text)
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.sansSemiBold, fontSize: 14, lineHeight: 20 },
  button: { fontFamily: fonts.sansMedium, fontSize: 16, lineHeight: 20 },
  caption: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 16 },
  captionStrong: { fontFamily: fonts.sansSemiBold, fontSize: 12, lineHeight: 16 },
} as const

// The one shadow: only for floating things (sheets, map controls, badges
// over photos). React Native's new architecture supports CSS box-shadow.
export const shadow = {
  boxShadow:
    '0 0 0 1px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08)',
} as const

// White cards that stand out on the grey page: hairline outline + very soft shadow
export const raised = {
  borderColor: 'rgba(0,0,0,0.06)',
  borderWidth: 1,
  boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)',
} as const

export const buttonHeight = 48
