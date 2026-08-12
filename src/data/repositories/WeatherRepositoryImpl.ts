import type { WeatherQuery } from '../../domain/repositories/WeatherRepository';
import type { WeatherRepository } from '../../domain/repositories/WeatherRepository';
import { loadWeatherFromOpenMeteo } from '../openMeteo/openMeteoMapper';

export class WeatherRepositoryImpl implements WeatherRepository {
  async getWeather(query: WeatherQuery) {
    return loadWeatherFromOpenMeteo(
      query.coordinates,
      query.forecastDays,
      query.locationLabel,
      query.usedFallbackLocation,
    );
  }
}

export const weatherRepository = new WeatherRepositoryImpl();
