import { recommendProductIdMap } from './../server/data';
import { http } from '../utils/http';
import type { Product, RecentProduct } from './types';

export const getRecentProducts = (): Promise<{ recentProducts: RecentProduct[] }> => {
  return http.get('/api/recent/product/list');
};

export const getProductList = (): Promise<{ products: Product[] }> => {
  return http.get('/api/product/list');
};

export const getProductInfo = (id: number): Promise<Product> => {
  return http.get(`/api/product/${id}`);
};

export const getRecommendations = (id: number): Promise<{ recommendProductIds: number[] }> => {
  return http.get(`/api/product/recommend/${id}`);
};
