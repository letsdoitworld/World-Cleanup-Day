import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage, getHeightPercentage } from '../../../../shared/helpers';

export default EStyleSheet.create({
  container: {
    paddingHorizontal: getWidthPercentage(20),
    paddingTop: getHeightPercentage(20),
  },
  title: {
    // fontFamily: '$font',
    fontSize: '$fontDefaultSize',
    color: '$textColor',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    paddingBottom: getHeightPercentage(5),
  },
  optionText: {
    fontFamily: '$boldFont',
    fontSize: '$fontDefaultSize',
    color: '$textColor',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
