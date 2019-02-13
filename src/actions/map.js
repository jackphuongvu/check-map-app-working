import {Location, Permissions} from "expo";

import firebase from '../config/firebase';
import {RADIUS_GET_LOCATION} from '../config/constants';
import {
  ADD_MARKER, SET_GEOFIRE,
  SET_REGION, SET_STREET, SET_CITY, SET_CURRENT_SPEED, SET_LIMIT_SPEED,
  SET_DROP_DOWN,
  SET_NOTE_PLACES
} from "./actionTypes";
import {setPoliceGeofire} from './policeReport';
/**===================================================**/
export const setGeoFire = (geoFire) => {
  return {
    type : SET_GEOFIRE,
    geoFire : geoFire
  }
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

export const setRegion = (region) => {
  return {
    type : SET_REGION,
    region : region
  };
};

export const setStreet = (currentStreet) => {
  return {
    type : SET_STREET,
    currentStreet : currentStreet
  }
};

export const setCity = (currentCity) => {
  return {
    type : SET_CITY,
    currentCity : currentCity
  }
};

export const setCurrentSpeed = (currentSpeed) => {
  return {
    type : SET_CURRENT_SPEED,
    currentSpeed : parseFloat((currentSpeed * 3.6).toFixed(1))
  }
};

export const setLimitSpeed = (limitSpeed) => {
  return {
    type: SET_LIMIT_SPEED,
    limitSpeed: limitSpeed
  }
};

export const getCurrentLocation = () => {
  return (dispatch) => {
    navigator.geolocation.getCurrentPosition((position => {
      // console.log(position);
      dispatch(
        setRegion({
          latitude : position.coords.latitude,
          longitude : position.coords.longitude
        }));
        // Animate the Map to current Location
        // dispatch(animateToCoordinate()); // DOING
      })
      , (error) => {
        console.log(error.message);
      },{
        enableHighAccuracy : true, timeout : 20000, maximumAge : 1000
      });
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
    
    notePlaces = keys.map(async (key, index) => {
      let id = key.split(':')[1];
      let place = await getFirebaseWithAsync(id);
      return place;
    });

    Promise.all(notePlaces).then((notePlaces) => {
      resolve(notePlaces);
    }).catch(error => {
      console.log('ERROR INSIDE PROMISE ALL NOTE PLACES');
      console.log(error);
    });
  });
}

// This func is updated real time.
// Call this func inside firebase.onChildAdd
export const queryNotePlacesWithAsync = () => {
  return (dispatch, getState) => {

    /* Check current Location before doing anything */

    // TODO: User Location is not working here.
    const { initialRegion } = getState().MapView;
    if (!initialRegion) {
      console.log('LOCATION KO TON TAI TRUOC KHI SET NOTE PLACES');
      return;
    }

    let radius = RADIUS_GET_LOCATION;
    let currentLocation = [
      initialRegion.latitude,
      initialRegion.longitude
    ];
    let geoQuery = getState().MapView.geoFire.query({center: currentLocation, radius});

    let keys = [];
    /** ============================================================ */
    geoQuery.on("key_entered", async (key, location, distance) => {
      // console.log('Joined in current Radius');
      console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
      // console.log( distance.toFixed(2) + " km from center");

      let type = key.split(':')[0]; // drive, police
      if (type !== 'driver') keys.push(key);
    });

    geoQuery.on("ready", async function() {
      getGeoFireItemWithAsync(keys).then(result => {
        dispatch(setNotePlaces(result));
      }).catch(e => {
        console.log(e);
      });

      geoQuery.cancel();
    });
    /** ============================================================ */
  }
};

// export const getNotePlaces = () => {
//   return (dispatch) => {
//     dispatch(fetchNotePlaces()); // Update

//     dispatch(queryNotePlacesWithAsync());

//     /* set Driver */
//     let userID = 1;
//     dispatch(setDriverGeofire(userID, position.coords));
//   }
// }

export const getCurrentLocationWithAsync = () => {
  return async (dispatch, getState) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // console.log(status);
    // let position = await Location.getCurrentPositionAsync({enableHighAccuracy: true, maximumAge: 1000});

    /**
     * 1. 
     */
    console.log('TRUOC KHI GET LOCATION BY getCurrentPositionAsync');
    Location.getCurrentPositionAsync({enableHighAccuracy: true, maximumAge: 1000})
    .then(
      position => {
        console.log('GET LOCATION BY getCurrentPositionAsync THANH CONG');
        // console.log('getCurrentLocationWithAsync');
        // console.log(position);
        dispatch(setCurrentSpeed(position.coords.speed));
        dispatch(setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));

        if (Object.values(position).length) {
          Location.reverseGeocodeAsync(position.coords).then(geocode => {
            let firstItem = geocode[0];
            let streetName = firstItem.street;
            let cityName = firstItem.region;
            dispatch(setStreet(streetName));
            dispatch(setCity(cityName));
          }).catch(e => console.log(e));
        }
        // Animate the Map to current Location
        // dispatch(animateToCoordinate()); // DOING

        // Get note places from Firebase into GeoFire.
        // EDITING
        // TODO
        // dispatch(fetchNotePlaces()); // Update

        /** CHECKING RADIUS FOR LOCATIONS */
        // TODO: Update note places real time.
        dispatch(queryNotePlacesWithAsync());
        /** ============================================================= */
          // TODO: get User ID
          // TODO: update Drivers real time
        let userID = 1; // TESTING: User
        dispatch(setDriverGeofire(userID, position.coords));
      }
    ).catch(error => console.log(error));

  }
};

export const setDriverGeofire = (driverID, location) => {
  return (dispatch, getState) => {
    const {geoFire} = getState().MapView;
    geoFire.set('driver:' + driverID, [location.latitude, location.longitude]);
    dispatch(setGeoFire(geoFire));
  }
};

/** ======================================================================== */
  // This function just need to called one time to get All note places.
export const fetchNotePlaces = () => {
  return (dispatch, getState) => {
    firebase.database().ref('notePlaces').on('value', (snapshot => { // .orderByKey()
      const notes = snapshot.val() || [];

      // Update into geoFire of notePlaces.
      // TODO: it took us for a long time to wait this thing.
      // Object.values(notes).map((place) => {
      //   dispatch(setPoliceGeofire(place.id, place.coordinate));
      // });

      // console.log(notes);

      // Update into geoFire of Drivers.
      // dispatch(setNotePlaces(notePlaces));
      dispatch(setNotePlaces(
        Object.values(notes).map((item) => ({...item}))
      ));

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
      // id : uuid(),
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

    /** Don't use notePlaces of Firebase anymore */
    let markerRef = firebase.database().ref('notePlaces').push();
    newMarker.id = markerRef.key;
    markerRef.set(newMarker);
    /** Just use geoFire branch */

    /** Create new Item with default key from Firebase */
    // let markerRefToGeofire = firebase.database().ref('geofire').push();
    // // newMarker.id = markerRefToGeofire.key;
    // markerRefToGeofire.set(newMarker);

    // TODO:
    dispatch(setPoliceGeofire(newMarker.id,newMarker.coordinate));

    // dispatch(alertSuccess(type));
  }
};