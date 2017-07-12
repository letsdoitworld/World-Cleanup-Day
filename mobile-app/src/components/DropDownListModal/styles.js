import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  itemText: {
    textAlign: 'center',
    paddingVertical: getHeightPercentage(15)
  },
  $radius10: 10,
  modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: getHeightPercentage(20),
  },
  modalContent: {
    width: getWidthPercentage(280),
    height: getHeightPercentage(212),
    backgroundColor: '$white',
    borderRadius: '$radius10',
  },
  listWrapper: {
    flex: 0.8,
    alignSelf: 'stretch',
    backgroundColor: '#f6f6f6',
    borderRadius: '$radius10',
    paddingVertical: getHeightPercentage(8),
  },
  buttonWrapper: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: getHeightPercentage(20),
  },
});
