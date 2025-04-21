import type { WeatherForecastResponse } from '~/types/api/weatherForecast';

const Api = {
  '/': '/weather-forecast',
};

export const apiGetWeatherForecast = async () => {
  return requestPublic.get<WeatherForecastResponse>({
    url: Api['/'],
  });
};
