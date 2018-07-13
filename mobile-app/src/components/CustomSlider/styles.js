import { Dimensions } from 'react-native';
import { getWidthPercentage } from '../../shared/helpers';
import { colors } from '../../themes';

const { width } = Dimensions.get('window');

export default {
  blueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.blueDot,
    position: 'absolute',
    top: 15,
    zIndex: 10,
    left: getWidthPercentage(87),
  },
  blueDot2: {
    width: 10,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.blueDot,
    position: 'absolute',
    top: 15,
    zIndex: 10,
    left: getWidthPercentage(169),
  },
  blueDot3: {
    width: 10,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.blueDot,
    position: 'absolute',
    top: 15,
    zIndex: 10,
    left: getWidthPercentage(250),
  },
  sliderStyle: {
    top: 50,
  },
  thumbStyle: {
    height: 22.5,
    width: 22.5,
    borderRadius: 22.5,
    borderColor: colors.white,
    borderWidth: 22.5 - 16.875,
    backgroundColor: colors.blueDot,
  },
  trackStyle: {
    height: 10.125,
    backgroundColor: colors.trackColor,
    borderRadius: 10.125,
  },
  mainContainer: {
    backgroundColor: '#eeeeee',
    height: 110,
    flexDirection: 'column',
    width,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  gradationTextStyle: {
    position: 'absolute',
    top: 40,
    flexDirection: 'column',
    alignItems: 'center',
  },
  gradationImageStyle: {
    width: 65,
    position: 'absolute',
    top: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
};
