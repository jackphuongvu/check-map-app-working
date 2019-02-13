import React, { Component } from 'react';
import { StyleSheet, NetInfo, Image, View, Text } from 'react-native';
import { MapView, Location, Permissions } from 'expo';
import queryString from 'query-string';


import firebase from '../../config/firebase';

import {checkInternetConnection, testCallAPIforSpeedLimit,
  getTotalChildren
} from '../../config/helpers';
import key from '../../config/key';
// import {HERE_MAPS_APP_ID, HERE_MAPS_APP_CODE} from '../../config/key';
import {messagesReportItems, RADIUS_GET_LOCATION} from '../../config/constants';
import images from '../../config/images';
import mapDarkStyle from '../../config/mapDarkStyle';
import styles from './styles';

class Map extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     hasLocationPermissions : false
  //   };
  //   this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(this);
  // }

  state = {
    hasLocationPermissions : false,
    // notePlacesAsState : []
  };

  handleFirstConnectivityChange(connectionInfo) {
    // console.log('CHECKING: handleFirstConnectivityChange');
    // this.props.updateCurrentState();

    // console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  // componentWillReceiveProps(nextProps) {
  //   // set State of this thing. notePlacesAsState
  //   console.log(this.nextProps);
  //   this.setState({
  //     notePlacesAsState : nextProps.notePlacesAsState
  //   });
  // }

  getLocationAsync = async () => {
    // const { Location, Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      // return Location.getCurrentPositionAsync({enableHighAccuracy: true});
    } else {
      this.getLocationAsync();
      throw new Error('Location permission not granted');
    }
  };
  checkLocationPermission = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      this.getLocationAsync();
    }
  };
  checkLocationSetting = async () => {
    // TODO: Checking with Location Settings later if we can with Expo
  };
  getTypeReportBySlug (type) {
    return messagesReportItems.filter((item ) => {
      return item.type === type;
    })[0];
  }
  componentWillMount() {
  
    // Checking current Location.
    // this._getLocationAsync();
    // this.props.getCurrentLocation();
  }
  componentDidMount () {
    // Check Location Permission
    this.checkLocationPermission();
    //Get the current GPS state
    // this.checkLocationSetting();
    // console.log('updateCurrentState with componentWillMount');

    // Check Internet Connection
    checkInternetConnection();

    // this.props.updateCurrentState();
    console.log('GOI HAM NAY TRONG componentWillMount CUA MAP');
    this.props.updateCurrentState();

    /** Checking Internet Connection. */
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
    // ==================================================
    
    const onChildChange = (data) => {
      const position = data.val();
      // this.props.queryNotePlacesWithAsync();
    }

    firebase.database().ref('geofire').on('child_added', onChildChange);
    firebase.database().ref('geofire').on('child_changed', onChildChange);

    /** Update current location */

    Location.watchPositionAsync({enableHighAccuracy: true, distanceInterval: 1}, function(position){
      // console.log(position);
    });

    this.watchID = navigator.geolocation.watchPosition(
      async (position) => {

        // console.log(position);

        /** Set current speed */
        // let speed = (position.coords.speed * 3.6).toFixed(1);
        this.props.setCurrentSpeed(position.coords.speed);

        /** Set coordinate */
        this.props.setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        /** Set current city and street */
        Location.reverseGeocodeAsync(position.coords).then(geocode => {
          let firstItem = geocode[0];
          let streetName = firstItem.street;
          let cityName = firstItem.region;
          this.props.setStreet(streetName);
          this.props.setCity(cityName);
        }).catch(e => console.log(e));

        /** Set limit speed */
        // this.props.setLimitSpeed();
        // testCallAPIforSpeedLimit();
        // DOING =============================

        /** Update geoFire location of Driver. */
        // let userID = 1;
        // this.props.geoFire.set('driver:' + userID, [this.props.initialRegion.latitude, this.props.initialRegion.longitude]);
        // Checking now with geoFire of Driver.

        /** Checking Note Places */
        // this.props.queryNotePlacesWithAsync();
        // TODO is checking

        // console.log(this.props.notePlaces);
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1},



    );

    // TODO: Request Location Permission if locationPermission is false after each times 5s.
  }

  /** Checking Firebase new Item */
  // componentWillReceiveProps() {
  //   const onChildChange = (snapshot) => {
  //     let data = snapshot.val();
  //     console.log('componentWillReceiveProps');
  //     console.log(data);
  //   }
  //   firebase.database().ref('geofire').on('child_added', onChildChange);
  // }
  // componentWillUpdate() {
  //   const onChildChange = (snapshot) => {
  //     let data = snapshot.val();
  //     console.log('componentWillUpdate');
  //     console.log(data);
  //   }
  //   firebase.database().ref('geofire').on('child_added', onChildChange);
  // }
  // componentDidUpdate() {
  //   const onChildChange = (snapshot) => {
  //     let data = snapshot.val();
  //     console.log('componentDidUpdate');
  //     console.log(data);
  //   }
  //   firebase.database().ref('geofire').on('child_added', onChildChange);
  // }
  // ==============================


  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  addNewMarker(e) {
    let item = e.nativeEvent.coordinate; // console.log(e.nativeEvent.coordinate)
    // console.log(item);
    this.props.sendMarkerToServer(item);
  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      this.setState({ hasLocationPermissions: true });
    }

    // let location = await Location.getCurrentPositionAsync({});
    // console.log(location);
    // this.setState({ location });
  };
  render() {
    return (
      <MapView
        style={[StyleSheet.absoluteFillObject, styles.MapViewContainer]}
        provider={MapView.PROVIDER_GOOGLE}
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
      >
        {this.props.initialRegion && (
          <MapView.Marker
            coordinate={{
              latitude : this.props.initialRegion.latitude,
              longitude : this.props.initialRegion.longitude
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            image={images.MapScreen.car}
            // rotation={this.state.rotation}
            // flat={true}
          />
        )}
        {this.props.initialRegion && (
          <MapView.Circle
            key = { ( this.props.initialRegion.latitude + this.props.initialRegion.longitude).toString() }
            center = { this.props.initialRegion }
            radius = { RADIUS_GET_LOCATION * 1000 }
            strokeWidth = { 1 }
            strokeColor = { '#1a66ff' }
            fillColor = { 'rgba(230,238,255,0.5)' }
            // onRegionChangeComplete = { this.onRegionChangeComplete.bind(this) }
          />
        )}
        {this.props.notePlaces && this.props.notePlaces.length > 0 && this.props.notePlaces.map((place) => {
          const markerItem = this.getTypeReportBySlug(place.typeReport);
          if (!markerItem) console.log('markerItem UNDEFINED');
          // const imageUrl = markerItem.logoImage;
          return (
            <MapView.Marker key={`police${place.id}`}
                            // coordinate={place.coordinate}
                            coordinate={{
                              latitude : place.coordinate.latitude,
                              longitude: place.coordinate.longitude,
                            }}
              // image={imageUrl}
            >
              {/* <View style={{
                backgroundColor : 'red'
              }}>
                <Text>{place.id}</Text>
              </View> */}
              {/* <Image source={images.MapScreen.police}
                     style={styles.MarkerImage}
              /> */}
            </MapView.Marker>);
        })}
      </MapView>
    );
  }
}

export default Map;
