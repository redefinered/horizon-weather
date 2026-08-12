import * as Location from 'expo-location';

import {
  FALLBACK_LOCATION,
  FALLBACK_LOCATION_LABEL,
  type LocationProvider,
  type LocationResult,
} from '../../domain/location/LocationProvider';

export class ExpoLocationProvider implements LocationProvider {
  async getCurrentLocation(): Promise<LocationResult> {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== Location.PermissionStatus.GRANTED) {
      return {
        coordinates: FALLBACK_LOCATION,
        label: FALLBACK_LOCATION_LABEL,
        usedFallback: true,
      };
    }

    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;
      const label = await this.resolveLocationLabel(latitude, longitude);

      return {
        coordinates: { latitude, longitude },
        label,
        usedFallback: false,
      };
    } catch {
      return {
        coordinates: FALLBACK_LOCATION,
        label: FALLBACK_LOCATION_LABEL,
        usedFallback: true,
      };
    }
  }

  private async resolveLocationLabel(
    latitude: number,
    longitude: number,
  ): Promise<string> {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      const place = results[0];

      if (!place) {
        return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      }

      const parts = [place.city, place.region, place.country].filter(Boolean);
      return parts.length > 0
        ? parts.join(', ')
        : `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    } catch {
      return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }
  }
}
