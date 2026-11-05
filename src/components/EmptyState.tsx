import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';

type Props = {
  Icon: LucideIcon;
  title: string;
  hint: string;
};

function EmptyStateBase({ Icon, title, hint }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.sprite}>
        <Icon size={84} color={theme.colors.border} strokeWidth={1.4} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  sprite: {
    width: 120,
    height: 120,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
    lineHeight: 20,
    color: theme.colors.inkSoft,
  },
  hint: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    lineHeight: 16,
    color: theme.colors.brown,
  },
});

export const EmptyState = memo(EmptyStateBase);
