import EStyleSheet from 'react-native-extended-stylesheet';

import {
  getHeightPercentage,
  getWidthPercentage,
} from '../../../../shared/helpers';

export default EStyleSheet.create({
  container: {
    backgroundColor: 'white',
    // height: getHeightPercentage(245),
  },
  $mapContainerHeight: getHeightPercentage(160),
  mapContainer: {
    backgroundColor: 'grey',
    width: getWidthPercentage(320),
    height: '$mapContainerHeight',
  },
  bottomContainer: {
    marginTop: getHeightPercentage(15),
    flexDirection: 'row',
  },
  iconContainer: {
    marginLeft: getWidthPercentage(20),
  },
  $iconSize: 18,
  icon: {
    color: '#b3b3b3',
  },
  textContainer: {
    width: getWidthPercentage(280),
  },
  text: {
    marginLeft: getWidthPercentage(10),
    marginRight: getWidthPercentage(35),
    color: '#7F7F7F',
    fontFamily: 'noto-sans-regular',
    fontSize: 13,
  },
  editLocationContainer: {
    marginTop: getHeightPercentage(5),
    marginLeft: getWidthPercentage(40),
    marginBottom: getHeightPercentage(20),
  },
  editLocation: {
    color: '#3e8ede',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  streetContainer: {
    fontFamily: '$boldFont',
    fontSize: 30,
    color: '#404040',
    paddingHorizontal: getWidthPercentage(15),
    marginTop: getHeightPercentage(15),
    width: getWidthPercentage(280),
  },
});
