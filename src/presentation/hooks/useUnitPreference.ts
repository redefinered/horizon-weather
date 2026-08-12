import { useCallback, useEffect, useState } from 'react';

import type { AppDependencies } from '../../data/di';
import { dependencies as defaultDependencies } from '../../data/di';
import type { TemperatureUnit } from '../../domain/entities/Weather';

interface UseUnitPreferenceOptions {
  unitStore?: AppDependencies['unitStore'];
}

interface UseUnitPreferenceResult {
  unit: TemperatureUnit;
  isReady: boolean;
  setUnit: (unit: TemperatureUnit) => Promise<void>;
  toggleUnit: () => Promise<void>;
}

export function useUnitPreference(
  options: UseUnitPreferenceOptions = {},
): UseUnitPreferenceResult {
  const unitStore = options.unitStore ?? defaultDependencies.unitStore;
  const [unit, setUnitState] = useState<TemperatureUnit>('celsius');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const stored = await unitStore.getUnit();
      if (mounted) {
        setUnitState(stored);
        setIsReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [unitStore]);

  const setUnit = useCallback(
    async (next: TemperatureUnit) => {
      setUnitState(next);
      await unitStore.setUnit(next);
    },
    [unitStore],
  );

  const toggleUnit = useCallback(async () => {
    const next = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    await setUnit(next);
  }, [setUnit, unit]);

  return {
    unit,
    isReady,
    setUnit,
    toggleUnit,
  };
}
