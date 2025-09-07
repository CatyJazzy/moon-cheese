import { atom } from 'jotai';

/**
 * { product id: 개수 }
 */
export const cartItemsAtom = atom<Record<number, number>>({});

export const totalCartAmountAtom = atom(get => {
  const items = get(cartItemsAtom);
  return Object.values(items).reduce((sum, amount) => sum + amount, 0);
});
