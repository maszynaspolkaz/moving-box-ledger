import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Boxes, CheckCircle, PackageCheck, Settings, Truck } from 'lucide-react-native';
import { IconPill } from '../components/IconPill';
import { KraftBackground } from '../components/KraftBackground';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatRow } from '../components/StatCard';
import { TapeStrip } from '../components/TapeStrip';
import { SCREEN, SPRING } from '../constants/config';
import { theme } from '../constants/theme';
import type { Counters } from '../game/ledger';
import { percent } from '../utils/format';

type Props = {
  moveName: string;
  counters: Counters;
  onStart: () => void;
  onFind: () => void;
  onSettings: () => void;
};

const SHEET_PAD = 20;
const BAR_W = Math.min(SCREEN.W - SHEET_PAD * 2, 380);

export function MenuScreen({ moveName, counters, onStart, onFind, onSettings }: Props) {
  const sheetY = useRef(new Animated.Value(90)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const enter = Animated.spring(sheetY, {
      toValue: 0,
      ...SPRING.sheet,
      useNativeDriver: true,
    });
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
  }, [float, sheetY]);

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
        key: 'delivered',
        Icon: Truck,
        value: counters.delivered + counters.unpacked,
        label: 'DELIVERED',
        valueColor: theme.colors.brownLight,
      },
      {
        key: 'unpacked',
        Icon: CheckCircle,
        value: counters.unpacked,
        label: 'UNPACKED',
        valueColor: theme.colors.teal,
      },
    ],
    [counters.delivered, counters.total, counters.unpacked],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(245,235,220,0.4)" />
      <KraftBackground variant="light">
        <ScreenHeader
          title="LEDGER"
          leftSlot={<Boxes size={26} color={theme.colors.brown} strokeWidth={2.2} />}
          rightSlot={<IconPill Icon={Settings} label="Settings" onPress={onSettings} />}
        />

        <View style={styles.hero}>
          <Animated.View pointerEvents="none" style={{ transform: [{ translateY: floatY }] }}>
            <View style={styles.heroSprite}>
              <PackageCheck size={150} color={theme.colors.brown} strokeWidth={1.3} />
            </View>
          </Animated.View>
          <View pointerEvents="none" style={styles.groundShadow} />
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheet, theme.shadows.sheetUp, { transform: [{ translateY: sheetY }] }]}>
          <TapeStrip width={56} height={5} tone="kraft" style={styles.handle} />

          <Text style={styles.sectionLabel}>CURRENT MOVE</Text>
          <Text style={styles.moveName} numberOfLines={1}>
            {moveName}
          </Text>

          <View style={styles.progressRow}>
            <ProgressBar
              delivered={counters.delivered}
              unpacked={counters.unpacked}
              total={counters.total}
              width={BAR_W}
            />
            <Text style={styles.progressLabel}>
              {percent(counters.unpacked, counters.total) + ' UNPACKED'}
            </Text>
          </View>

          <View style={styles.statWrap}>
            <StatRow items={stats} />
          </View>

          <Text style={styles.hint}>TAP A BOX NUMBER TO SEE WHAT IS INSIDE</Text>

          <PrimaryButton label="START PACKING" Icon={PackageCheck} onPress={onStart} />

          <View style={styles.secondaryRow}>
            <SecondaryButton label="FIND AN ITEM" tone="brown" flex onPress={onFind} />
            <SecondaryButton label="SETTINGS" tone="brown" flex onPress={onSettings} />
          </View>
        </Animated.View>
      </KraftBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.kraft },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroSprite: { width: 210, height: 210, alignItems: 'center', justifyContent: 'center' },
  groundShadow: {
    width: 160,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(45,33,24,0.16)',
    transform: [{ scaleX: 1.3 }],
    marginTop: 4,
  },
  sheet: {
    backgroundColor: theme.colors.kraft,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(166,112,58,0.22)',
    paddingHorizontal: SHEET_PAD,
    paddingTop: 18,
    paddingBottom: 24,
  },
  handle: { alignSelf: 'center', borderRadius: 3, marginBottom: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.6,
    lineHeight: 15,
    color: theme.colors.inkSoft,
  },
  moveName: {
    marginTop: 4,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 0.4,
    lineHeight: 31,
    color: theme.colors.ink,
  },
  progressRow: { marginTop: 14 },
  progressLabel: {
    marginTop: 7,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 14,
    color: theme.colors.teal,
  },
  statWrap: { marginTop: 14 },
  hint: {
    marginTop: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1.4,
    lineHeight: 15,
    color: theme.colors.inkSoft,
  },
  secondaryRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
