import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { Boxes, ChevronLeft, PackagePlus } from 'lucide-react-native';
import { BoxCard } from '../components/BoxCard';
import { BoxDetailSheet } from '../components/BoxDetailSheet';
import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { IconPill } from '../components/IconPill';
import { KraftBackground } from '../components/KraftBackground';
import { PrimaryButton } from '../components/PrimaryButton';
import { RoomRow } from '../components/RoomRow';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import {
  BOARD_W,
  BORDER,
  GAP,
  PAD,
  TIMING,
} from '../constants/config';
import { theme } from '../constants/theme';
import {
  filterBoxes,
  roomStats,
  type Box,
  type FilterTab,
  type Room,
} from '../game/ledger';
import { findItems } from '../game/search';
import { SearchField } from '../components/SearchField';
import type { Ledger } from '../hooks/useLedger';
import { ratio } from '../utils/format';

type Props = {
  ledger: Ledger;
  initialSearching?: boolean;
  onBack: () => void;
  onGameOver: () => void;
};

const TABS: FilterTab[] = ['ALL', 'PACKED', 'DELIVERED', 'ROOMS'];
const ROOM_CHIPS: Room[] = ['KITCHEN', 'BEDROOM', 'BATH', 'OFFICE', 'STORE'];

const keyExtractor = (item: Box) => item.id;

