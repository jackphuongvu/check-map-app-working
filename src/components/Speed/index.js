import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import TrackingSpeed from '../TrackingSpeed';
// import ReportSection from './ReportSection';

import styles from './styles';
import images from "../../config/images";

class Speed extends Component {
  render () {
    return (
      <View style={styles.speedContainer}>
        <TrackingSpeed speed={this.props.currentSpeed}
                       label='Tốc độ hiện tại'
                       ImageUrl={images.MapScreen.greenSpeed} />
        <TrackingSpeed speed={this.props.limitSpeed}
                       label='Tốc độ cho phép'
                       ImageUrl={images.MapScreen.redSpeed}
                       CustomStyle={{color :'#e64255'}} />
      </View>
    );
  }
}
export default Speed;