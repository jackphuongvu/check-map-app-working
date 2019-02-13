import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  CurrentRegionContainer : {
    flexDirection:'column',
    alignItems: 'stretch',
    backgroundColor:'transparent'
  },
  currentCityLabel : {
    // fontFamily:Fonts.HelveticaNeue,
    fontSize:14,
    letterSpacing:0.4,
    color:'#a0a3ab',
    fontWeight : 'bold'
  },
  currentCity : {
    // fontFamily:Fonts.HelveticaNeue,
    fontSize: 30,
    letterSpacing: 0.4,
    color : '#ffffff',
    fontWeight : 'bold',
    // marginBottom: 20
  },
  currentStreet : { // TODO
    color : '#ffffff',
    fontSize: 30,
    letterSpacing: 0.4,
    fontWeight : 'bold',
  }
});

export default styles;