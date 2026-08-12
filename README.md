# Horizon Weather

A React Native weather app built with Expo and TypeScript for the Horizon Labs technical task. It shows current conditions and a configurable multi-day forecast using your device location, with a Manila fallback when permission is denied.

## Setup choice

**Expo managed workflow** (not React Native CLI). Chosen so reviewers can run the app instantly via **Expo Go** without Xcode/Android Studio native builds, and because `expo-location` handles permission prompts and platform config with minimal setup.

## Quick start

```bash
npm install
npm start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `i` / `a` for simulators.

If the iOS simulator shows “Could not connect to the server”, restart with `npm start` (see [`metro.config.js`](metro.config.js) — Metro must be reachable over IPv4). For iOS 26.x simulators, try an iOS 18 runtime or `npm run start:tunnel`.

Run tests:

```bash
npm test
```

No API key is required — weather data comes from [Open-Meteo](https://open-meteo.com/).

## Requirements checklist

| Requirement | Implementation |
|-------------|----------------|
| 1. Geolocation + fallback | [`ExpoLocationProvider`](src/data/location/ExpoLocationProvider.ts) requests permission on load; Manila fallback + banner |
| 2. Current weather | [`CurrentConditions`](src/presentation/components/organisms/index.tsx) — temp, condition, feels-like, humidity, wind |
| 3. Forecast FlatList (N = 3–7) | [`ForecastSection`](src/presentation/components/organisms/index.tsx) + [`DayRangeSelector`](src/presentation/components/molecules/index.tsx) |
| 4. °C/°F persisted | [`useUnitPreference`](src/presentation/hooks/useUnitPreference.ts) + AsyncStorage |
| 5. Pull-to-refresh, no stale overwrite | [`useWeather`](src/presentation/hooks/useWeather.ts) + [`requestGuard`](src/presentation/hooks/requestGuard.ts) |
| 6. Loading & error states | Loading spinner, error banner with retry; rate-limit (429), API down (5xx), permission via fallback banner |
| 7. Custom hook | `useWeather` encapsulates geo → fetch → race guard |
| 8. Tests | Request guard + Open-Meteo mapper + `useWeather` stale-response test |

## Features

- **Geolocation** via `expo-location`, with Manila fallback and an on-screen banner when fallback is used
- **Current weather** — temperature, feels-like, humidity, wind, and condition label
- **Forecast** — selectable 3–7 day daily forecast (default 5)
- **Unit toggle** — °C / °F persisted with AsyncStorage
- **Pull to refresh** with stale-response protection (monotonic request IDs)
- **Loading & error states** with retry

## API

Weather data comes from Open-Meteo — free, no API key required. A single request fetches both current conditions and daily forecast:

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=…&longitude=…
  &current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m
  &daily=weather_code,temperature_2m_max,temperature_2m_min
  &forecast_days=N
  &timezone=auto
```

Temperatures are stored in °C from the API and converted in the presentation layer based on user preference.

## Architecture

The app follows **Clean Architecture** (domain / data / presentation) with **Atomic Design** for UI composition.

See [docs/architecture.md](./docs/architecture.md) for the layer diagram and notes.

```
src/
  domain/          entities + repository/location ports
  data/            Open-Meteo client, Expo location, AsyncStorage
  presentation/    hooks, atomic components, screens
  shared/          errors, formatting utilities
```

Key hook: `useWeather` orchestrates location → repository fetch → state, using a request guard so slower responses never overwrite newer data.

## Trade-offs

| Choice | Why |
|--------|-----|
| Expo managed workflow | Fastest path for reviewers via Expo Go; no native build required |
| Open-Meteo | No API key; sufficient for the task scope |
| FlatList | Small forecast lists (3–7 rows); FlashList would be the upgrade for longer lists |
| Local hook state | Keeps scope small; React Query would add cache/dedupe as a next step |
| Pragmatic Atomic Design | Atoms/molecules/organisms where they add clarity, without over-fragmenting |
| Single API call | After geolocation, one Open-Meteo request returns current + daily (no forecast waterfall) |
| Permission denied → fallback | Shows weather for Manila with a banner rather than a blocking error (explicit, usable UX) |

## With more time

- React Query for caching, deduplication, and background refresh
- FlashList for larger forecast lists
- Dark mode and richer weather iconography
- E2E tests (Detox / Maestro)
- City search and saved locations

## Tests

Focused unit tests cover the trickiest logic — not full UI coverage:

- **Request guard** — monotonic IDs and stale-response discard (the core race-condition fix for pull-to-refresh)
- **Open-Meteo mapper** — WMO weather code labels and DTO → domain mapping
- **`useWeather`** — integration test via [`performWeatherFetch`](src/presentation/hooks/performWeatherFetch.ts) with mocked dependencies proving a slow in-flight response cannot overwrite a newer refresh

Why these? The race guard is the highest-risk async bug; the mapper is the boundary between external API shape and domain entities; the hook test ties both together the way the app actually runs.
