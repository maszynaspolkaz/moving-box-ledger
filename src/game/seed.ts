import type { Box, BoxStatus, Room } from './ledger';

export const MOVE_NAME = 'OAK STREET TO 14B';

/** Quick-add vocabulary used by the detail sheet (no keyboard needed). */
export const QUICK_ITEMS = ['CABLES', 'BOOKS', 'MUGS', 'TOOLS', 'LINEN', 'PLATES'];

type SeedRow = [number, Room, BoxStatus, boolean, string[]];

const ROWS: SeedRow[] = [
  [1, 'KITCHEN', 'unpacked', false, ['kettle', 'mugs', 'teaspoons']],
  [2, 'KITCHEN', 'unpacked', true, ['plates', 'glasses']],
  [3, 'KITCHEN', 'delivered', false, ['pans', 'lids', 'colander']],
  [4, 'KITCHEN', 'delivered', false, ['spices', 'oils']],
  [5, 'KITCHEN', 'packed', true, ['wine glasses']],
  [6, 'BEDROOM', 'unpacked', false, ['linen', 'pillows']],
  [7, 'BEDROOM', 'unpacked', false, ['duvet', 'throw']],
  [8, 'BEDROOM', 'delivered', false, ['winter coats', 'boots']],
  [9, 'BEDROOM', 'delivered', false, ['hangers', 'belts']],
  [10, 'BEDROOM', 'packed', false, ['summer shirts']],
  [11, 'BATH', 'unpacked', false, ['towels', 'bath mat']],
  [12, 'BATH', 'delivered', true, ['mirror', 'shelf glass']],
  [13, 'BATH', 'packed', false, ['shampoo', 'soap']],
  [14, 'OFFICE', 'unpacked', false, ['cables', 'chargers', 'router']],
  [15, 'OFFICE', 'unpacked', false, ['books', 'notebooks']],
  [16, 'OFFICE', 'delivered', true, ['monitor', 'desk lamp']],
  [17, 'OFFICE', 'delivered', false, ['printer paper', 'folders']],
  [18, 'OFFICE', 'packed', false, ['keyboard', 'mouse']],
  [19, 'STORE', 'unpacked', false, ['tools', 'screws']],
  [20, 'STORE', 'delivered', false, ['paint tins']],
  [21, 'STORE', 'delivered', false, ['garden hose']],
  [22, 'GARAGE', 'unpacked', false, ['bike pump', 'helmet']],
  [23, 'GARAGE', 'delivered', false, ['car mats']],
  [24, 'GARAGE', 'packed', true, ['christmas baubles']],
];

export function seedBoxes(): Box[] {
  return ROWS.map(([number, room, status, fragile, items]) => ({
    id: `box-${number}-${room}`,
    number,
    room,
    status,
    fragile,
    items: items.slice(),
  }));
}

export const SEED_DAYS = 3;
