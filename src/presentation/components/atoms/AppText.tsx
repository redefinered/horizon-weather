import { Text, type TextProps } from 'react-native';

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
