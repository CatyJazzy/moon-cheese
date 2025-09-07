import { http } from '../utils/http';
import type { ExchangeRate } from './types';

export const getExchangeRate = (): Promise<{ exchangeRate: ExchangeRate }> => {
  return http.get('/api/exchange-rate');
};
