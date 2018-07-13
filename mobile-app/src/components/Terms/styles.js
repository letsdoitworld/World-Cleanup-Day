import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  termsView: {
    width: getWidthPercentage(320),
    height: getHeightPercentage(430),
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Lato-Bold',
    color: 'rgb(225, 18, 131)',
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Lato-Regular',
    fontSize: 13,
    marginBottom: 24,
  },
  listItem: {
    fontFamily: 'Lato-Regular',
    fontSize: 13,
    marginBottom: 3,
    marginLeft: 25,
  },
});
