import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TemperatureUnit } from '../../domain/entities/Weather';

const STORAGE_KEY = '@horizon-weather/unit';

export interface UnitPreferenceStore {
  getUnit(): Promise<TemperatureUnit>;
  setUnit(unit: TemperatureUnit): Promise<void>;
}

export class AsyncStorageUnitStore implements UnitPreferenceStore {
  async getUnit(): Promise<TemperatureUnit> {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  }

  async setUnit(unit: TemperatureUnit): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, unit);
  }
}

export const unitStore = new AsyncStorageUnitStore();
