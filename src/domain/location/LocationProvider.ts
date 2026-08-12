import type { Coordinates } from '../entities/Weather';

export interface LocationResult {
  coordinates: Coordinates;
  label: string;
  usedFallback: boolean;
}

export interface LocationProvider {
  getCurrentLocation(): Promise<LocationResult>;
}

export const FALLBACK_LOCATION: Coordinates = {
  latitude: 14.5995,
  longitude: 120.9842,
};

export const FALLBACK_LOCATION_LABEL = 'Manila (fallback)';
