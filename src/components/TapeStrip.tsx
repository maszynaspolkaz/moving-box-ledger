import React, { memo } from 'react';
import { Animated, StyleSheet, type ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  width: number | `${number}%`;
  height?: number;
  rotate?: string;
  translateX?: Animated.Value;
  tone?: 'light' | 'kraft';
  style?: ViewStyle;
};

/**
 * The translucent packing-tape bar: card seal, sheet handle, loader accent.
 * Purely decorative, so it never swallows touches.
 */
function TapeStripBase({ width, height = 22, rotate, translateX, tone = 'light', style }: Props) {
  const transform: any[] = [];
  if (translateX) {
    transform.push({ translateX });
  }
  if (rotate) {
    transform.push({ rotate });
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.base,
        {
          width,
          height,
          backgroundColor: tone === 'light' ? theme.colors.tape : 'rgba(228,211,184,0.45)',
        },
        transform.length > 0 ? { transform } : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.colors.tapeEdge,
    borderBottomColor: theme.colors.tapeEdge,
  },
});

export const TapeStrip = memo(TapeStripBase);
