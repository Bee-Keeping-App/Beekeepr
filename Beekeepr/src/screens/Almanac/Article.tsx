import { Text } from '@react-navigation/elements';
import { StaticScreenProps } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

type Props = StaticScreenProps<{
  user: string;
}>;

export function Article({ route }: Props) {
  return (
    <View style={styles.container}>
      <Text>Temp article</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});