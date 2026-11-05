import React, { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FIBER_SPECKS, SCREEN } from '../constants/config';
import { theme } from '../constants/theme';

export type BackdropVariant = 'light' | 'dark' | 'teal' | 'settings';

type Props = {
  variant: BackdropVariant;
  children: ReactNode;
};

const GRADIENTS: Record<BackdropVariant, readonly string[]> = {
  light: theme.gradients.menu,
  dark: theme.gradients.loader,
  teal: theme.gradients.summary,
  settings: theme.gradients.settings,
};

/** Opaque kraft-board base: carries the depth the photographic backdrop used to. */
const BASES: Record<BackdropVariant, readonly string[]> = {
  light: ['#E8D6B8', '#D9C19A'],
  dark: ['#3C2C1E', '#1A120C'],
  teal: ['#2A6370', '#1E150E'],
  settings: ['#ECDDC4', '#D8C4A2'],
};

const LOCATIONS: Record<BackdropVariant, number[] | undefined> = {
  light: [0, 0.52, 1],
  dark: [0, 0.55, 1],
  teal: [0, 1],
  settings: [0, 1],
};

const ANGLES: Record<BackdropVariant, { start: { x: number; y: number }; end: { x: number; y: number } }> = {
  light: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  dark: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  teal: { start: { x: 0.15, y: 0 }, end: { x: 0.85, y: 1 } },
  settings: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
};

/** Fixed, zero-cost kraft-fiber specks. Static views, never animated. */
function Fibers({ dark }: { dark: boolean }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {FIBER_SPECKS.map((s, i) => (
        <View
          key={`fiber-${i}`}
          style={{
            position: 'absolute',
            left: s.x * SCREEN.W,
            top: s.y * SCREEN.H,
            width: s.s,
            height: s.s,
            borderRadius: s.s / 2,
            backgroundColor: dark ? theme.colors.fiberLight : theme.colors.fiber,
          }}
        />
      ))}
    </View>
  );
}

function KraftBackgroundBase({ variant, children }: Props) {
  const isDark = variant === 'dark' || variant === 'teal';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={BASES[variant] as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={GRADIENTS[variant] as string[]}
        locations={LOCATIONS[variant]}
        start={ANGLES[variant].start}
        end={ANGLES[variant].end}
        style={StyleSheet.absoluteFill}
      />
      <Fibers dark={isDark} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.kraft },
  content: { flex: 1 },
});

export const KraftBackground = memo(KraftBackgroundBase);
