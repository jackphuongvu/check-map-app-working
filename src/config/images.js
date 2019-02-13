const IMAGE_PATH = '../assets/images/';
const images = {
  MapScreen : {
    car : require( IMAGE_PATH + 'MapScreen/car.png'),
    greenSpeed : require(IMAGE_PATH + 'MapScreen/green-speed.png'),
    redSpeed : require(IMAGE_PATH + 'MapScreen/red-one.png'),
    help : require(IMAGE_PATH + 'MapScreen/help-button.png'),
    police : require(IMAGE_PATH + 'MapScreen/police-button.png'),
    radio : require(IMAGE_PATH + 'MapScreen/radio-button.png'),
    trafficLight : require(IMAGE_PATH + 'MapScreen/traffic-light-button.png'),
  },
  Report : {
    POLICE : {
      success : require(IMAGE_PATH + 'ReportScreen/police-success.png'),
      fail : ''
    },
  },

};
export default images;