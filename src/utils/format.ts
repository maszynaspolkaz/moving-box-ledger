/** Small pure formatters. No currency anywhere in this app. */

export function ratio(done: number, total: number): string {
  return `${done}/${total}`;
}

export function percent(done: number, total: number): string {
  if (total <= 0) {
    return '0%';
  }
  return `${Math.round((done / total) * 100)}%`;
}

export function boxLabel(n: number): string {
  return `#${n}`;
}

export function itemsLabel(n: number): string {
  return n === 1 ? '1 ITEM' : `${n} ITEMS`;
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
