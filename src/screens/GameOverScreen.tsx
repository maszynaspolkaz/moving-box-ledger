import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Boxes, CalendarDays, CheckCircle, Home, RotateCcw } from 'lucide-react-native';
import { IconPill } from '../components/IconPill';
import { KraftBackground } from '../components/KraftBackground';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatRow } from '../components/StatCard';
import { TapeStrip } from '../components/TapeStrip';
import { SCREEN } from '../constants/config';
import { theme } from '../constants/theme';
import type { Counters } from '../game/ledger';

type Props = {
  counters: Counters;
  days: number;
  onPlayAgain: () => void;
  onMenu: () => void;
};

const CARD_W = Math.min(SCREEN.W - 48, 340);

export function GameOverScreen({ counters, days, onPlayAgain, onMenu }: Props) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const enter = Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 58, friction: 9, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]);
    enter.start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1300, useNativeDriver: true }),
      ]),
    );
    loop.start();

    return () => {
      enter.stop();
      loop.stop();
    };
  }, [float, opacity, scale]);

  const floatY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  const stats = useMemo(
    () => [
      {
        key: 'boxes',
        Icon: Boxes,
        value: counters.total,
        label: 'BOXES',
        valueColor: theme.colors.brown,
      },
      {
        key: 'unpacked',
        Icon: CheckCircle,
        value: counters.unpacked,
        label: 'UNPACKED',
        valueColor: theme.colors.teal,
      },
      {
        key: 'days',
        Icon: CalendarDays,
        value: days,
        label: 'DAYS',
        valueColor: theme.colors.fragile,
      },
    ],
    [counters.total, counters.unpacked, days],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1F7A8C" />
      <KraftBackground variant="teal">
        <ScreenHeader
          title="MOVE SUMMARY"
          tone="dark"
          leftSlot={<IconPill Icon={Home} label="Back to menu" tone="dark" onPress={onMenu} />}
        />

        <View style={styles.center}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.card,
              theme.shadows.hero,
              { opacity, transform: [{ scale }] },
            ]}>
            <Animated.View
              pointerEvents="none"
              style={[styles.spriteWrap, { transform: [{ translateY: floatY }] }]}>
              <CheckCircle size={112} color={theme.colors.teal} strokeWidth={1.6} />
            </Animated.View>

            {/* decoration stays clear of the heading's bounding box */}
            <TapeStrip width={120} height={8} tone="kraft" style={styles.tape} />

            <Text style={styles.title}>MOVE COMPLETE</Text>
            <Text style={styles.subtitle}>
              {`${counters.total} BOXES · ${counters.roomsUsed} ROOMS · 0 LOST`}
            </Text>

            <View style={styles.statWrap}>
              <StatRow items={stats} />
            </View>

            <Text style={styles.hint}>SAVED TO PAST MOVES</Text>

            <PrimaryButton label="PACK AGAIN" Icon={RotateCcw} tone="teal" onPress={onPlayAgain} />

            <View style={styles.secondaryWrap}>
              <SecondaryButton label="MENU" tone="neutral" onPress={onMenu} />
            </View>
          </Animated.View>
        </View>
      </KraftBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.dark },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    width: CARD_W,
    backgroundColor: theme.colors.kraft,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 24,
    alignItems: 'center',
  },
  spriteWrap: { width: 128, height: 128, alignItems: 'center', justifyContent: 'center' },
  tape: { marginTop: 8, marginBottom: 16, borderRadius: 4 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 32,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 17,
    color: theme.colors.inkSoft,
    textAlign: 'center',
  },
  statWrap: { width: '100%', marginTop: 18 },
  hint: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1.4,
    lineHeight: 15,
    color: theme.colors.inkSoft,
    textAlign: 'center',
  },
  secondaryWrap: { width: '100%', marginTop: 12 },
});
