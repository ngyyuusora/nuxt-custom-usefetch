import { buildShortUUID } from '~/utils/uuid';
import { responseResult } from '~~/server/models/responseResult';

export default defineEventHandler(async (event) => {
  const response = {
    id: buildShortUUID(),
    timestamp: new Date().toISOString(),
  };

  return responseResult.Success('Get test timestamp success', response);
});
