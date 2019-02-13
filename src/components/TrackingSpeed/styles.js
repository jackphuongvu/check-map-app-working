import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  speedContainerColumn : {
    marginLeft: 30,
    marginTop : 20,
    marginBottom : 20,
    flex : 1
  },
  speedMeter : {
    // fontFamily: Fonts.HelveticaNeue,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    textAlign: 'left',
    color: '#353a48'
  },
  speedCount : {
    fontSize: 40
  },
  speedLabel : {
    // fontFamily : Fonts.HelveticaNeue,
    fontSize : 14,
    fontWeight : 'bold',
    letterSpacing : 0.2,
    color : '#9b9b9b'
  }
});

export default styles;