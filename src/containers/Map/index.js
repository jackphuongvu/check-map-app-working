import Map from '../../components/Map';
import {setStreet, setCurrentSpeed, setCity, setRegion, getCurrentLocation, setLimitSpeed,
  getCurrentLocationWithAsync, fetchNotePlaces,
  sendMarkerToServer,
  queryNotePlacesWithAsync
} from '../../actions/map';

import { connect } from 'react-redux';

const mapStateToProps = state => state.MapView;

const mapDispatchToProps = (dispatch) => {
  return {
    // getCurrentLocation : () => {
    //   dispatch(getCurrentLocation());
    // },
    setCity : (currentCity) => {
      dispatch(setCity(currentCity));
    },
    setStreet : (currentStreet) => {
      dispatch(setStreet(currentStreet));
    },
    setRegion : (region) => {
      dispatch(setRegion(region));
    },
    fetchNotePlaces : () => {
      dispatch(fetchNotePlaces());
    },
    setCurrentSpeed : (currentStreet) => {
      dispatch(setCurrentSpeed(currentStreet));
    },
    setLimitSpeed : (limitStreet) => {
      dispatch(setLimitSpeed(limitStreet));
    },
    updateCurrentState : () => {
      dispatch(getCurrentLocationWithAsync());
    },
    sendMarkerToServer : (LatLng) => {
      dispatch(sendMarkerToServer(LatLng));
    },
    queryNotePlacesWithAsync : () => {
      dispatch(queryNotePlacesWithAsync());
    }
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(Map);