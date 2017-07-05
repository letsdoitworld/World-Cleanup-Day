import ESTyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default ESTyleSheet.create({
  image: {
    position: 'absolute',
    width: 28,
    height: 38
  },
  adressContainer: {
    position: 'absolute',
    top: getHeightPercentage(10),
    left: getWidthPercentage(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: getWidthPercentage(300),
    height: getHeightPercentage(40),
    backgroundColor: '$white',
    borderRadius: 2,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  addressLabel: {
    fontFamily: 'noto-sans-regular',
    fontSize: 13,
    color: '#2B2B2B',
  }
});