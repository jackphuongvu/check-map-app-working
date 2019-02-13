import React from 'react';
import {NetInfo, View} from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import configureStore from './config/configureStore';
import allReducers from './reducers';
import AppDrawerNavigator from './navigation'

const loggerMiddleware = createLogger();
const store = createStore(
  allReducers,
  applyMiddleware(
    thunkMiddleware,
    // loggerMiddleware
  )
);

// const store = configureStore();

const RootApp = () => (
  <View style={{
    flex : 1
  }}>
    <AppDrawerNavigator/>
  </View>
);

// const App = () => (
//   <Provider store={store}>
//     <RootApp />
//   </Provider>
// );
class App extends React.Component {
  componentDidMount () {
    // NetInfo.addEventListener(
    //   'connectionChange',
    //   (connectionInfo) => {
    //     // TODO: Update current State for MapView
    //     console.log(connectionInfo.type);
    //     // this.setState(this.state);
    //   }
    // );
  }
  render () {
    return (
      <Provider store={store}>
        <RootApp />
      </Provider>
    );
  }
}
export default App;