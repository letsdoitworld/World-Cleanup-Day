import EStyleSheet from 'react-native-extended-stylesheet';
import { StatusBar } from 'react-native';

import {
  isAndroid,
  getHeightPercentage,
  getWidthPercentage,
} from '../../shared/helpers';

export default EStyleSheet.create({
  $heightSize45: getHeightPercentage(45),
  $widhtSize15: getWidthPercentage(15),
  container: {
    flexDirection: 'row',
    paddingTop: isAndroid() ? StatusBar.currentHeight : 15,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9'
  },
  leftButtonContainer: {
    flex: 1,
    height: '$heightSize45',
    paddingLeft: '$widhtSize15',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightButtonContainer: {
    flex: 1,
    height: '$heightSize45',
    paddingRight: '$widhtSize15',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  titleText: {
    fontFamily: '$boldFont',
    fontSize: '$fontDefaultSize',
    color: '$textColor',
  },
  buttonTextStyle: {
    textDecorationLine: 'none',
    fontSize: '$fontDefaultSize',
    fontFamily: '$boldFont',
    color: '#3E8EDE'
  },
});
