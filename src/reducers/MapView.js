import GeoFire from 'geofire';
import firebase from "react-native-firebase";
import {
  SET_REGION, SET_STREET, SET_CITY, SET_CURRENT_SPEED, SET_LIMIT_SPEED,
  SET_DROP_DOWN,
  SET_NOTE_PLACES, SET_GEOFIRE,

  ADD_MARKER
} from "../actions/actionTypes";

import {LATITUDE_DELTA,LONGITUDE_DELTA} from '../config/constants';

const mapState = {
  initialRegion : null,
  currentCity : '',
  currentStreet : '',
  currentSpeed : 0,
  limitSpeed : 0,
  dropDown : null,
  notePlaces : [],
  geoFire : new GeoFire(firebase.database().ref('geofire')) // This ref will control all markers in the app.
};


const notePlace = (state, action) => {
  switch(action.type) {
    case ADD_MARKER:
      return {
        key : action.id,
        coordinate : action.coordinate,
        time : action.time,
        author : action.author,
        typeReport : action.typeReport,
        like : action.like,
        dislike : action.dislike
      };
    default: return state;
  }
};

const MapView = (state = mapState, action) => {
  switch(action.type) {
    case SET_DROP_DOWN:
      return Object.assign({}, state, {
        dropDown : action.dropDown
      });
    case SET_REGION:
      return Object.assign({}, state, {
        initialRegion : {
          latitude : action.region.latitude,
          longitude : action.region.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });
    case SET_NOTE_PLACES:
      return Object.assign({}, state, {
        notePlaces : action.notePlaces
      });
    case SET_CITY:
      return Object.assign({}, state, {
        currentCity : action.currentCity
      });
    case SET_STREET:
      return Object.assign({}, state, {
        currentStreet : action.currentStreet
      });
    case SET_CURRENT_SPEED:
      return Object.assign({}, state, {
        currentSpeed : action.currentSpeed
      });
    case SET_LIMIT_SPEED:
      return Object.assign({}, state, {
        limitSpeed : action.limitSpeed
      });
    case SET_GEOFIRE:
      return Object.assign({}, state, {
        geoFire : action.geoFire
      });

    case ADD_MARKER:
      return Object.assign({}, state, {
        notePlaces : [
          ...state.notePlaces,
          notePlace(undefined, action)
        ]
      });
    default: return state;
  }
};
export default MapView;