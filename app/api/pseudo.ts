import type { PseudoItem } from '~/types/api/pseudo';
import type { RequestOptions } from '~/utils/request/types';

const Api = {
  '/': '/pseudo',
};

export const apiGetPseudoItem = async (
  params: Recordable,
  requestOptions: RequestOptions,
) => {
  return requestPublic.get<PseudoItem>(
    {
      url: Api['/'],
      params: params,
    },
    requestOptions,
  );
};
