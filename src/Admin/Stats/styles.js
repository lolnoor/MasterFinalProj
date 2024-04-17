import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  citySelectorContainerStyle: {
    flex: 1,
    alignItems: 'center',
    zIndex: 10,
    paddingRight: 10,
    flexDirection: 'row'
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },    

  filterIconStyle: {
    width: 16,
    height: 16
  },    

  flex1: {
      flex: 1,
      paddingHorizontal: 5,
  },

  crossStyle: {
     flex: 1,
     textAlign: 'right',
      color:'red'
  }

});

export default styles;