import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AlertTriangle, Package } from 'lucide-react-native';
import { SCREEN, TIMING } from '../constants/config';
import { theme } from '../constants/theme';
import { advanceLabel, canAdvance, ROOMS, statusLabel, type Box, type Room } from '../game/ledger';
import { QUICK_ITEMS } from '../game/seed';
import { boxLabel } from '../utils/format';
import { Chip } from './Chip';
import { SecondaryButton } from './SecondaryButton';
import { TapeStrip } from './TapeStrip';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const SHEET_H = Math.round(SCREEN.H * 0.64);

type Props = {
  box: Box | null;
  onClose: () => void;
  onAdvance: (id: string) => void;
  onToggleFragile: (id: string) => void;
  onChangeRoom: (id: string, room: Room) => void;
  onAddItem: (id: string, item: string) => void;
};

function BoxDetailSheetBase({
  box,
  onClose,
  onAdvance,
  onToggleFragile,
  onChangeRoom,
  onAddItem,
}: Props) {
  const visible = box !== null;
  const slide = useRef(new Animated.Value(SHEET_H)).current;
  const scrim = useRef(new Animated.Value(0)).current;
  const wobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(slide, {
        toValue: visible ? 0 : SHEET_H,
        duration: visible ? TIMING.sheetIn : TIMING.sheetOut,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scrim, {
        toValue: visible ? 1 : 0,
        duration: TIMING.scrim,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [visible, slide, scrim]);

  const fragile = box ? box.fragile : false;

  useEffect(() => {
    if (!visible || !fragile) {
      return;
    }
    const leg = TIMING.wobbleLeg;
    const anim = Animated.sequence([
      Animated.timing(wobble, { toValue: 1, duration: leg, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: -1, duration: leg, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: 0, duration: leg, useNativeDriver: true }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [visible, fragile, wobble]);

  const id = box ? box.id : '';

  const handleAdvance = useCallback(() => onAdvance(id), [id, onAdvance]);
  const handleFragile = useCallback(() => onToggleFragile(id), [id, onToggleFragile]);
  const handleRoom = useCallback(
    (label: string) => onChangeRoom(id, label as Room),
    [id, onChangeRoom],
  );
  const handleItem = useCallback((label: string) => onAddItem(id, label), [id, onAddItem]);

  const rotate = wobble.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  if (!box) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.scrim, { opacity: scrim }]} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close box details"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, theme.shadows.sheetUp, { transform: [{ translateY: slide }] }]}>
        <TapeStrip width={56} height={5} tone="kraft" style={styles.handle} />

        <View style={styles.headRow}>
          <Animated.Text style={[styles.marker, { transform: [{ rotate }] }]}>
            {boxLabel(box.number)}
          </Animated.Text>
          <View style={styles.headRight}>
            <Text style={styles.status} numberOfLines={1}>
              {statusLabel(box.status)}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Toggle fragile"
              hitSlop={HIT}
              onPress={handleFragile}
              style={[styles.fragilePill, box.fragile ? styles.fragileOn : null]}>
              <AlertTriangle
                size={18}
                color={box.fragile ? theme.colors.onPrimary : theme.colors.fragile}
                strokeWidth={2.4}
              />
              <Text
                style={[styles.fragileLabel, box.fragile ? styles.fragileLabelOn : null]}
                numberOfLines={1}>
                FRAGILE
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.photoRow}>
          <View style={styles.photo}>
            <Package size={52} color={theme.colors.brown} strokeWidth={1.4} />
          </View>
          <View style={styles.photoMeta}>
            <Text style={styles.sectionLabelTight}>CONTENTS</Text>
            <ScrollView style={styles.items} showsVerticalScrollIndicator={false}>
              {box.items.length > 0 ? (
                box.items.map(item => (
                  <Text key={item} style={styles.item} numberOfLines={1}>
                    {'· ' + item.toUpperCase()}
                  </Text>
                ))
              ) : (
                <Text style={styles.itemEmpty}>NOTHING LOGGED YET</Text>
              )}
            </ScrollView>
          </View>
        </View>

        <Text style={styles.sectionLabel}>QUICK ADD</Text>
        <View style={styles.chipRow}>
          {QUICK_ITEMS.slice(0, 4).map(q => (
            <Chip key={q} label={q} active={false} tone="brown" onPress={handleItem} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>ROOM</Text>
        <View style={styles.chipRow}>
          {ROOMS.slice(0, 4).map(r => (
            <Chip key={r} label={r} active={box.room === r} tone="brown" onPress={handleRoom} />
          ))}
        </View>

        <View style={styles.actions}>
          {canAdvance(box.status) ? (
            <SecondaryButton
              label={advanceLabel(box.status)}
              tone={box.status === 'packed' ? 'teal' : 'tealSolid'}
              onPress={handleAdvance}
            />
          ) : (
            <SecondaryButton label="BOX IS UNPACKED" tone="tealSolid" onPress={onClose} />
          )}
          <View style={styles.actionGap} />
          <SecondaryButton label="CLOSE" tone="neutral" onPress={onClose} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.scrim },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_H,
    backgroundColor: theme.colors.kraft,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  handle: { alignSelf: 'center', borderRadius: 3, marginBottom: 14 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  marker: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 46,
    color: theme.colors.ink,
  },
  headRight: { alignItems: 'flex-end', gap: 8 },
  status: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    lineHeight: 15,
    color: theme.colors.teal,
  },
  fragilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217,123,77,0.5)',
    backgroundColor: 'rgba(217,123,77,0.12)',
  },
  fragileOn: { backgroundColor: theme.colors.fragile, borderColor: theme.colors.fragile },
  fragileLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 18,
    color: theme.colors.fragile,
  },
  fragileLabelOn: { color: theme.colors.onPrimary },
  photoRow: { flexDirection: 'row', gap: 14, marginTop: 14 },
  photo: {
    width: 150,
    height: 118,
    borderRadius: 10,
    backgroundColor: theme.colors.carton,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoMeta: { flex: 1 },
  items: { maxHeight: 96, marginTop: 6 },
  item: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: theme.colors.ink,
  },
  itemEmpty: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    lineHeight: 18,
    color: theme.colors.inkSoft,
  },
  sectionLabel: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.6,
    lineHeight: 15,
    color: theme.colors.inkSoft,
  },
  sectionLabelTight: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.6,
    lineHeight: 15,
    color: theme.colors.inkSoft,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  actions: { marginTop: 'auto', paddingTop: 14 },
  actionGap: { height: 10 },
});

export const BoxDetailSheet = memo(BoxDetailSheetBase);
