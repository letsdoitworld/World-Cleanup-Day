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
    width: getWidthPercentage(15),
  },
  $iconSize: 18,
  icon: {
    color: '#b3b3b3',
  },
  textContainer: {
    marginLeft: getWidthPercentage(10),
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
    marginLeft: getWidthPercentage(55),
    marginBottom: getHeightPercentage(20),
  },
  editLocation: {
    color: '#3e8ede',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  streetContainer: {
    fontFamily: 'noto-sans-bold',
    fontSize: 30,
    color: '#404040',
    marginTop: getHeightPercentage(15),
    marginLeft: getWidthPercentage(20),
  },
});
