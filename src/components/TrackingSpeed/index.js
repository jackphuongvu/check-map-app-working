import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

class TrackingSpeed extends Component {
  render() {
    return (
      <View style={styles.speedContainerColumn}>
        <Image source={this.props.ImageUrl} />
        <Text style={[styles.speedMeter, this.props.CustomStyle]}>
          <Text style={styles.speedCount}>{this.props.speed}</Text>
          <Text>  KM/H</Text>
        </Text>
        <Text style={styles.speedLabel}>{this.props.label}</Text>
      </View>
    );
  };
}

TrackingSpeed.propTypes = {
  // ImageUrl : PropTypes.any.isRequired,
  speed : PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  label : PropTypes.string.isRequired,
  CustomStyle : PropTypes.object
};

TrackingSpeed.defaultProps = {
  speed : 0
};

export default TrackingSpeed;