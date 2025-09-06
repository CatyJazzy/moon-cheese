import { http } from '../utils/http';
import type { UserInfo, GradePointList } from './types';

export const getUserInfo = (): Promise<UserInfo> => {
  return http.get('/api/me');
};

export const getGradePointList = (): Promise<GradePointList> => {
  return http.get('/api/grade/point');
};
