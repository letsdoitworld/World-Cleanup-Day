import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: getHeightPercentage(15),
  },
  image: {
    flex: -1,
  },
  text: {
    flex: 1,
    // fontFamily: '$boldFont',
    fontSize: '$fontDefaultSize',
    paddingLeft: getWidthPercentage(4),
  },
});
