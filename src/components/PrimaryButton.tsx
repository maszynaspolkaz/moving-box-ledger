import React, { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { LAYOUT, SPRING } from '../constants/config';
import { theme } from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  Icon?: LucideIcon;
  tone?: 'brown' | 'teal';
  disabled?: boolean;
  onPress: () => void;
};

/**
 * Pressable is the PARENT, the Animated.View is the CHILD. The other way round
 * an Animated.View with a native-driver transform eats onPress on Android
 * release builds.
 */
function PrimaryButtonBase({ label, Icon, tone = 'brown', disabled = false, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, ...SPRING.press, useNativeDriver: true }).start();
  }, [scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, ...SPRING.press, useNativeDriver: true }).start();
  }, [scale]);

  const colors = tone === 'teal' ? theme.gradients.done : theme.gradients.primary;
  const shadow = tone === 'teal' ? theme.shadows.ctaDone : theme.shadows.cta;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, disabled ? styles.disabled : null]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.shell, shadow, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fill}>
          <View pointerEvents="none" style={styles.highlight} />
          <View style={styles.row}>
            {Icon ? <Icon size={LAYOUT.iconSize} color={theme.colors.onPrimary} strokeWidth={2.2} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: LAYOUT.ctaHeight },
  disabled: { opacity: 0.55 },
  shell: {
    width: '100%',
    height: LAYOUT.ctaHeight,
    borderRadius: theme.radius.lg,
  },
  fill: {
    width: '100%',
    height: LAYOUT.ctaHeight,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2.2,
    lineHeight: 24,
    color: theme.colors.onPrimary,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
