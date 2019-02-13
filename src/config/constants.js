import images from './images';
import alerts from './alerts';
import { Dimensions } from 'react-native';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

export const messagesReportItems = [
  {
    type : 'police',
    backgroundColor : '',
    logoImage : images.MapScreen.police,
    message : {
      success : alerts.POLICE.sendReport.success,
      fail : alerts.POLICE.sendReport.fail
    }
  }
];

/** =========================================================================================== */
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export const RADIUS_GET_LOCATION = 2;
export const dropDrownConfig = {
  closeInterval : 5000, // 5s
  successColor : '#353a48',
  successImageSrc : images.Report.POLICE.success,
  errorImageSrc : images.Report.POLICE.fail
};

export class DropDownHolder {
  static dropDown;

  static setDropDown (dropDown) {
    this.dropDown = dropDown;
  }

  static getDropDown () {
    return this.dropDown;
  }
}