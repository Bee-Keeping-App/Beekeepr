import { Text } from '@react-navigation/elements';
import { StaticScreenProps } from '@react-navigation/native';
import { ImageBackground, StyleSheet, View, Dimensions } from 'react-native';

 

export function Login() {
    return (
        //don't like this local based navigation to the background image but I'm not sure where // starts us until i double check`
        <ImageBackground source={require('../../assets/placeholderBackground.png')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.text}>Test Text</Text>
            </View>
        </ImageBackground>
    );
}


const {width, height} = Dimensions.get('window');

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
        //width: width,
        height: '100%',
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
