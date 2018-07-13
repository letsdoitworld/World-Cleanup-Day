import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  privacyView: {
    width: getWidthPercentage(320),
    height: getHeightPercentage(430),
    backgroundColor: 'transparent',
  },
});