export function GameScreen({ ledger, initialSearching = false, onBack, onGameOver }: Props) {
  const { boxes, counters, lastSealedId } = ledger;

  const [tab, setTab] = useState<FilterTab>('ALL');
  const [room, setRoom] = useState<Room>('KITCHEN');
  const [openId, setOpenId] = useState<string | null>(null);
  const [searching, setSearching] = useState(initialSearching);
  const [query, setQuery] = useState('');

  const resultsY = useRef(new Animated.Value(26)).current;
  const resultsOpacity = useRef(new Animated.Value(0)).current;

  const visibleBoxes = useMemo(() => filterBoxes(boxes, tab), [boxes, tab]);
  const rooms = useMemo(() => roomStats(boxes), [boxes]);
  const hits = useMemo(() => findItems(boxes, query), [boxes, query]);
  const openBox = useMemo(
    () => boxes.find(b => b.id === openId) ?? null,
    [boxes, openId],
  );

  const complete = counters.total > 0 && counters.unpacked === counters.total;

  useEffect(() => {
    if (!searching) {
      resultsY.setValue(26);
      resultsOpacity.setValue(0);
      return;
    }
    const anim = Animated.parallel([
      Animated.timing(resultsY, {
        toValue: 0,
        duration: TIMING.search,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(resultsOpacity, {
        toValue: 1,
        duration: TIMING.search,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [searching, query, resultsY, resultsOpacity]);

  const handleTab = useCallback((label: string) => {
    setSearching(false);
    setTab(label as FilterTab);
  }, []);

  const handleRoom = useCallback((label: string) => setRoom(label as Room), []);

  const handleOpen = useCallback(
    (id: string) => {
      if (tab === 'DELIVERED') {
        // Arrival check: one tap ticks the box off.
        ledger.advanceBox(id);
        return;
      }
      setOpenId(id);
    },
    [ledger, tab],
  );

  const handleClose = useCallback(() => setOpenId(null), []);
  const handleNewBox = useCallback(() => {
    setTab('ALL');
    setSearching(false);
    ledger.addBox(room);
  }, [ledger, room]);

  const toggleSearch = useCallback(() => {
    setSearching(prev => !prev);
    setQuery('');
  }, []);

  const clearQuery = useCallback(() => setQuery(''), []);

  const renderBox = useCallback(
    ({ item }: ListRenderItemInfo<Box>) => (
      <BoxCard
        id={item.id}
        number={item.number}
        room={item.room}
        itemCount={item.items.length}
        status={item.status}
        fragile={item.fragile}
        sealing={item.id === lastSealedId}
        onPress={handleOpen}
      />
    ),
    [handleOpen, lastSealedId],
  );

  const renderRoom = useCallback(
    ({ item }: ListRenderItemInfo<{ room: Room; total: number; unpacked: number }>) => (
      <RoomRow
        room={item.room}
        total={item.total}
        unpacked={item.unpacked}
        width={BOARD_W - PAD * 2 - BORDER * 2}
      />
    ),
    [],
  );

  const counterPill = (
    <View style={[styles.counterPill, complete ? styles.counterPillDone : null]}>
      <Text style={styles.counterText} numberOfLines={1}>
        {ratio(counters.unpacked, counters.total)}
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(245,235,220,0.9)" />
      <KraftBackground variant="light">
        <ScreenHeader
          title={searching ? 'FIND AN ITEM' : 'BOX LIST'}
          subtitle={`${counters.total} BOXES · ${counters.roomsUsed} ROOMS`}
          leftSlot={<IconPill Icon={ChevronLeft} label="Back to menu" onPress={onBack} />}
          rightSlot={counterPill}
        />

        <View style={styles.tabStrip}>
          {TABS.map(t => (
            <Chip key={t} label={t} active={tab === t && !searching} onPress={handleTab} />
          ))}
        </View>

        <View style={styles.area}>
          <View pointerEvents="none" style={styles.watermark}>
            <PackagePlus size={110} color={theme.colors.ink} strokeWidth={1.2} />
          </View>

          {searching ? (
            <View style={styles.searchWrap}>
              <SearchField value={query} onChange={setQuery} onClear={clearQuery} />
              <Animated.View
                pointerEvents="box-none"
                style={[
                  styles.results,
                  { opacity: resultsOpacity, transform: [{ translateY: resultsY }] },
                ]}>
                {hits.length > 0 ? (
                  hits.slice(0, 7).map(h => (
                    <View key={h.id} style={styles.resultRow}>
                      <Text style={styles.resultItem} numberOfLines={1}>
                        {h.item}
                      </Text>
                      <Text style={styles.resultBadge} numberOfLines={1}>
                        {`BOX ${h.boxNumber} · ${h.room}`}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.resultEmpty}>
                    {query.length > 0 ? 'NOTHING MATCHES THAT' : 'TYPE TO SEARCH EVERY BOX'}
                  </Text>
                )}
              </Animated.View>
            </View>
          ) : tab === 'ROOMS' ? (
            <View style={styles.board}>
              <FlatList
                data={rooms}
                keyExtractor={r => r.room}
                renderItem={renderRoom}
                contentContainerStyle={styles.roomList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : visibleBoxes.length > 0 ? (
            <View style={styles.board}>
              <FlatList
                data={visibleBoxes}
                keyExtractor={keyExtractor}
                renderItem={renderBox}
                numColumns={2}
                columnWrapperStyle={styles.column}
                contentContainerStyle={styles.grid}
                initialNumToRender={6}
                windowSize={5}
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <EmptyState
              Icon={PackagePlus}
              title="NO BOXES HERE"
              hint="TAP NEW BOX TO START"
            />
          )}
        </View>

        <View style={styles.statStrip}>
          <View style={styles.stripSprite}>
            <Boxes size={28} color={theme.colors.brown} strokeWidth={2} />
          </View>
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>PACKED</Text>
            <Text style={[styles.stripValue, { color: theme.colors.brown }]}>
              {String(counters.packed)}
            </Text>
          </View>
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>FRAGILE</Text>
            <Text style={[styles.stripValue, { color: theme.colors.fragile }]}>
              {String(counters.fragile)}
            </Text>
          </View>
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>LEFT</Text>
            <Text style={[styles.stripValue, { color: theme.colors.teal }]}>
              {String(counters.left)}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.roomChips}>
            {ROOM_CHIPS.map(r => (
              <Chip key={r} label={r} active={room === r} tone="brown" onPress={handleRoom} />
            ))}
          </ScrollView>

          <View style={styles.ctaWrap}>
            <PrimaryButton label="NEW BOX" Icon={PackagePlus} onPress={handleNewBox} />
          </View>

          <View style={styles.secondaryRow}>
            <SecondaryButton
              label={searching ? 'BACK TO LIST' : 'FIND AN ITEM'}
              tone="brown"
              flex
              onPress={toggleSearch}
            />
            <SecondaryButton
              label="FINISH MOVE"
              tone={complete ? 'tealSolid' : 'teal'}
              flex
              onPress={onGameOver}
            />
          </View>
        </View>

        <BoxDetailSheet
          box={openBox}
          onClose={handleClose}
          onAdvance={ledger.advanceBox}
          onToggleFragile={ledger.toggleFragile}
          onChangeRoom={ledger.changeRoom}
          onAddItem={ledger.addItem}
        />
      </KraftBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.kraft },

  counterPill: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31,122,140,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(31,122,140,0.34)',
  },
  counterPillDone: { backgroundColor: theme.colors.teal, borderColor: theme.colors.teal },
  counterText: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    color: theme.colors.teal,
  },

  tabStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 10,
    height: 48,
    alignItems: 'center',
  },

  area: { flex: 1, paddingTop: 10 },
  watermark: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 110,
    height: 110,
    opacity: 0.14,
  },
  board: {
    flex: 1,
    width: BOARD_W,
    alignSelf: 'center',
    padding: PAD,
    borderWidth: BORDER,
    borderColor: 'rgba(166,112,58,0.22)',
    borderRadius: 16,
  },
  grid: { gap: GAP, paddingBottom: 6 },
  column: { gap: GAP },
  roomList: { gap: GAP, paddingBottom: 6 },

  searchWrap: { paddingHorizontal: 16 },
  results: { marginTop: 12, gap: 8 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.carton,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultItem: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 18,
    color: theme.colors.ink,
  },
  resultBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    lineHeight: 16,
    color: theme.colors.teal,
  },
  resultEmpty: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 16,
    color: theme.colors.inkSoft,
  },

  statStrip: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12,
    backgroundColor: 'rgba(45,33,24,0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(166,112,58,0.20)',
  },
  stripSprite: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  stripItem: { flex: 1, alignItems: 'center' },
  stripLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 13,
    color: theme.colors.inkSoft,
  },
  stripValue: {
    marginTop: 1,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },

  controls: {
    backgroundColor: theme.colors.panel,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(166,112,58,0.28)',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  roomChips: { gap: 8, paddingRight: 4 },
  ctaWrap: { marginTop: 12 },
  secondaryRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
});
