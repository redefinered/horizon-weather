import { StatusBar } from 'expo-status-bar';

import { WeatherScreen } from './src/presentation/screens/WeatherScreen';

export default function App() {
  return (
    <>
      <WeatherScreen />
      <StatusBar style="dark" />
    </>
  );
}
