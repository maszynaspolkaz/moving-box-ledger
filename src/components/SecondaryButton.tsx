import React, { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { LAYOUT, SPRING } from '../constants/config';
import { theme } from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export type Tone = 'brown' | 'teal' | 'neutral' | 'tealSolid';

type Props = {
  label: string;
  tone?: Tone;
  flex?: boolean;
  onPress: () => void;
};

const TONES: Record<Tone, { bg: string; border: string; text: string }> = {
  brown: { bg: 'rgba(166,112,58,0.10)', border: 'rgba(166,112,58,0.28)', text: theme.colors.brown },
  teal: { bg: 'rgba(31,122,140,0.12)', border: theme.colors.teal, text: theme.colors.teal },
  tealSolid: { bg: theme.colors.teal, border: theme.colors.teal, text: theme.colors.onDark },
  neutral: { bg: 'rgba(45,33,24,0.08)', border: 'rgba(45,33,24,0.18)', text: theme.colors.ink },
};

function SecondaryButtonBase({ label, tone = 'brown', flex = false, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const palette = TONES[tone];

  const onPressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, ...SPRING.press, useNativeDriver: true }).start();
  }, [scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, ...SPRING.press, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, flex ? styles.flex : styles.full]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          { backgroundColor: palette.bg, borderColor: palette.border, transform: [{ scale }] },
        ]}>
        <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { height: LAYOUT.secondaryHeight },
  flex: { flex: 1 },
  full: { width: '100%' },
  shell: {
    width: '100%',
    height: LAYOUT.secondaryHeight,
    borderRadius: theme.radius.md + 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: 18,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
