export interface ExchangeRate {
  KRW: number;
  USD: number;
}

export interface RecentProduct {
  id: number;
  thumbnail: string;
  name: string;
  price: number; // Dollar 기준으로 옴
}

export type ProductCategory = 'CHEESE' | 'CRACKER' | 'TEA';

interface BaseProduct {
  id: number;
  name: string;
  category: ProductCategory;
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
}

export interface CheeseProduct extends BaseProduct {}
export interface CrackerProduct extends BaseProduct {
  isGlutenFree?: boolean;
}
export interface TeaProduct extends BaseProduct {
  isCaffeineFree?: boolean;
}

export type Product = CheeseProduct | CrackerProduct | TeaProduct;

export type UserGrade = 'EXPLORER' | 'PILOT' | 'COMMANDER';
export interface UserInfo {
  point: number;
  grade: UserGrade;
}

export interface GradePoint {
  type: UserGrade;
  minPoint: number;
}

export interface GradePointList {
  gradePointList: GradePoint[];
}

export interface GradeShipping {
  type: UserGrade;
  shippingFee: number;
  freeShippingThreshold: number;
}

export interface GradeShippingList {
  gradeShippingList: GradeShipping[];
}
