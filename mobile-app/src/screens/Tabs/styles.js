import EStylesheet from 'react-native-extended-stylesheet';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../shared/constants';
import {
  getHeightPercentage,
  isIOS,
  getWidthPercentage,
} from '../../shared/helpers';

export default EStylesheet.create({
  $widthSize20: getWidthPercentage(20),
  containerPopover: {
    width: SCREEN_WIDTH * 9 / 10,
    backgroundColor: 'white',
    borderRadius: '$radius10',
  },
  containerAddPileButton: {
    backgroundColor: '$blue',
    bottom: 0,
    width: SCREEN_WIDTH / 5,
    height: getHeightPercentage(isIOS() ? 45 : 40),
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapperPopover: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: getHeightPercentage(20),
    paddingHorizontal: '$widthSize20',
    flex: 1,
  },
  titlePopover: {
    fontSize: 16,
    marginBottom: getHeightPercentage(10),
    fontFamily: '$boldFont',
    textAlign: 'center',
    marginHorizontal: '$widthSize20',
  },
  descriptionPopover: {
    fontSize: 13,
    fontFamily: 'noto-sans-regular',
    textAlign: 'center',
    marginHorizontal: '$widthSize20',
  },
  buttonPopover: {
    backgroundColor: '#F0F0F0',
    paddingVertical:getHeightPercentage(15),
    borderBottomLeftRadius: '$radius10',
    borderBottomRightRadius: '$radius10',
  },
  imageContainer:{
    width: SCREEN_WIDTH * 9 / 10,
    height: getHeightPercentage(134)
  },
  popoverImageStyles:{
    flex:1,
    width:undefined,
    height:undefined
  }
});
