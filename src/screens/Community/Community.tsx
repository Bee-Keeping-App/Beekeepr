import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';

export function Community() {
    return (
      <View style={styles.container}>
        <Text>Community</Text>
        <Text>Test</Text>
        <Button screen="PostDetails" params={{}} >
          Go to PostDetails
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