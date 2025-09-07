import { http } from '../utils/http';
import type { Product, RecentProduct } from './types';

export const getRecentProducts = (): Promise<{ recentProducts: RecentProduct[] }> => {
  return http.get('/api/recent/product/list');
};

export const getProductList = (): Promise<{ products: Product[] }> => {
  return http.get('/api/product/list');
};
