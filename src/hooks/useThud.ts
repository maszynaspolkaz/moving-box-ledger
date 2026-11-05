import { useEffect, useRef } from 'react';
import { Animated, Vibration } from 'react-native';
import { HAPTIC, TIMING } from '../constants/config';

/**
 * The 120 ms "box lands on the floor" squash, fired whenever `trigger`
 * changes after the first render. Transform only -> native driver is safe.
 */
export function useThud(trigger: string | number) {
  const scaleY = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    Vibration.vibrate(HAPTIC.thud);
    const anim = Animated.sequence([
      Animated.timing(scaleY, {
        toValue: 0.92,
        duration: TIMING.thudLeg,
        useNativeDriver: true,
      }),
      Animated.timing(scaleY, {
        toValue: 1,
        duration: TIMING.thudLeg,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [trigger, scaleY]);

  return scaleY;
}
