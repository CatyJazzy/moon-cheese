import { http } from '../utils/http';
import type { ExchangeRate } from './types';
import { queryOptions } from '@tanstack/react-query';

export const queryKeys = {
  exchangeRate: () => ['exchangeRate'] as const,
};

export const getExchangeRate = (): Promise<{ exchangeRate: ExchangeRate }> => {
  return http.get('/api/exchange-rate');
};

export const exchangeRateQueryOptions = () => {
  return queryOptions({
    queryKey: queryKeys.exchangeRate(),
    queryFn: getExchangeRate,
  });
};
