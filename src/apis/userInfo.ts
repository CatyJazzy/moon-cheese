import { http } from '../utils/http';
import type { UserInfo } from './types';
import { queryOptions } from '@tanstack/react-query';

export const queryKeys = {
  userInfo: () => ['userInfo'] as const,
};

export const getUserInfo = (): Promise<UserInfo> => {
  return http.get('/api/me');
};

export const userInfoQueryOptions = () => {
  return queryOptions({
    queryKey: queryKeys.userInfo(),
    queryFn: getUserInfo,
  });
};
