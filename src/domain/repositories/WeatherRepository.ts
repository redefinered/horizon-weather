import type { ForecastDayCount, WeatherBundle } from '../entities/Weather';
import type { Coordinates } from '../entities/Weather';

export interface WeatherQuery {
  coordinates: Coordinates;
  forecastDays: ForecastDayCount;
  locationLabel: string;
  usedFallbackLocation: boolean;
}

export interface WeatherRepository {
  getWeather(query: WeatherQuery): Promise<WeatherBundle>;
}
