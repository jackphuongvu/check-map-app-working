import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

class CurrentRegion extends Component {
  render() {
    return (
      <View style={styles.CurrentRegionContainer}>
        <Text style={styles.currentCityLabel}>Vị trí hiện tại</Text>
        <Text style={styles.currentCity}>{this.props.currentCity}</Text>
        <Text style={styles.currentStreet}>{this.props.currentStreet}</Text>
      </View>
    );
  }
}
export default CurrentRegion;