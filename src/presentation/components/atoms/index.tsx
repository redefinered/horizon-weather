import { ActivityIndicator, StyleSheet, Text, type TextProps } from 'react-native';

import { colors, typography } from '../../theme';

interface AppTextProps extends TextProps {
  variant?: keyof typeof typography;
  muted?: boolean;
}

export function AppText({
  variant = 'body',
  muted = false,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        typography[variant],
        { color: muted ? colors.textMuted : colors.text },
        style,
      ]}
      {...props}
    />
  );
}

interface TemperatureTextProps {
  value: string;
}

export function TemperatureText({ value }: TemperatureTextProps) {
  return <AppText variant="title" style={styles.temperature}>{value}</AppText>;
}

export function LoadingSpinner() {
  return <ActivityIndicator size="large" color={colors.primary} />;
}

export function Spacer({ size }: { size: number }) {
  return <Text style={{ height: size }} />;
}

const styles = StyleSheet.create({
  temperature: {
    color: colors.primaryDark,
    fontSize: 48,
    fontWeight: '700',
  },
});
