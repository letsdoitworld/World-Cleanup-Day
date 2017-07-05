import EStylesheet from 'react-native-extended-stylesheet';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../shared/constants';
import { getHeightPercentage } from '../../shared/helpers';

export default EStylesheet.create({
  containerPopover: {
    width: SCREEN_WIDTH * 9 / 10,
    height: SCREEN_HEIGHT * 2.8 / 10,
    backgroundColor: 'white',
    borderRadius: '$radius10',
  },
  containerAddPileButton: {
    backgroundColor: '$blue',
    bottom: 0,
    width: SCREEN_WIDTH / 5,
    height: getHeightPercentage(45),
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapperPopover: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
  },
  titlePopover: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
    fontFamily: '$boldFont',
  },
  descriptionPopover: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: '$font',
  },
  buttonPopover: {
    backgroundColor: '#F0F0F0',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomLeftRadius: '$radius10',
    borderBottomRightRadius: '$radius10',
  },
});
