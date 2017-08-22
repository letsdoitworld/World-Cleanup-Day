import EStyleSheet from 'react-native-extended-stylesheet';
import { Platform } from 'react-native';
import { getHeightPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  emptyStateScreenContainer: {
    height: Platform.select({
      android: getHeightPercentage(461),
      ios: getHeightPercentage(471),
    }),
    paddingBottom: getHeightPercentage(10),
    backgroundColor: '$white',
    alignItems: 'center',
  },
  emptyStateScreenText: {
    fontSize: 15,
    fontFamily: '$boldFont',
    color: '#B3B3B3',
    marginBottom: getHeightPercentage(10),
  },
  emptyStateScreenImageContainer: {
    alignItems: 'center',
  },
});
