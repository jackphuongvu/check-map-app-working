import { connect } from 'react-redux';

import ReportButton from '../../components/ReportButton';
import { sendMarkers } from '../../actions/policeReport';

const mapStateToProps = state => state;

const mapDispatchToProps = (dispatch) => {
  return {
    onPress : () => {
      dispatch(sendMarkers('police'));
    },
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(ReportButton);