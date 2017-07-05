import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {
    marginTop: getHeightPercentage(20),
    width: getWidthPercentage(280),
  },
  containerImages: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getHeightPercentage(15),
  },
  completer: { flex: 0.125 },
  touchableChildContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.15,
    borderRadius: getHeightPercentage(5),
    position: 'relative',
  },
  barContainer: {
    height: getHeightPercentage(10),
    backgroundColor: '#4AA5FF',
    borderRadius: getHeightPercentage(5),
  },
  sliderButton: {
    position: 'absolute',
    width: getWidthPercentage(22),
    height: getWidthPercentage(22),
    borderRadius: getWidthPercentage(11),
    backgroundColor: '#FFFFFF',
    top: getHeightPercentage(-5.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  insideSliderButton: {
    backgroundColor: '#4AA5FF',
    width: getWidthPercentage(11),
    height: getWidthPercentage(11),
    borderRadius: getWidthPercentage(5.5),
  },
});
