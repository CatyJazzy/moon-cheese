import { http } from '../utils/http';
import type { UserInfo, GradePointList, GradeShippingList } from './types';

export const getUserInfo = (): Promise<UserInfo> => {
  return http.get('/api/me');
};

export const getGradePointList = (): Promise<GradePointList> => {
  return http.get('/api/grade/point');
};

export const getGradeShippingList = (): Promise<GradeShippingList> => {
  return http.get('/api/grade/shipping');
};
