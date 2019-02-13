import { connect } from 'react-redux';

import Speed from '../../components/Speed';

const mapStateToProps = state => ({
  currentSpeed : state.MapView.currentSpeed,
  limitStreet : state.MapView.limitStreet,
});

export default connect(mapStateToProps)(Speed);