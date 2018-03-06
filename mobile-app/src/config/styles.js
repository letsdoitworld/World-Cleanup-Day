import EStyleSheet from 'react-native-extended-stylesheet';
import {Platform, StatusBar} from 'react-native';

import {ICON_COLOR, WHITE_COLOR, STATUS_BAR_HEIGHT} from '../shared/constants';

const colors = {
    $fbColor: '#43619c',
    $googleColor: '#f24033',
    $grey: '#eeeeee',
    $blue: '#3683d9',
    $red: '#FC515E',
    $yellow: 'rgb(255, 216, 0)',
    $iconColor: ICON_COLOR,
    $white: WHITE_COLOR,
    $textColor: 'rgb(40, 38, 51)',
    $textColorDivider: 'rgb(126, 124, 132)',
    $mainBackground: 'rgb(240, 240, 240)',
    $textColorSettings: 'rgb(40, 38, 51)',
    $accentPink: 'rgb(225, 18,131)',
    $toggleOffColor: 'rgb(228, 241, 253)',
    $toggleOnColor: '#ffd800',
    $transparentColor: 'rgba(0, 0, 0, 0)',
    $black: 'rgb(40, 38, 51)',
    $blackTransparent: 'rgba(40, 38, 51, 0.5)',
    $dividerColor: 'rgba(229, 229, 233, 0.5)',
    $deepGreyTransparent: 'rgba(200, 199, 204, 0.5)',
    $mainBlue: 'rgb(0, 143, 223)',
    $transparentBlueColor: 'rgb(228, 241, 253)',
    $buttonDisableColor: 'rgb(126, 124, 132)'
};
const dimensions = {
    $radius10: 10,
    $statusBarHeight: STATUS_BAR_HEIGHT,
    $fontDefaultSize: 13
};

const textVariables = {
  // $font: 'noto-sans-regular',
  // $boldFont: 'noto-sans-bold',
};

EStyleSheet.build({
    ...colors,
    ...dimensions,
    ...textVariables,
    outline: 0,
});
