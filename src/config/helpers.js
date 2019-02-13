import {NetInfo,Alert} from "react-native";
import DeviceSettings from "react-native-device-settings";

import alerts from "./alerts";
import GPSState from "react-native-gps-state";

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
              // TODO: Open wifi settings.
              DeviceSettings.wifi();
            }},
        ],
        { cancelable: false }
      );
    }
  });
}

export function alertLocationSettings () {
  Alert.alert(
    'Thông báo',
    alerts.LOCATION.turnOnNotification,
    [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'OK', onPress: () => {
          GPSState.openSettings();
        }},
    ],
    { cancelable: false }
  );
}

/** ===================================================================== */
export function random_position(latitude, longitude, meters=50) {
  // def random_position(latitude, longitude, meters=50):
  let r = meters / 111300.0;

  let y0 = latitude;
  let x0 = longitude;

  let u = Math.random();
  let v = Math.random();

  let w = r * Math.sqrt(u);
  let t = 2 * Math.PI * v;

  let x = w * Math.cos(t);

  let y1 = w * Math.sin(t);
  let x1 = x / Math.cos(y0);

  return {'latitude': (y0 + y1), 'longitude': (x0 + x1)}
}

export function get_fake_drivers (latitude, longitude) {
  return [
    {'id': 1, 'name': 'Blick', 'position': random_position(latitude, longitude, 600)},
    {'id': 2, 'name': 'Flick', 'position': random_position(latitude, longitude, 600)},
    {'id': 3, 'name': 'Glick', 'position': random_position(latitude, longitude, 600)},
    {'id': 4, 'name': 'Plick', 'position': random_position(latitude, longitude, 600)},
    {'id': 5, 'name': 'Quick', 'position': random_position(latitude, longitude, 600)},
    {'id': 6, 'name': 'Snick', 'position': random_position(latitude, longitude, 600)},
    {'id': 7, 'name': 'Whick', 'position': random_position(latitude, longitude, 600)},
  ]
}