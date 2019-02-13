import React from 'react';
import { View } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import DropdownAlert from "react-native-dropdownalert";

import allReducers from './reducers';
import AppDrawerNavigator from './navigation';
import {DropDownHolder, dropDrownConfig} from './config/constants';
import MapScreen from './containers/MapScreen';
import {dropDownStyles} from "./screens/MapScreen/styles";

const loggerMiddleware = createLogger();
const store = createStore(
  allReducers,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

const RootApp = () => (
  <View style={{
    flex : 1
  }}>
    <AppDrawerNavigator/>
    <DropdownAlert ref={ref => {
      DropDownHolder.setDropDown(ref);
    }}
                   closeInterval={dropDrownConfig.closeInterval}
                   successColor={dropDrownConfig.successColor}
                   defaultContainer={dropDownStyles.defaultContainer}
                   messageStyle={dropDownStyles.messageStyle}
                   imageStyle={dropDownStyles.imageStyle}
                   successImageSrc={dropDrownConfig.successImageSrc}
                   errorImageSrc={dropDrownConfig.errorImageSrc}

    />
  </View>
);

const App = () => (
  <Provider store={store}>
    <RootApp />
  </Provider>
);

export default App;