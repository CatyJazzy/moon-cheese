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
