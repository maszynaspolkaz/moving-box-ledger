/**
 * WARM_EARTHY preset, palette overridden to the kraft / carton hex set of the brief.
 * The `name` field is the preset value verbatim and must not be renamed.
 */
export const theme = {
  name: 'warm-earthy',

  colors: {
    // surfaces
    kraft: '#F5EBDC', // page background
    carton: '#E4D3B8', // card / carton face
    panel: '#EFE2CE', // controls panel
    border: '#C8A87C',

    // accents
    brown: '#A6703A', // primary (carton brown)
    brownLight: '#C08A4E',
    teal: '#1F7A8C', // reserved for DONE states only
    tealLight: '#2E97AB',
    fragile: '#D97B4D',

    // text
    ink: '#2D2118',
    inkSoft: '#8A7458',
    onDark: '#F5EBDC',
    onPrimary: '#F5EBDC',

    // washes
    dark: '#2D2118',
    fiber: 'rgba(45,33,24,0.055)',
    fiberLight: 'rgba(245,235,220,0.10)',
    tape: 'rgba(245,235,220,0.55)',
    tapeEdge: 'rgba(255,255,255,0.45)',
    scrim: 'rgba(45,33,24,0.55)',
  },

  gradients: {
    primary: ['#C08A4E', '#A6703A'] as const,
    done: ['#2E97AB', '#1F7A8C'] as const,
    loader: ['rgba(45,33,24,0.92)', 'rgba(45,33,24,0.80)', 'rgba(31,122,140,0.55)'] as const,
    menu: ['rgba(245,235,220,0.18)', 'rgba(245,235,220,0.74)', '#F5EBDC'] as const,
    game: ['rgba(245,235,220,0.90)', 'rgba(245,235,220,0.97)'] as const,
    summary: ['rgba(31,122,140,0.78)', 'rgba(45,33,24,0.88)'] as const,
    settings: ['#F5EBDC', 'rgba(245,235,220,0.72)'] as const,
    progress: ['#A6703A', '#1F7A8C'] as const,
  },

  typography: {
    hero: { fontSize: 38, fontWeight: '900' as const, letterSpacing: 7 },
    title: { fontSize: 25, fontWeight: '900' as const, letterSpacing: 0.4 },
    section: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 2.6 },
    body: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.2 },
    caption: { fontSize: 10.5, fontWeight: '600' as const, letterSpacing: 1.4 },
    marker: { fontSize: 34, fontWeight: '900' as const, letterSpacing: -1 },
    stat: { fontSize: 22, fontWeight: '800' as const, letterSpacing: 0.4 },
    button: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 2.2, lineHeight: 24 },
  },

  radius: { sm: 8, md: 12, lg: 18, xl: 24, sheet: 28, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 },

  shadows: {
    card: {
      shadowColor: '#2D2118',
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 5,
    },
    cta: {
      shadowColor: '#A6703A',
      shadowOpacity: 0.42,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 9,
    },
    ctaDone: {
      shadowColor: '#1F7A8C',
      shadowOpacity: 0.42,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 9,
    },
    sheetUp: {
      shadowColor: '#2D2118',
      shadowOpacity: 0.16,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: -6 },
      elevation: 14,
    },
    hero: {
      shadowColor: '#000000',
      shadowOpacity: 0.4,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 16,
    },
  },
} as const;

export type Theme = typeof theme;
