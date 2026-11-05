import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { theme } from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  value: string;
  onChange: (next: string) => void;
  onClear: () => void;
};

function SearchFieldBase({ value, onChange, onClear }: Props) {
  return (
    <View style={styles.field}>
      <Search size={22} color={theme.colors.brown} strokeWidth={2.2} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="KETTLE, CABLES, TOWELS"
        placeholderTextColor="rgba(138,116,88,0.7)"
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="search"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Clear search"
        hitSlop={HIT}
        onPress={onClear}
        style={styles.clear}>
        <Text style={styles.clearLabel}>CLEAR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.kraft,
    borderRadius: theme.radius.md + 2,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.ink,
  },
  clear: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(166,112,58,0.12)',
  },
  clearLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 14,
    color: theme.colors.brown,
  },
});

export const SearchField = memo(SearchFieldBase);
