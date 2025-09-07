import { atom } from 'jotai';
import type { Product } from '@/apis/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * { product id: CartItem }
 */
export const cartItemsAtom = atom<Record<number, CartItem>>({});

export const totalCartAmountAtom = atom(get => {
  const items = get(cartItemsAtom);
  return Object.values(items).reduce((sum, item) => sum + item.quantity, 0);
});
