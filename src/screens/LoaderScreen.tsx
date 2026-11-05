import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Boxes } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { KraftBackground } from '../components/KraftBackground';
import { TapeStrip } from '../components/TapeStrip';
import {
  LOADER_BAR_MS,
  LOADER_BAR_W,
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
} from '../constants/config';
import { theme } from '../constants/theme';

type Props = { onDone: () => void };

/**
 * Deliberately far darker than the Menu: a near-opaque walnut-to-teal wash on
 * the same artwork, no chips and no CTA.
 */
export function LoaderScreen({ onDone }: Props) {
  const cardScale = useRef(new Animated.Value(0.82)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(14)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const intro = Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, tension: 52, friction: 7, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(260),
        Animated.parallel([
          Animated.timing(titleY, { toValue: 0, duration: 380, useNativeDriver: true }),
          Animated.timing(titleOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        ]),
      ]),
    ]);

    // width cannot be driven natively
    const progress = Animated.timing(bar, {
      toValue: LOADER_BAR_W,
      duration: LOADER_BAR_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    intro.start();
    progress.start();

    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => onDone());
    }, LOADER_DURATION_MS - LOADER_FADE_MS);

    return () => {
      clearTimeout(timer);
      intro.stop();
      progress.stop();
    };
  }, [bar, cardOpacity, cardScale, onDone, screenOpacity, titleOpacity, titleY]);

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="#2D2118" />
      <KraftBackground variant="dark">
        <View style={styles.center}>
          {/* the tape accent sits well above the logo card, clear of every letter */}
          <TapeStrip width={240} height={26} rotate="-3deg" tone="kraft" style={styles.tape} />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.card,
              theme.shadows.hero,
              { opacity: cardOpacity, transform: [{ scale: cardScale }] },
            ]}>
            <Boxes size={96} color={theme.colors.brownLight} strokeWidth={1.5} />
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[styles.titleWrap, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
            <Text style={styles.titleTop}>MOVING BOX</Text>
            <Text style={styles.titleMain}>LEDGER</Text>
            <Text style={styles.subtitle}>EVERY BOX. EVERY ROOM. OFFLINE.</Text>
          </Animated.View>

          <View style={styles.track}>
            <Animated.View style={[styles.fillWrap, { width: bar }]}>
              <LinearGradient
                colors={theme.gradients.progress as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </KraftBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.dark },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  tape: { marginBottom: 40 },
  card: {
    width: 180,
    height: 180,
    borderRadius: 28,
    backgroundColor: 'rgba(245,235,220,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(245,235,220,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { alignItems: 'center', marginTop: 30 },
  titleTop: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 4,
    lineHeight: 32,
    color: theme.colors.onDark,
  },
  titleMain: {
    marginTop: 2,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 7,
    lineHeight: 46,
    color: '#E4D3B8',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.4,
    lineHeight: 16,
    color: 'rgba(228,211,184,0.72)',
  },
  track: {
    marginTop: 34,
    width: 200,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(245,235,220,0.14)',
    overflow: 'hidden',
  },
  fillWrap: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { flex: 1 },
  loading: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    lineHeight: 14,
    color: 'rgba(228,211,184,0.55)',
  },
});
