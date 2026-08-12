import { ExpoLocationProvider } from './location/ExpoLocationProvider';
import { weatherRepository } from './repositories/WeatherRepositoryImpl';
import { unitStore } from './storage/unitStore';

export const locationProvider = new ExpoLocationProvider();

export const dependencies = {
  locationProvider,
  weatherRepository,
  unitStore,
};

export type AppDependencies = typeof dependencies;
