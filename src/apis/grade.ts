import { http } from '../utils/http';
import type { GradePointList, GradeShippingList } from './types';
import { queryOptions } from '@tanstack/react-query';

export const queryKeys = {
  gradePoint: () => ['gradePoint'] as const,
  gradeShipping: () => ['gradeShipping'] as const,
};

export const getGradePointList = (): Promise<GradePointList> => {
  return http.get('/api/grade/point');
};

export const getGradeShippingList = (): Promise<GradeShippingList> => {
  return http.get('/api/grade/shipping');
};

export const gradePointQueryOptions = () => {
  return queryOptions({
    queryKey: queryKeys.gradePoint(),
    queryFn: getGradePointList,
  });
};

export const gradeShippingQueryOptions = () => {
  return queryOptions({
    queryKey: queryKeys.gradeShipping(),
    queryFn: getGradeShippingList,
  });
};
