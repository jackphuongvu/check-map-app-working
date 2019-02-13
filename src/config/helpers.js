import {NetInfo,Alert} from "react-native";
// import DeviceSettings from "react-native-device-settings";
import firebase from './firebase';

import alerts from "./alerts";
// import GPSState from "react-native-gps-state";

export function checkInternetConnection () {
  // Check Internet Permission.
  NetInfo.getConnectionInfo().then((connectionInfo) => {
    // connectionInfo.type : none, wifi, cellular
    if (connectionInfo.type !== 'none') {
      // Connect Successfully.
    } else if (connectionInfo.type === 'none') {
      // Checking Asking Permissions
      Alert.alert(
        'Thông báo',
        alerts.WIFI.turnOnNotification,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => {
              // TODO: Open wifi settings with Expo.
            }},
        ],
        { cancelable: false }
      );
    }
  }).catch(e => console.log(e));
}
/** ===================================================================== */
export function testCallAPIforSpeedLimit () {
  let url = 'https://geocoder.api.here.com/6.2/geocode.json?app_id=7L4HoLOzKfBCAWOnNLc4&app_code=2km0tDZGFtBn3zafKq7wRQ&country=VNM&street=X%C3%B4+Vi%E1%BA%BFt+Ngh%E1%BB%87+T%C4%A9nh&city=%C4%90%C3%A0+N%E1%BA%B5ng&mode=retrieveAddresses&locationAttributes=linkInfo';

  fetch(url)
    .then(response => response.json())
    .then((results) => {
      // console.log(results);
      
      let speed = results.Response.View[0].Result;
      let firstItem = speed[0].Location.LinkInfo;
      console.log(firstItem);
      
    })
    .catch(error => console.log(error));

}

export function getTotalChildren (strChildren) {
  firebase.database().ref(strChildren).on('value',(snapshot) => {
    console.log("There are "+snapshot.numChildren()+" messages in" + strChildren);
  });
}
