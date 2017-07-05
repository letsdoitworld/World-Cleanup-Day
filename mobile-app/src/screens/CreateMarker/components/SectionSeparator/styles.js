import { StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getWidthPercentage } from '../../../../shared/helpers';

export default EStyleSheet.create({
  firstLine: {
    width: getWidthPercentage(320),
    height: StyleSheet.hairlineWidth,
    color: '#d9d9d9',
  },
  secondLine: {
    width: getWidthPercentage(320),
    height: StyleSheet.hairlineWidth,
    color: '#f7f7f7',
  },
});
