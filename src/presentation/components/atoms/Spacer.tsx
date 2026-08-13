import { Text } from 'react-native';

export function Spacer({ size }: { size: number }) {
  return <Text style={{ height: size }} />;
}
