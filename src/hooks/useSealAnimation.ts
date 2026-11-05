import { useEffect, useRef } from 'react';
import { Animated, Easing, Vibration } from 'react-native';
import { HAPTIC, TIMING } from '../constants/config';

/**
 * The 280 ms packing-tape slide. Drives transform only, so the native driver
 * is safe here.
 */
export function useSealAnimation(active: boolean, distance: number) {
  const translateX = useRef(new Animated.Value(active ? -distance : 0)).current;
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) {
      return;
    }
    hasRun.current = true;
    Vibration.vibrate(HAPTIC.seal);
    const anim = Animated.timing(translateX, {
      toValue: 0,
      duration: TIMING.seal,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [active, translateX]);

  return translateX;
}
