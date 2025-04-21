import { responseResult } from '~~/server/models/responseResult';

interface weatherForecastDto {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const response = await $fetch<Array<weatherForecastDto>>(
    `${runtimeConfig.public.VITE_MOCK_API}/weather-forecast`,
  );

  return responseResult.Success(
    'Get weather forecasts successfully',
    response.map((item) => ({
      date: item.date,
      temperatureC: item.temperatureC,
      temperatureF: item.temperatureF,
      summary: item.summary,
    })),
  );
});
