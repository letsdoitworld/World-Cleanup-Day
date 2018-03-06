import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  $textColor: '#404040',
  emptyStateContainer: {
    paddingHorizontal: getWidthPercentage(40),
    paddingTop: getHeightPercentage(20),
    backgroundColor: '$white',
    flex: 1,
  },
  emptyStateImage: {
    marginBottom: getHeightPercentage(20),
    width: getWidthPercentage(240),
  },
  emptyStateTitle: {
    // fontFamily: '$boldFont',
    fontSize: 20,
    color: '$textColor',
    textAlign: 'center',
  },
  emptyStateDescription: {
    marginTop: getHeightPercentage(10),
    // fontFamily: '$font',
    fontSize: '$fontDefaultSize',
    color: '$textColor',
    textAlign: 'center',
  },
});
