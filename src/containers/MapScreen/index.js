import MapScreen from '../../screens/MapScreen';
import {connect} from 'react-redux';
import {setDropDown} from "../../actions/map";

const mapStateToProps = state => state.MapView;

const mapDispatchToProps = (dispatch) => {
  return {
    setDropDown : (dropDown) => {
      dispatch(setDropDown(dropDown));
    },
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MapScreen);