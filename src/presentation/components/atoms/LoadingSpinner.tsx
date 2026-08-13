import { ActivityIndicator } from 'react-native';

import { colors } from '../../theme';

export function LoadingSpinner() {
  return <ActivityIndicator size="large" color={colors.primary} />;
}
