import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { LAYOUT } from '../constants/config';
import { theme } from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  active: boolean;
  tone?: 'teal' | 'brown';
  onPress: (label: string) => void;
};

function ChipBase({ label, active, tone = 'teal', onPress }: Props) {
  const handlePress = useCallback(() => onPress(label), [label, onPress]);

  const activeStyle =
    tone === 'teal'
      ? { backgroundColor: 'rgba(31,122,140,0.14)', borderColor: theme.colors.teal, borderWidth: 1.5 }
      : { backgroundColor: theme.colors.brown, borderColor: theme.colors.brown, borderWidth: 1.5 };

  const activeText = tone === 'teal' ? theme.colors.teal : theme.colors.onPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={handlePress}
      style={[styles.chip, active ? activeStyle : styles.idle]}>
      <Text
        style={[styles.label, { color: active ? activeText : theme.colors.inkSoft }]}
        numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: LAYOUT.chipHeight,
    minWidth: 62,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: {
    backgroundColor: 'rgba(45,33,24,0.06)',
    borderColor: 'rgba(45,33,24,0.10)',
    borderWidth: 1,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.1,
    lineHeight: 16,
  },
});

export const Chip = memo(ChipBase);
