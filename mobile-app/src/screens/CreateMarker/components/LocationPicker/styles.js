import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../../../shared/helpers';

export default EStyleSheet.create({
  container: {
    backgroundColor: 'white',
    // height: getHeightPercentage(245),
  },
  $mapContainerHeight: getHeightPercentage(160),
  map: {
    height: 198,
    flex: 1,
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
    // fontFamily: 'noto-sans-regular',
    fontSize: 13,
  },
  editLocationContainer: {

  },
  editLocation: {
    textAlign: 'left',
    color: 'rgb(0, 143, 223)',
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.4,
    marginLeft: 20,
  },
  address: {
    // // fontFamily: '$boldFont',
    // fontSize: 30,
    // color: '#404040',
    // paddingHorizontal: getWidthPercentage(15),
    // marginTop: getHeightPercentage(15),
    // width: getWidthPercentage(280),

    textAlign: 'left',
    color: 'rgb(40, 38, 51)',
    fontFamily: 'Lato-Regular',
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.4,
    marginLeft: 20,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: getHeightPercentage(46),
    marginHorizontal: 16,
  },
});
