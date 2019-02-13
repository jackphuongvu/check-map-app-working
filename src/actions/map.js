import Geocoder from "react-native-geocoder";
import firebase from 'react-native-firebase';

import {
  ADD_MARKER, SET_GEOFIRE,
  SET_REGION, SET_STREET, SET_CITY, SET_CURRENT_SPEED, SET_LIMIT_SPEED,
  SET_DROP_DOWN,
  SET_NOTE_PLACES
} from "./actionTypes";
import {RADIUS_GET_LOCATION} from '../config/constants';
import {setPoliceGeofire} from './policeReport';

/**===================================================**/
export const setGeoFire = (geoFire) => {
  return {
    type : SET_GEOFIRE,
    geoFire : geoFire
  }
};

export const setRegion = (region) => {
  return {
    type: SET_REGION,
    region: region
  };
};

export const setNotePlaces = (notePlaces) => {
  return {
    type: SET_NOTE_PLACES,
    notePlaces: notePlaces
  }
};

export const setDropDown = (dropDown) => {
  return {
    type: SET_DROP_DOWN,
    dropDown: dropDown
  }
};

export const setStreet = (currentStreet) => {
  return {
    type: SET_STREET,
    currentStreet: currentStreet
  }
};

export const setCity = (currentCity) => {
  return {
    type: SET_CITY,
    currentCity: currentCity
  }
};

export const setCurrentSpeed = (currentSpeed) => { // currentSpeed: String
  return {
    type: SET_CURRENT_SPEED,
    currentSpeed: parseFloat((currentSpeed * 3.6).toFixed(1)) // Float
  }
};

export const setLimitSpeed = (limitSpeed) => {
  return {
    type: SET_LIMIT_SPEED,
    limitSpeed: limitSpeed
  }
};

function getFirebaseWithAsync (id) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('notePlaces/' + id).on('value', (snapshot) => {
      resolve(snapshot.val());
    });
  });
}

function getGeoFireItemWithAsync(keys) {
  return new Promise(resolve => {
    let notePlaces = [];
    keys.map(async (key, index) => {
      let id = key.split(':')[1];
      let place = await getFirebaseWithAsync(id);
      notePlaces.push(place);
      if (index === keys.length - 1) resolve(notePlaces);
    });
  });
}

// This func is updated real time.
export const queryNotePlacesWithAsync = () => {
  return (dispatch, getState) => {
    let radius = RADIUS_GET_LOCATION;
    let currentLocation = [
      getState().MapView.initialRegion.latitude,
      getState().MapView.initialRegion.longitude
    ];
    let geoQuery = getState().MapView.geoFire.query({center: currentLocation, radius});

    let keys = [];
    /** ============================================================ */
    geoQuery.on("key_entered", async (key, location, distance) => {
      // console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
      let type = key.split(':')[0]; // drive, police
      if (type !== 'driver') keys.push(key);
    });

    geoQuery.on("ready", function() {
      getGeoFireItemWithAsync(keys).then(result => {
        dispatch(setNotePlaces(result));
        console.log(getState().MapView.notePlaces);
      }).catch(e => console.log(e));
      geoQuery.cancel();
    });
    /** ============================================================ */
  }
};

export const getCurrentLocationWithAsync = () => {
  return (dispatch, getState) => {
    navigator.geolocation.getCurrentPosition((position => {
      dispatch(setCurrentSpeed(position.coords.speed));
      dispatch(setRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }));

      if (Object.values(position).length) {
        Geocoder.geocodePosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }).then(res => {
          let firstItem = res[0];
          let streetName = firstItem.streetName;
          let cityName = firstItem.adminArea;
          dispatch(setStreet(streetName));
          dispatch(setCity(cityName));
        })
          .catch(err => console.log(err));
      }
      // Animate the Map to current Location
      // dispatch(animateToCoordinate()); // DOING

      // Get note places from Firebase into GeoFire.
      dispatch(fetchNotePlaces()); // Update

        /** CHECKING RADIUS FOR LOCATIONS */
      // TODO: Update note places real time.
      dispatch(queryNotePlacesWithAsync());
      /** ============================================================= */
      // TODO: get User ID
      // TODO: update Drivers real time
      let userID = 1; // TESTING: User
      dispatch(setDriverGeofire(userID, position.coords));

      }), (error) => {
        console.log(error.message);
      }, {
        enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
      });
  }
};

/** ======================================================================== */
  // This function just need to called one time to get All note places.
export const fetchNotePlaces = () => {
  return (dispatch, getState) => {
    firebase.database().ref('notePlaces').on('value', (snapshot => { // .orderByKey()
      const notes = snapshot.val() || [];

      // Update into geoFire of notePlaces.
      Object.values(notes).map((place) => {
        dispatch(setPoliceGeofire(place.id, place.coordinate));
      });

      // Update into geoFire of Drivers.
      // dispatch(setNotePlaces(notePlaces));
      // dispatch(setNotePlaces(
      //   Object.values(notes).map((item) => ({...item}))
      // ));


    }));
  }
};

/** MARKER */

export const addMarker = (marker) => {
  return {
    type: ADD_MARKER,
    ...marker
  }
};

export const sendMarkerToServer = (LatLng) => {
  return (dispatch) => {
    let newMarker = {
      coordinate: {
        latitude: LatLng.latitude,
        longitude: LatLng.longitude
      },
      time: Date.now(),
      author: {
        name: 'WeDriver',
        avatar: 'https://lh3.ggpht.com/7JPOKRuanUwnX42dJ9H-PscC-sRkK43GQGRoklxusB4FKBPJEOJY3c7ZhQbcsXol-v8'
      },
      typeReport: 'police',
      like: 0,
      dislike: 0
    };

    let markerRef = firebase.database().ref('notePlaces').push();
    newMarker.id = markerRef.key;

    markerRef.set(newMarker);

    dispatch(addMarker(newMarker));
  }
};

export const setDriverGeofire = (driverID, location) => {
  return (dispatch, getState) => {
    const {geoFire} = getState().MapView;
    geoFire.set('driver:' + driverID, [location.latitude, location.longitude]);
    dispatch(setGeoFire(geoFire));
  }
};