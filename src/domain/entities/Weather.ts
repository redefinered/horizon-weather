export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperatureCelsius: number;
  apparentTemperatureCelsius: number;
  humidityPercent: number;
  windSpeedKmh: number;
  conditionLabel: string;
  weatherCode: number;
}

export interface ForecastDay {
  date: string;
  minTemperatureCelsius: number;
  maxTemperatureCelsius: number;
  conditionLabel: string;
  weatherCode: number;
}

export interface WeatherBundle {
  current: CurrentWeather;
  forecast: ForecastDay[];
  locationLabel: string;
  usedFallbackLocation: boolean;
}

export const FORECAST_DAY_OPTIONS = [3, 4, 5, 6, 7] as const;
export type ForecastDayCount = (typeof FORECAST_DAY_OPTIONS)[number];
export const DEFAULT_FORECAST_DAYS: ForecastDayCount = 5;
