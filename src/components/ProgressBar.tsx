import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { TIMING } from '../constants/config';
import { theme } from '../constants/theme';

type Props = {
  delivered: number;
  unpacked: number;
  total: number;
  width: number;
  height?: number;
};

/**
 * Two-tone kraft track. Width cannot run on the native driver, so both fills
 * explicitly use useNativeDriver: false.
 */
function ProgressBarBase({ delivered, unpacked, total, width, height = 10 }: Props) {
  const safeTotal = total > 0 ? total : 1;
  const deliveredW = Math.round(((delivered + unpacked) / safeTotal) * width);
  const unpackedW = Math.round((unpacked / safeTotal) * width);

  const a = useRef(new Animated.Value(0)).current;
  const b = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(a, {
        toValue: deliveredW,
        duration: TIMING.progress,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(b, {
        toValue: unpackedW,
        duration: TIMING.progress,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [a, b, deliveredW, unpackedW]);

  return (
    <View style={[styles.track, { width, height, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          styles.fill,
          { width: a, height, borderRadius: height / 2, backgroundColor: theme.colors.brown },
        ]}
      />
      <Animated.View
        style={[
          styles.fill,
          { width: b, height, borderRadius: height / 2, backgroundColor: theme.colors.teal },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: theme.colors.carton, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0 },
});

export const ProgressBar = memo(ProgressBarBase);
