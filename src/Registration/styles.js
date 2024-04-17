import {StyleSheet} from 'react-native';
import { width } from '../Utils/Constants/Dimensions';

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    formContainer: {
        height: '100%',
        flexDirection: 'row',
        backgroundColor: 'green',
        width: '400%'
    }
});

export default styles;
