import React, { memo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LAYOUT } from '../constants/config';
import { theme } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  tone?: 'light' | 'dark';
};

/**
 * Shared across Menu / Game / GameOver / Settings so the chrome never drifts.
 * paddingTop 44 keeps the content clear of the status bar.
 */
function ScreenHeaderBase({ title, subtitle, leftSlot, rightSlot, tone = 'light' }: Props) {
  const onDark = tone === 'dark';
  return (
    <View
      style={[
        styles.root,
        onDark ? styles.rootDark : styles.rootLight,
      ]}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.center}>
        <Text
          style={[styles.title, onDark ? styles.titleDark : null]}
          numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, onDark ? styles.subtitleDark : null]}
            numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: LAYOUT.statusBarPad,
    height: LAYOUT.statusBarPad + LAYOUT.headerContent,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  rootLight: {
    backgroundColor: 'rgba(45,33,24,0.06)',
    borderBottomColor: 'rgba(166,112,58,0.22)',
  },
  rootDark: {
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderBottomColor: 'rgba(245,235,220,0.18)',
  },
  side: { width: 76, justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2.2,
    lineHeight: 20,
    color: theme.colors.ink,
  },
  titleDark: { color: theme.colors.onDark },
  subtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    lineHeight: 14,
    color: theme.colors.inkSoft,
  },
  subtitleDark: { color: 'rgba(245,235,220,0.72)' },
});

export const ScreenHeader = memo(ScreenHeaderBase);
