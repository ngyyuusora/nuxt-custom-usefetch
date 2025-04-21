import type { UserListResponse } from '~/types/api/users';

const Api = {
  '/': '/users',
};

export const apiGetUserList = async () => {
  return requestPublic.get<UserListResponse>({
    url: Api['/'],
  });
};
