import {createStackNavigator, StackNavigator, createDrawerNavigator,
  DrawerItems, SafeAreaView
} from "react-navigation";

import MapScreen from '../containers/MapScreen';

const MapScreenNavigator = createStackNavigator({
  Home : {
    screen: MapScreen,
    navigationOptions : {
      header : null
    }
  }
});

const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen: MapScreenNavigator,
    navigationOptions : {
      header : null,
      // title : 'LunVjp Map'
    }
  },
});
export default AppDrawerNavigator;