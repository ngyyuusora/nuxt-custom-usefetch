import { responseResult } from '~~/server/models/responseResult';

interface UserDto {
  id: number;
  name: string;
  phone: number
  email: string;
  address: string;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const response = await $fetch<Array<UserDto>>(
    `${runtimeConfig.public.VITE_MOCK_API}/users`,
  );

  return responseResult.Success(
    'Get users successfully',
    response.map((item) => ({
      id: item.id,
      name: item.name,
      address: item.address,
      phone: item.phone,
      email: item.email,
    })),
  );
});
