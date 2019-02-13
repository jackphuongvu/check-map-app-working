import { StyleSheet, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container : {
    flex : 1
  },
  mainLayout : {
    padding : 20,
    justifyContent: 'flex-end',
    flex : 1
  },
  defaultContainer : {
    flexDirection : 'row',
    flex : 1,
    backgroundColor : 'yellow',
    justifyContent : 'center',
    alignItems : 'center',
    padding: 12,
    margin : 20,
    borderRadius : 8,
    shadowColor : 'rgba(0,0,0,1)',
    shadowOffset : {
      width : 0,
      height : 5
    },
    shadowRadius : 10,
    shadowOpacity : 0.5
  },
  messageStyle : {
    fontSize: 14, textAlign: 'left', fontWeight: 'bold', color: 'white',
  },
  imageStyle : {
    marginTop : 10,
    marginLeft : 3,
    marginRight : 5,
    // flex : 1,
    alignItems : 'center',
    // backgroundColor : 'red',
    height : 44 // 44
  }


});

export const dropDownStyles = {
  defaultContainer : {
    flexDirection : 'row',
    flex : 1,
    backgroundColor : 'yellow',
    justifyContent : 'center',
    alignItems : 'center',
    padding: 12,
    paddingTop: StatusBar.currentHeight,
    margin : 20,
    borderRadius : 8,
    shadowColor : 'rgba(0,0,0,1)',
    shadowOffset : {
      width : 0,
      height : 5
    },
    shadowRadius : 10,
    shadowOpacity : 0.5
  },
  messageStyle : {
    fontSize: 14, textAlign: 'left', fontWeight: 'bold', color: 'white',
  },
  imageStyle : {
    marginTop : 10,
    marginLeft : 3,
    marginRight : 5,
    alignItems : 'center',
    height : 44 // 44
  }
};

export default styles;
