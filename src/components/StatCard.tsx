import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';

type Props = {
  Icon: LucideIcon;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * The single stat pill used on Menu, the Game stat strip and GameOver.
 * `width: '100%'` on purpose: the parent slot already owns `flex: 1`, and
 * flex:1 inside flex:1 collapses the card to a few pixels tall.
 */
function StatCardBase({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '22' }]}>
        <Icon size={22} color={valueColor} strokeWidth={2.4} />
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    backgroundColor: theme.colors.carton,
    borderRadius: theme.radius.md + 2,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: 0.4,
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.inkSoft,
  },
});

export const StatCard = memo(StatCardBase);

type RowItem = { key: string; Icon: LucideIcon; value: number; label: string; valueColor: string };

/**
 * A row renders only when at least two pills carry a value. A lone pill, or an
 * empty rounded box, reads as a broken skeleton loader.
 */
export const StatRow = memo(function StatRow({ items }: { items: RowItem[] }) {
  const visible = items.filter(i => i.value > 0);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={rowStyles.row}>
      {visible.map(i => (
        <View key={i.key} style={rowStyles.slot}>
          <StatCard Icon={i.Icon} value={String(i.value)} label={i.label} valueColor={i.valueColor} />
        </View>
      ))}
    </View>
  );
});

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  slot: { flex: 1 },
});
