import type { Box } from './ledger';

export type SearchHit = {
  id: string;
  item: string;
  boxNumber: number;
  room: string;
};

/** Case-insensitive substring match over every box's items[]. */
export function findItems(boxes: Box[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return [];
  }

  const hits: SearchHit[] = [];
  for (const box of boxes) {
    for (const item of box.items) {
      if (item.toLowerCase().indexOf(q) !== -1) {
        hits.push({
          id: `${box.id}-${item}`,
          item: item.toUpperCase(),
          boxNumber: box.number,
          room: box.room,
        });
      }
    }
  }
  return hits.slice(0, 20);
}
