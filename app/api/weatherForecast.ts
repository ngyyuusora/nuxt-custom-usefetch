import type { WeatherForecastResponse } from '~/types/api/weatherForecast';

const Api = {
  '/': '/weather-forecast',
};

export const getWeatherForecast = async () => {
  return requestPublic.get<WeatherForecastResponse>({
    url: Api['/'],
  });
};
