import type {
  CurrentWeather,
  ForecastDay,
  ForecastDayCount,
  WeatherBundle,
} from '../../domain/entities/Weather';
import type { Coordinates } from '../../domain/entities/Weather';
import {
  fetchOpenMeteoForecast,
  type OpenMeteoResponse,
  weatherCodeToLabel,
} from './OpenMeteoClient';

export function mapOpenMeteoResponse(
  response: OpenMeteoResponse,
  locationLabel: string,
  usedFallbackLocation: boolean,
  forecastDays: ForecastDayCount,
): WeatherBundle {
  const current: CurrentWeather = {
    temperatureCelsius: response.current.temperature_2m,
    apparentTemperatureCelsius: response.current.apparent_temperature,
    humidityPercent: response.current.relative_humidity_2m,
    windSpeedKmh: response.current.wind_speed_10m,
    weatherCode: response.current.weather_code,
    conditionLabel: weatherCodeToLabel(response.current.weather_code),
  };

  const forecast: ForecastDay[] = response.daily.time
    .slice(0, forecastDays)
    .map((date, index) => ({
      date,
      minTemperatureCelsius: response.daily.temperature_2m_min[index],
      maxTemperatureCelsius: response.daily.temperature_2m_max[index],
      weatherCode: response.daily.weather_code[index],
      conditionLabel: weatherCodeToLabel(response.daily.weather_code[index]),
    }));

  return {
    current,
    forecast,
    locationLabel,
    usedFallbackLocation,
  };
}

export async function loadWeatherFromOpenMeteo(
  coordinates: Coordinates,
  forecastDays: ForecastDayCount,
  locationLabel: string,
  usedFallbackLocation: boolean,
): Promise<WeatherBundle> {
  const response = await fetchOpenMeteoForecast({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    forecastDays,
  });

  return mapOpenMeteoResponse(
    response,
    locationLabel,
    usedFallbackLocation,
    forecastDays,
  );
}
