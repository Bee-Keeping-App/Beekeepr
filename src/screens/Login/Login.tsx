import { Text } from '@react-navigation/elements';
import { StaticScreenProps } from '@react-navigation/native';
import { ImageBackground, StyleSheet, View } from 'react-native';

 

export function Login() {
    return (
        <ImageBackground source={require('./assets/placeholderBackground.png')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.text}>Test Text</Text>
            </View>
        </ImageBackground>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    background: {
        flex: 1, // Ensures the ImageBackground fills the entire screen/container
        resizeMode: 'cover', // Or 'contain', 'stretch', 'repeat', 'center'
        justifyContent: 'center',
    alignItems: 'center',
    },
    overlayContent: {
        // Styles for the content placed on top of the image
    },
      text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
