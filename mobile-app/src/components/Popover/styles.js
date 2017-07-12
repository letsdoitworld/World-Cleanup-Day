import EStyleSheet from 'react-native-extended-stylesheet';

import { SCREEN_WIDTH } from '../../shared/constants';
import { getHeightPercentage, isIOS } from '../../shared/helpers';

export default EStyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  tooltipMargin: {
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  tooltipContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  triangle_down: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderTopColor: '#F0F0F0',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  triangle_up: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderBottomColor: 'white',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  contentWrapper: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    borderRadius: '$radius10',
  },
  highlightedButtonStyles: {
    position: isIOS() ? 'absolute' : 'relative',
    left: SCREEN_WIDTH * 0.4 - 5,
    backgroundColor: '$blue',
    width: SCREEN_WIDTH / 5 + 10,
    height: getHeightPercentage(isIOS() ? 43 : 47),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});
