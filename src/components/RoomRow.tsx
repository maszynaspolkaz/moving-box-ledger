import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { percent, ratio } from '../utils/format';

type Props = {
  room: string;
  total: number;
  unpacked: number;
  width: number;
};

function RoomRowBase({ room, total, unpacked, width }: Props) {
  const barW = width - 32;
  const fillW = total > 0 ? Math.round((unpacked / total) * barW) : 0;

  return (
    <View style={[styles.row, { width }]}>
      <View style={styles.head}>
        <Text style={styles.name} numberOfLines={1}>
          {room}
        </Text>
        <Text style={styles.count} numberOfLines={1}>
          {`${ratio(unpacked, total)} · ${percent(unpacked, total)}`}
        </Text>
      </View>
      <View style={[styles.track, { width: barW }]}>
        <View style={[styles.fill, { width: fillW }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.colors.carton,
    borderRadius: theme.radius.md + 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.6,
    lineHeight: 18,
    color: theme.colors.ink,
  },
  count: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 16,
    color: theme.colors.inkSoft,
  },
  track: {
    marginTop: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(45,33,24,0.10)',
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: 3, backgroundColor: theme.colors.teal },
});

export const RoomRow = memo(RoomRowBase);
