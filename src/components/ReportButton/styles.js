import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
  buttonItem : {
    // padding : 15,
    paddingTop: 5,
    paddingBottom: 5,
    flex:1,
    borderColor:'#f4f4f4',
    borderWidth:1,
    justifyContent: 'center'
  },
  buttonItemImage : {
    flex:45,
    alignItems:'center'
  },
  buttonItemTextContainer : {
    flex: 55,
    paddingRight: 20
  },
  buttonItemText : {
    // fontFamily:Fonts.HelveticaNeue,
    fontSize:14,
    fontWeight:'bold',
    letterSpacing:0.2,
    color:'#353a48',
  },
  buttonRowItems : {
    flexDirection:'row',
    alignItems : 'center',
    justifyContent: 'center'
  }
});
export default styles;