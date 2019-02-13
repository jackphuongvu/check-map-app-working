import React, { Component } from 'react';
import { View } from 'react-native';

import ReportButton from '../../../components/ReportButton';
import PoliceReportButton from '../../../containers/PoliceReportButton';
import images from "../../../config/images";
import styles from './styles';

class ReportSection extends Component {
  render() {
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <ReportButton ImageUrl={images.MapScreen.help}
                        label='Phát tín hiệu SOS'/>
          <PoliceReportButton ImageUrl={images.MapScreen.police}
                              label='Báo Trạm Công An'/>
        </View>
      </View>
    );
  }
}
export default ReportSection;