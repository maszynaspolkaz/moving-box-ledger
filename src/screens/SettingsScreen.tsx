import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Boxes, ChevronLeft } from 'lucide-react-native';
import { Chip } from '../components/Chip';
import { IconPill } from '../components/IconPill';
import { KraftBackground } from '../components/KraftBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { theme } from '../constants/theme';

type Props = { onBack: () => void };

const THEMES = ['KRAFT', 'NIGHT KRAFT'];
const FORMATS = ['#12', 'K-12', '012'];

export function SettingsScreen({ onBack }: Props) {
  const [themeMode, setThemeMode] = useState(THEMES[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [haptics, setHaptics] = useState(true);

  const toggleHaptics = useCallback(() => setHaptics(prev => !prev), []);
  const handleTheme = useCallback((label: string) => setThemeMode(label), []);
  const handleFormat = useCallback((label: string) => setFormat(label), []);
  const noop = useCallback(() => {}, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(245,235,220,0.95)" />
      <KraftBackground variant="settings">
        <ScreenHeader
          title="SETTINGS"
          subtitle={'OFFLINE · NO ADS'}
          leftSlot={<IconPill Icon={ChevronLeft} label="Back to menu" onPress={onBack} />}
        />

        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>THEME</Text>
            <View style={styles.rowChips}>
              {THEMES.map(t => (
                <Chip key={t} label={t} active={themeMode === t} onPress={handleTheme} />
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>NUMBERING FORMAT</Text>
            <View style={styles.rowChips}>
              {FORMATS.map(f => (
                <Chip key={f} label={f} active={format === f} onPress={handleFormat} />
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>HAPTICS</Text>
            <View style={styles.rowChips}>
              <Chip label={haptics ? 'ON' : 'OFF'} active={haptics} onPress={toggleHaptics} />
            </View>
          </View>

          <View style={styles.exportRow}>
            <SecondaryButton label="EXPORT LEDGER" tone="teal" onPress={noop} />
          </View>

          <Text style={styles.about}>MOVING BOX LEDGER {'·'} OFFLINE {'·'} NO ADS</Text>
        </View>

        <View pointerEvents="none" style={styles.decor}>
          <Boxes size={96} color={theme.colors.brown} strokeWidth={1.4} />
        </View>
      </KraftBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.kraft },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 18, gap: 12 },
  row: {
    backgroundColor: theme.colors.carton,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    lineHeight: 15,
    color: theme.colors.inkSoft,
  },
  rowChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  exportRow: { marginTop: 4 },
  about: {
    marginTop: 'auto',
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1.4,
    lineHeight: 15,
    color: theme.colors.inkSoft,
  },
  decor: { position: 'absolute', right: 16, bottom: 16, opacity: 0.35 },
});
