import React, { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { SPRING } from '../constants/config';
import { theme } from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  Icon: LucideIcon;
  label: string;
  tone?: 'light' | 'dark';
  onPress: () => void;
};

/** 44x44 icon-only control used in the shared header. */
function IconPillBase({ Icon, label, tone = 'light', onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.92, ...SPRING.press, useNativeDriver: true }).start();
  }, [scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, ...SPRING.press, useNativeDriver: true }).start();
  }, [scale]);

  const dark = tone === 'dark';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          dark ? styles.shellDark : styles.shellLight,
          { transform: [{ scale }] },
        ]}>
        <Icon size={22} color={dark ? theme.colors.onDark : theme.colors.brown} strokeWidth={2.2} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: 44, height: 44 },
  shell: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shellLight: {
    backgroundColor: 'rgba(45,33,24,0.08)',
    borderColor: 'rgba(45,33,24,0.12)',
  },
  shellDark: {
    backgroundColor: 'rgba(245,235,220,0.12)',
    borderColor: 'rgba(245,235,220,0.22)',
  },
});

export const IconPill = memo(IconPillBase);
