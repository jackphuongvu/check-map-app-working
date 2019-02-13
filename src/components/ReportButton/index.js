import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

/**
 * Props:
 * - ImageUrl
 * - onPress
 * - label
 */
class ReportButton extends Component {
  render() {
    return (
      <TouchableOpacity style={[styles.buttonItem]}
                        onPress={this.props.onPress}
      >
        <View style={styles.buttonRowItems}>
          <View style={styles.buttonItemImage}>
            <Image source={this.props.ImageUrl}/>
          </View>
          <View style={styles.buttonItemTextContainer}><Text style={[styles.buttonText,styles.buttonItemText]}>{this.props.label}</Text></View>
        </View>
      </TouchableOpacity>
    );
  }
}
export default ReportButton;

ReportButton.propTypes = {
  onPress : PropTypes.func.isRequired,
  ImageUrl : PropTypes.any.isRequired,
  label : PropTypes.string.isRequired
};

ReportButton.defaultProps = {
  label : '',
  ImageUrl : 'http://cdn.akc.org/content/article-body-image/housetrain_adult_dog_hero.jpg',
  onPress : () => {}
};