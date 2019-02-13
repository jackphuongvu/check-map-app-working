import React, { Component } from 'react';
import { StyleSheet, NetInfo, Alert, Platform, Image, InteractionManager} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import Permissions from 'react-native-permissions';
import GPSState from 'react-native-gps-state';
// import geolib from 'geolib';
import firebase from 'react-native-firebase';
import GeoFire from 'geofire';

import TESTING from '../../data/TESTING';
import keys from '../../config/key';
import {messagesReportItems} from '../../config/constants';
import alerts from '../../config/alerts';
import {alertLocationSettings, get_fake_drivers} from '../../config/helpers';
import mapDarkStyle from '../../config/mapDarkStyle';
import images from '../../config/images';
import styles from './styles';
import {checkInternetConnection} from '../../config/helpers';
import {setNotePlaces} from "../../actions/map";
const googleApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

Geocoder.fallbackToGoogle(keys.GEO_CODING_API_KEY);

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationPermission : false
    };
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
    // this.geoFire = new GeoFire(firebase.database().ref('geofire').push());
  }

  _requestPermission = () => {
    Permissions.request('location').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      console.log(response);
      this.setState({ locationPermission: response === 'authorized' });

      if (response === 'authorized') {
        //
      } else {
        this._requestPermission();
      }
    });
  };

  checkLocationPermission = () => {
    Permissions.check('location').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({
        locationPermission : response === 'authorized'
      });
      // console.log(response);
      if (response !== 'authorized') {
        this._requestPermission();
      }
    }).catch(e => console.log(e));

    // let locationPermission = await Permissions.check('location');
    // console.log(locationPermission);
  };

  checkLocationSetting = () => {
    GPSState.getStatus().then((status) => {
      switch(status) {
        case GPSState.NOT_DETERMINED:
          // alert('Please, allow the location, for us to do amazing things for you!');
          break;
        case GPSState.RESTRICTED:
          alertLocationSettings();
          break;
        case GPSState.DENIED:
          // alert('It`s a shame that you do not allowed us to use location :(');
          break;
        case GPSState.AUTHORIZED_ALWAYS:
        case GPSState.AUTHORIZED_WHENINUSE:
          console.log('updateCurrentState CHECKING LOCATIONS');
          this.props.updateCurrentState();
          break;
      }
    }).catch(e => console.log(e));
  };


  /** Listener for Updating Internet Connection */
  // Not working AND both works sometimes.
  // TODO: Checking later.
  handleFirstConnectivityChange(connectionInfo) {
    // console.log('CHECKING: handleFirstConnectivityChange');
    // this.props.updateCurrentState();

    // console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  getTypeReportBySlug (type) {
    return messagesReportItems.filter((item ) => {
      return item.type === type;
    })[0];
  }

  componentWillMount() {
    // Check Location Permission
    this.checkLocationPermission();
    //Get the current GPS state
    this.checkLocationSetting();

    // Check Internet Connection
    checkInternetConnection();
  }
  /** ======================================================================== */

  // watchNotePlaces () {
  //   const onChildChange = (data) => {
  //     let item = data.val();
  //
  //     this.props.geoFire.set('police:' + item.id, [item.coordinate.latitude,
  //       item.coordinate.longitude]);
  //   };
  //
  //   // The problem is How can this func will be called.
  //   firebase.database().ref('notePlaces').on('child_added', onChildChange);
  //   firebase.database().ref('notePlaces').on('child_changed', onChildChange);
  // }

  /** Query all note places around 5KM */
  queryNotePlaces() {
    let radius = 5; // 100m
    let currentLocation = [
      16.0311044, // this.props.initialRegion.latitude ||
      108.21407149999999 // this.props.initialRegion.longitude ||
    ];

    let driversFound = {};

    let geoQuery = this.props.geoFire.query({center: currentLocation, radius});

    geoQuery.on("key_entered", (key, location, distance) => {

      console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
    });
  }

  componentDidMount () {
    //===================================================================
    // InteractionManager.runAfterInteractions(_ => {
    //   console.log('Watch Drivers.');
    //   console.log('Checking Position');
    //   setTimeout(() => {
    //     console.log('Time OUT!');
    //     // TODO
    //   }, 100);
    // });


    // TODO: Request Location Permission if locationPermission is false after each times 5s.
    // Call this function for the first time running App.
    // this.props.fetchNotePlaces(); // Call this function in getCurrentLocation already.

    /** Listen to Check GPS Setting */
    GPSState.addListener((status)=> {
      switch(status) {
        case GPSState.AUTHORIZED_ALWAYS:
        case GPSState.AUTHORIZED_WHENINUSE:
          console.log('updateCurrentState Checking first time!');
          this.props.updateCurrentState();
          break;
      }
    });

    // TODO: Not working in Children Component
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );

    /** Update current location */
    this.watchID = navigator.geolocation.watchPosition(async (position) => {

      /** Set current speed */
      this.props.setCurrentSpeed(position.coords.speed);

      /** Set limit speed */
      // this.props.setLimitSpeed();

      /** Set coordinate */
      this.props.setRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      /** Set current city and street */
      if (Object.values(this.props.initialRegion).length) {
        Geocoder.geocodePosition({
          lat : this.props.initialRegion.latitude,
          lng : this.props.initialRegion.longitude
        }).then(res => {
          let firstItem = res[0];
          let streetName = firstItem.streetName;
          let cityName = firstItem.adminArea;
          this.props.setStreet(streetName);
          this.props.setCity(cityName);
        })
          .catch(err => console.log(err));
      }

      /** Update geoFire location of Driver. */
      let userID = 1;
      this.props.geoFire.set('driver:' + userID, [this.props.initialRegion.latitude, this.props.initialRegion.longitude]);

      /** Checking Note Places */
      // TODO:
      this.props.queryNotePlacesWithAsync();

    }, (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1});

  }
  addNewMarker(e) {
    let item = e.nativeEvent.coordinate; // console.log(e.nativeEvent.coordinate)
    // console.log(item);
    this.props.sendMarkerToServer(item);
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    GPSState.removeListener();
  }
  _onRenderMap() {
    console.log('onLayout function');
    setTimeout(_ => {
      console.log('_onRenderMap');
      // this.onChangePosition(this.state.passengerPosition)
    }, 1000);
    InteractionManager.runAfterInteractions(_ => {
      setTimeout(_ => {
        console.log('_onRenderMap');
        // this.onChangePosition(this.state.passengerPosition)
      }, 1000)
    })
  }
  render() {
    return (
      <MapView
        style={[StyleSheet.absoluteFillObject, styles.MapViewContainer]}
        provider={PROVIDER_GOOGLE}
        initialRegion={this.props.initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        followsUserLocation={true}
        ref={mapView => {
          // this.mapView = mapView;
        }}
        customMapStyle={mapDarkStyle}
        minZoomLevel={5}
        loadingEnabled={true}
        onPress={this.addNewMarker.bind(this)}
        // onLayout={this._onRenderMap.bind(this)}
      >
        {this.props.initialRegion && (
          <MapView.Marker
            coordinate={{
              latitude : this.props.initialRegion.latitude,
              longitude : this.props.initialRegion.longitude
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            image={images.MapScreen.car}
            rotation={this.state.rotation}
            // flat={true}
          />
        )}
        {this.props.notePlaces && this.props.notePlaces.length > 0 && this.props.notePlaces.map((place) => {
          const markerItem = this.getTypeReportBySlug(place.typeReport);
          if (!markerItem) console.log('markerItem UNDEFINED');
          // const imageUrl = markerItem.logoImage;
          return (
            <MapView.Marker key={`police${place.id}`}
                            coordinate={place.coordinate}
                            // image={imageUrl}
            >
              <Image source={images.MapScreen.police}
                     style={styles.MarkerImage}
              />
            </MapView.Marker>);
        })}
      </MapView>
    );
  }
}

export default Map;