import { StyleSheet } from 'react-native';

import { colors } from '../../themes';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.blue,
    borderRadius: 5,
    height: getHeightPercentage(35),
    width: getWidthPercentage(280),
    margin: getWidthPercentage(10),
  },
  textStyles: {
    fontSize: 17,
    color: colors.white,
    fontWeight: 'bold',
  },
});
