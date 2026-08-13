import { StyleSheet } from 'react-native';

import { colors } from '../../theme';
import { AppText } from './AppText';

interface TemperatureTextProps {
  value: string;
}

export function TemperatureText({ value }: TemperatureTextProps) {
  return (
    <AppText variant="title" style={styles.temperature}>
      {value}
    </AppText>
  );
}

const styles = StyleSheet.create({
  temperature: {
    color: colors.primaryDark,
    fontSize: 48,
    fontWeight: '700',
  },
});
