export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
  icon: string;
}

export type WeatherForecastResponse = WeatherForecast[];
