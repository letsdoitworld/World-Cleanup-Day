import EStyleSheet from 'react-native-extended-stylesheet';
import { Platform, StatusBar } from 'react-native';

import { ICON_COLOR, WHITE_COLOR, STATUS_BAR_HEIGHT } from '../shared/constants';

const colors = {
  $fbColor: '#43619c',
  $googleColor: '#f24033',
  $grey: '#eeeeee',
  $blue: '#3683d9',
  $red: '#FC515E',
  $iconColor: ICON_COLOR,
  $white: WHITE_COLOR,
  $textColor:'#2B2B2B',
};
const dimensions = {
  $radius10: 10,
  $statusBarHeight: STATUS_BAR_HEIGHT,
  $fontDefaultSize: 13
};

const textVariables = {
  $font: 'noto-sans-regular',
  $boldFont: 'noto-sans-bold',
};

EStyleSheet.build({
  ...colors,
  ...dimensions,
  ...textVariables,
  outline: 0,
});
