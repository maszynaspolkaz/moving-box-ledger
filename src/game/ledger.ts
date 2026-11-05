/** Box CRUD, auto-numbering and the one-way status ladder. */

export type BoxStatus = 'packed' | 'delivered' | 'unpacked';

export const ROOMS = ['KITCHEN', 'BEDROOM', 'BATH', 'OFFICE', 'STORE', 'GARAGE'] as const;
export type Room = (typeof ROOMS)[number];

export type Box = {
  id: string;
  number: number;
  room: Room;
  items: string[];
  status: BoxStatus;
  fragile: boolean;
};

export type Counters = {
  total: number;
  packed: number;
  delivered: number;
  unpacked: number;
  fragile: number;
  roomsUsed: number;
  left: number;
};

export const STATUS_ORDER: BoxStatus[] = ['packed', 'delivered', 'unpacked'];

export function nextNumber(boxes: Box[]): number {
  return boxes.reduce((max, b) => (b.number > max ? b.number : max), 0) + 1;
}

export function createBox(boxes: Box[], room: Room): Box {
  const number = nextNumber(boxes);
  return {
    id: `box-${number}-${room}`,
    number,
    room,
    items: [],
    status: 'packed',
    fragile: false,
  };
}

export function advance(status: BoxStatus): BoxStatus {
  const i = STATUS_ORDER.indexOf(status);
  return i < STATUS_ORDER.length - 1 ? STATUS_ORDER[i + 1] : status;
}

export function canAdvance(status: BoxStatus): boolean {
  return status !== 'unpacked';
}

export function advanceLabel(status: BoxStatus): string {
  return status === 'packed' ? 'MARK DELIVERED' : 'MARK UNPACKED';
}

export function statusLabel(status: BoxStatus): string {
  return status.toUpperCase();
}

export function countOf(boxes: Box[]): Counters {
  let packed = 0;
  let delivered = 0;
  let unpacked = 0;
  let fragile = 0;
  const rooms = new Set<string>();

  for (const b of boxes) {
    rooms.add(b.room);
    if (b.fragile) {
      fragile += 1;
    }
    if (b.status === 'packed') {
      packed += 1;
    } else if (b.status === 'delivered') {
      delivered += 1;
    } else {
      unpacked += 1;
    }
  }

  return {
    total: boxes.length,
    packed,
    delivered,
    unpacked,
    fragile,
    roomsUsed: rooms.size,
    left: boxes.length - unpacked,
  };
}

export type FilterTab = 'ALL' | 'PACKED' | 'DELIVERED' | 'ROOMS';

export function filterBoxes(boxes: Box[], tab: FilterTab): Box[] {
  if (tab === 'PACKED') {
    return boxes.filter(b => b.status === 'packed');
  }
  if (tab === 'DELIVERED') {
    return boxes.filter(b => b.status === 'delivered');
  }
  return boxes;
}

export function roomStats(boxes: Box[]): { room: Room; total: number; unpacked: number }[] {
  return ROOMS.map(room => {
    const inRoom = boxes.filter(b => b.room === room);
    return {
      room,
      total: inRoom.length,
      unpacked: inRoom.filter(b => b.status === 'unpacked').length,
    };
  }).filter(r => r.total > 0);
}
