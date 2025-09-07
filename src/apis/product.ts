import { http } from '../utils/http';
import type { Product } from './types';

export const getRecentProducts = (): Promise<{ recentProducts: Product[] }> => {
  return http.get('/api/recent/product/list');
};
