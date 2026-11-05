/**
 * MovingBoxLedger - offline moving-day inventory ledger.
 *
 * App.tsx is the state machine only; all gameplay lives in src/screens.
 */
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { theme } from './src/constants/theme';
import { useLedger } from './src/hooks/useLedger';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'settings';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [openSearch, setOpenSearch] = useState(false);
  const ledger = useLedger();

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goSettings = useCallback(() => setScreen('settings'), []);
  const goGameOver = useCallback(() => setScreen('gameover'), []);

  const goGame = useCallback(() => {
    setOpenSearch(false);
    setScreen('game');
  }, []);

  const startFinding = useCallback(() => {
    setOpenSearch(true);
    setScreen('game');
  }, []);

  const playAgain = useCallback(() => {
    ledger.archiveAndRestart();
    setOpenSearch(false);
    setScreen('game');
  }, [ledger]);

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          moveName={ledger.moveName}
          counters={ledger.counters}
          onStart={goGame}
          onFind={startFinding}
          onSettings={goSettings}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          ledger={ledger}
          initialSearching={openSearch}
          onBack={goMenu}
          onGameOver={goGameOver}
        />
      ) : null}

      {screen === 'gameover' ? (
        <GameOverScreen
          counters={ledger.counters}
          days={ledger.days}
          onPlayAgain={playAgain}
          onMenu={goMenu}
        />
      ) : null}

      {screen === 'settings' ? <SettingsScreen onBack={goMenu} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.kraft },
});

export default App;
