import Dimensions from 'react-native';

import GeoFire from 'geofire';
import firebase from '../config/firebase';

// import { GOOGLE_MAPS_APIKEY, HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE } from '../config/settings';
import {addMarker, setGeoFire,
  queryNotePlacesWithAsync
} from './map';
import {messagesReportItems,LATITUDE_DELTA} from '../config/constants';
/** ==================================================================== */

/** Police Report **/
export const setPoliceGeofire = (policeID, location) => {
  return async (dispatch, getState) => {
    const { geoFire } = getState().MapView;
    await geoFire.set('police:' + policeID, [location.latitude, location.longitude]);
    dispatch(setGeoFire(geoFire));
    dispatch(queryNotePlacesWithAsync());
  }
};

export const alertSuccess = (type) => {
  return (dispatch, getState) => {

    // messagesReportItems : POlICE
    let item = messagesReportItems.filter(item => {
      return item.type === type
    })[0];

    // jack: Checking. TODO
    /*before*/
    // const { dropDown } = getState().MapView;
    // dropDown.alertWithType('success', '', item.message.success);

    /*after*/
    // DropDownHolder.getDropDown().alertWithType('success', '', item.message.success);
  }
};

export const sendMarkers = (type) => {
  return (dispatch, getState) => {

    // get Current User in our App
    // TODO

    const {
      initialRegion
    } = getState().MapView;
    if (!initialRegion) return;

    let newMarker = {
      // coordinate : {
      //   latitude : initialRegion.latitude + ((Math.random() - 0.5) * (LATITUDE_DELTA )),
      //   longitude : initialRegion.longitude + ((Math.random() - 0.5) * (LATITUDE_DELTA ))
      // },
      coordinate : {
        latitude : initialRegion.latitude,
        longitude : initialRegion.longitude
      },
      time : Date.now(),
      author : {
        name : 'WeDriver',
        avatar : 'https://lh3.ggpht.com/7JPOKRuanUwnX42dJ9H-PscC-sRkK43GQGRoklxusB4FKBPJEOJY3c7ZhQbcsXol-v8'
      },
      typeReport : type,
      like : 0,
      dislike : 0
    };

    let markerRef = firebase.database().ref('notePlaces').push();
    newMarker.id = markerRef.key;

    markerRef.set(newMarker);

    // Update note places
    // dispatch(addMarker(newMarker));

    dispatch(setPoliceGeofire(newMarker.id,newMarker.coordinate));

    dispatch(alertSuccess(type));
  }
};
