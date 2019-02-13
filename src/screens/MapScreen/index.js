import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
// import DropdownAlert from "react-native-dropdownalert";

import Map from '../../containers/Map';
import CurrentRegion from '../../containers/CurrentRegion';
import Speed from '../../containers/Speed';
import ReportSection from './ReportSection';

import styles, { dropDownStyles } from './styles';
import images from "../../config/images";

class MapScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Map/>
        <View style={[
          StyleSheet.absoluteFillObject,
          styles.mainLayout,
        ]}>
          {/* <CurrentRegion/>
          <Speed/> */}

          <ReportSection/>
        </View>

      </View>
    );
  }
}

export default MapScreen;
