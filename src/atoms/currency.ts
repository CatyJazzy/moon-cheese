import { atom } from 'jotai';

export type CurrencyType = 'USD' | 'KRW';

export const currencyAtom = atom<CurrencyType>('USD');
