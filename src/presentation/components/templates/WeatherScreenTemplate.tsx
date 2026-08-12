import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { ReactNode } from 'react';

import { colors, spacing } from '../../theme';
import { AppText } from '../atoms';

interface WeatherScreenTemplateProps {
  header: ReactNode;
  controls: ReactNode;
  banner?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  onRefresh: () => void;
}

export function WeatherScreenTemplate({
  header,
  controls,
  banner,
  content,
  footer,
  onRefresh,
}: WeatherScreenTemplateProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>{header}</View>
      <View style={styles.controls}>{controls}</View>
      {banner}
      <View style={styles.main}>{content}</View>
      {footer}
    </ScrollView>
  );
}

export function WeatherHeader() {
  return (
    <View>
      <AppText variant="title">Horizon Weather</AppText>
      <AppText variant="caption" muted>
        Local conditions and forecast
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  controls: {
    gap: spacing.md,
  },
  main: {
    gap: spacing.md,
  },
});
