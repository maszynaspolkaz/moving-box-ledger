import { useCallback, useMemo, useState } from 'react';
import {
  advance,
  countOf,
  createBox,
  type Box,
  type Room,
} from '../game/ledger';
import { MOVE_NAME, SEED_DAYS, seedBoxes } from '../game/seed';

export type PastMove = { name: string; boxes: number; days: number };

export function useLedger() {
  const [boxes, setBoxes] = useState<Box[]>(seedBoxes);
  const [pastMoves, setPastMoves] = useState<PastMove[]>([]);
  const [lastSealedId, setLastSealedId] = useState<string | null>(null);

  const counters = useMemo(() => countOf(boxes), [boxes]);

  const addBox = useCallback((room: Room) => {
    setBoxes(prev => {
      const box = createBox(prev, room);
      setLastSealedId(box.id);
      return [box, ...prev];
    });
  }, []);

  const advanceBox = useCallback((id: string) => {
    setBoxes(prev =>
      prev.map(b => (b.id === id ? { ...b, status: advance(b.status) } : b)),
    );
  }, []);

  const toggleFragile = useCallback((id: string) => {
    setBoxes(prev => prev.map(b => (b.id === id ? { ...b, fragile: !b.fragile } : b)));
  }, []);

  const addItem = useCallback((id: string, item: string) => {
    const clean = item.trim();
    if (clean.length === 0) {
      return;
    }
    setBoxes(prev =>
      prev.map(b =>
        b.id === id && b.items.indexOf(clean.toLowerCase()) === -1
          ? { ...b, items: [...b.items, clean.toLowerCase()] }
          : b,
      ),
    );
  }, []);

  const changeRoom = useCallback((id: string, room: Room) => {
    setBoxes(prev => prev.map(b => (b.id === id ? { ...b, room } : b)));
  }, []);

  const archiveAndRestart = useCallback(() => {
    setBoxes(prev => {
      setPastMoves(moves => [
        { name: MOVE_NAME, boxes: prev.length, days: SEED_DAYS },
        ...moves,
      ]);
      return seedBoxes();
    });
    setLastSealedId(null);
  }, []);

  return {
    boxes,
    counters,
    pastMoves,
    lastSealedId,
    moveName: MOVE_NAME,
    days: SEED_DAYS,
    addBox,
    advanceBox,
    toggleFragile,
    addItem,
    changeRoom,
    archiveAndRestart,
  };
}

export type Ledger = ReturnType<typeof useLedger>;
