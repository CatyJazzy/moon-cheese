import { recommendProductIdMap } from './../server/data';
import { http } from '../utils/http';
import type { Product, RecentProduct } from './types';
import { queryOptions } from '@tanstack/react-query';

export const queryKeys = {
  recentProducts: () => ['recentProducts'] as const,
  productList: () => ['productList'] as const,
  productInfo: (id: number) => ['productInfo', id] as const,
  recommendedProductIds: (productId: number) => ['recommendedProductIds', productId] as const,
};

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

export const recentProductsQueryOptions = () => {
  return queryOptions({
    queryKey: queryKeys.recentProducts(),
    queryFn: getRecentProducts,
  });
};

export const productListQueryOptions = () => {
  return queryOptions({
    queryKey: queryKeys.productList(),
    queryFn: getProductList,
  });
};

export const productInfoQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: queryKeys.productInfo(id),
    queryFn: () => getProductInfo(id),
  });
};

export const recommendedProductIdsQueryOptions = (productId: number) => {
  return queryOptions({
    queryKey: queryKeys.recommendedProductIds(productId),
    queryFn: () => getRecommendations(productId),
  });
};

export interface PurchaseRequest {
  deliveryType: 'EXPRESS' | 'PREMIUM';
  totalPrice: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export const purchaseProducts = (data: PurchaseRequest): Promise<null> => {
  return http.post('/api/product/purchase', data);
};
