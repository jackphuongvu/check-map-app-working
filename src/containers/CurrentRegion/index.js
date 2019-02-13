import CurrentRegion from '../../components/CurrentRegion';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  currentCity : state.MapView.currentCity,
  currentStreet : state.MapView.currentStreet,
});

export default connect(mapStateToProps)(CurrentRegion);