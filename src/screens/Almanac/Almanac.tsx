import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';

export function Almanac() {
    return (
      <View style={styles.container}>
        <Text>Almanac</Text>
        <Text>Test</Text>
        <Button screen="Article" params={{}} >
          Go to Article
        </Button>

        <Button screen="Weather" params={{}}>
          Go to Weather
        </Button>
        
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