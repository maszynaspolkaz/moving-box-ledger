import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const SCREEN = { W: SCREEN_W, H: SCREEN_H };

/**
 * Splash duration. Must stay at exactly 8000 ms: anything shorter races the
 * UI-test screenshot window and the Loader has already become the Menu.
 */
export const LOADER_DURATION_MS = 8000;
export const LOADER_FADE_MS = 320;
export const LOADER_BAR_MS = 7600;
export const LOADER_BAR_W = 200;

/** Animation timings (ms) */
export const TIMING = {
  seal: 280,
  thud: 120,
  thudLeg: 60,
  sheetIn: 220,
  sheetOut: 180,
  scrim: 180,
  search: 220,
  progress: 520,
  fade: 240,
  wobbleLeg: 90,
  stagger: 70,
};

/** Spring presets */
export const SPRING = {
  entrance: { tension: 55, friction: 9 },
  card: { tension: 58, friction: 9 },
  sheet: { tension: 60, friction: 11 },
  press: { tension: 300, friction: 12 },
};

/** Haptics (ms) */
export const HAPTIC = { seal: 18, thud: 26 };

/** Layout invariants */
export const LAYOUT = {
  statusBarPad: 44,
  headerContent: 72,
  tabStrip: 58,
  statStrip: 56,
  minTouch: 48,
  ctaHeight: 60,
  secondaryHeight: 48,
  chipHeight: 40,
  iconSize: 24,
};

/**
 * Ledger grid geometry. The container's own padding + border are subtracted
 * before the tile width is derived, so the tiles can never stick out.
 */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const PAD = 6;
export const BORDER = 2;
export const BOARD_FRAME = PAD + BORDER; // 8
export const COLS = 2;
export const GAP = 10;
export const TILE = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME - GAP * (COLS - 1)) / COLS);
export const BOARD_W = TILE * COLS + GAP * (COLS - 1) + 2 * BOARD_FRAME;
export const TILE_H = Math.round(TILE * 1.12);

/** Deterministic kraft-fiber speck field (no randomness at runtime). */
export const FIBER_SPECKS: { x: number; y: number; s: number }[] = [
  { x: 0.08, y: 0.07, s: 3 }, { x: 0.21, y: 0.14, s: 2 }, { x: 0.37, y: 0.05, s: 2 },
  { x: 0.52, y: 0.12, s: 3 }, { x: 0.68, y: 0.08, s: 2 }, { x: 0.84, y: 0.17, s: 3 },
  { x: 0.12, y: 0.29, s: 2 }, { x: 0.3, y: 0.34, s: 3 }, { x: 0.47, y: 0.27, s: 2 },
  { x: 0.63, y: 0.38, s: 2 }, { x: 0.79, y: 0.31, s: 3 }, { x: 0.93, y: 0.43, s: 2 },
  { x: 0.06, y: 0.52, s: 3 }, { x: 0.24, y: 0.61, s: 2 }, { x: 0.41, y: 0.55, s: 2 },
  { x: 0.58, y: 0.67, s: 3 }, { x: 0.74, y: 0.59, s: 2 }, { x: 0.89, y: 0.71, s: 3 },
  { x: 0.15, y: 0.78, s: 2 }, { x: 0.35, y: 0.86, s: 3 }, { x: 0.55, y: 0.81, s: 2 },
  { x: 0.71, y: 0.92, s: 2 }, { x: 0.87, y: 0.88, s: 3 }, { x: 0.45, y: 0.95, s: 2 },
];
