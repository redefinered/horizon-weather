import { useCallback, useEffect, useRef, useState } from 'react';

import type { AppDependencies } from '../../data/di';
import { dependencies as defaultDependencies } from '../../data/di';
import {
  DEFAULT_FORECAST_DAYS,
  type ForecastDayCount,
  type WeatherBundle,
} from '../../domain/entities/Weather';
import type { AppError } from '../../shared/errors/AppError';
import {
  createRequestGuard,
  type WeatherStatus,
} from './requestGuard';
import { performWeatherFetch } from './performWeatherFetch';

interface UseWeatherOptions {
  dependencies?: Pick<AppDependencies, 'locationProvider' | 'weatherRepository'>;
  initialForecastDays?: ForecastDayCount;
}

interface UseWeatherResult {
  data: WeatherBundle | null;
  status: WeatherStatus;
  error: AppError | null;
  forecastDays: ForecastDayCount;
  refresh: () => Promise<void>;
  setForecastDays: (days: ForecastDayCount) => void;
}

export function useWeather(options: UseWeatherOptions = {}): UseWeatherResult {
  const {
    dependencies = defaultDependencies,
    initialForecastDays = DEFAULT_FORECAST_DAYS,
  } = options;

  const [data, setData] = useState<WeatherBundle | null>(null);
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [error, setError] = useState<AppError | null>(null);
  const [forecastDays, setForecastDaysState] =
    useState<ForecastDayCount>(initialForecastDays);

  const guardRef = useRef(createRequestGuard());
  const forecastDaysRef = useRef(forecastDays);
  const dataRef = useRef(data);

  useEffect(() => {
    forecastDaysRef.current = forecastDays;
  }, [forecastDays]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const refresh = useCallback(async () => {
    const id = guardRef.current.nextId();
    const days = forecastDaysRef.current;

    setError(null);
    setStatus('loading');

    const outcome = await performWeatherFetch(
      id,
      guardRef.current,
      days,
      dependencies,
    );

    if (outcome.type === 'stale') return;

    if (outcome.type === 'error') {
      setError(outcome.error);
      setStatus('error');
      return;
    }

    setData(outcome.data);
    setStatus('success');
  }, [dependencies]);

  const setForecastDays = useCallback((days: ForecastDayCount) => {
    setForecastDaysState(days);
    forecastDaysRef.current = days;
  }, []);

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forecastDays]);

  return {
    data,
    status,
    error,
    forecastDays,
    refresh,
    setForecastDays,
  };
}
