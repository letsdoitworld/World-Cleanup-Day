import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  avatar: {
    width: getWidthPercentage(80),
    height: getWidthPercentage(80),
    borderRadius: getWidthPercentage(40),
  },
});
