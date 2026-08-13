import { StyleSheet, View } from 'react-native';

import { spacing } from '../../theme';
import { AppText } from '../atoms';

interface MetricItemProps {
  label: string;
  value: string;
}

export function MetricItem({ label, value }: MetricItemProps) {
  return (
    <View style={styles.metricItem}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <AppText variant="metric">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  metricItem: {
    flex: 1,
    gap: spacing.xs,
  },
});
