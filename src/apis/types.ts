export interface ExchangeRate {
  KRW: number;
  USD: number;
}

export interface Product {
  id: number;
  thumbnail: string;
  name: string;
  price: number; // Dollar 기준으로 옴
}

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
