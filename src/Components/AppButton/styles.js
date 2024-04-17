import { StyleSheet } from 'react-native';
import R from '../../Utils/R';

const styles = StyleSheet.create({
    containerStyle: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'center',
        alignItems: "center",
    },

    primaryStyle: {
        backgroundColor: "#0074B7"
    },

    secondaryStyle: {
        borderWidth: 1,
        borderColor: '#0074B7',
    },

    loaderStyle: {
        position: 'absolute',
        left: 20
    }

});

export default styles;