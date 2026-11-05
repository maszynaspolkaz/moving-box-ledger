import React, { memo, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { TILE, TILE_H } from '../constants/config';
import { theme } from '../constants/theme';
import type { BoxStatus } from '../game/ledger';
import { useSealAnimation } from '../hooks/useSealAnimation';
import { useThud } from '../hooks/useThud';
import { boxLabel, itemsLabel } from '../utils/format';
import { TapeStrip } from './TapeStrip';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const STATUS_COLOR: Record<BoxStatus, string> = {
  packed: theme.colors.brown,
  delivered: theme.colors.brownLight,
  unpacked: theme.colors.teal,
};

type Props = {
  id: string;
  number: number;
  room: string;
  itemCount: number;
  status: BoxStatus;
  fragile: boolean;
  sealing: boolean;
  onPress: (id: string) => void;
};

/**
 * A carton seen from above: flap seam, marker number, status dot and the
 * packing-tape seal. Memoized and fed only primitives so the virtualized list
 * can skip re-rendering untouched tiles.
 */
function BoxCardBase({ id, number, room, itemCount, status, fragile, sealing, onPress }: Props) {
  const tapeX = useSealAnimation(sealing, TILE);
  const scaleY = useThud(status);
  const handlePress = useCallback(() => onPress(id), [id, onPress]);

  const done = status === 'unpacked';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Box ${number}, ${room}, ${status}`}
      hitSlop={HIT}
      onPress={handlePress}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          theme.shadows.card,
          done ? styles.cardDone : null,
          { transform: [{ scaleY }] },
        ]}>
        <View pointerEvents="none" style={styles.seam} />

        <Text style={styles.number} numberOfLines={1}>
          {boxLabel(number)}
        </Text>

        <View style={[styles.dot, { backgroundColor: STATUS_COLOR[status] }]} />

        {fragile ? (
          <View style={styles.fragile}>
            <AlertTriangle size={18} color={theme.colors.fragile} strokeWidth={2.4} />
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.room} numberOfLines={1}>
            {room}
          </Text>
          <Text style={styles.count} numberOfLines={1}>
            {itemsLabel(itemCount)}
          </Text>
        </View>

        <TapeStrip width="100%" height={22} translateX={tapeX} style={styles.tape} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: TILE, height: TILE_H },
  card: {
    width: TILE,
    height: TILE_H,
    backgroundColor: theme.colors.carton,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  cardDone: {
    borderColor: theme.colors.teal,
    backgroundColor: 'rgba(31,122,140,0.10)',
  },
  seam: {
    position: 'absolute',
    top: 0,
    left: TILE / 2 - 1,
    width: 2,
    height: Math.round(TILE_H * 0.55),
    backgroundColor: 'rgba(166,112,58,0.35)',
  },
  number: {
    position: 'absolute',
    top: 12,
    left: 12,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 40,
    color: theme.colors.ink,
    transform: [{ rotate: '-2deg' }],
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  fragile: { position: 'absolute', right: 10, bottom: 34 },
  footer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 10,
  },
  room: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: 15,
    color: theme.colors.inkSoft,
  },
  count: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    color: theme.colors.brown,
  },
  tape: {
    position: 'absolute',
    left: 0,
    top: Math.round(TILE_H * 0.44),
  },
});

export const BoxCard = memo(BoxCardBase);
