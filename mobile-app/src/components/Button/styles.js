import { Dimensions, StyleSheet } from 'react-native';

import { colors } from '../../themes';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';
import dimens from '../../config/dimens';

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
  confirmButton: {
    width: Dimensions.get('window').width - dimens.margin_medium * 2 - 40,
    flex: 1,
    marginTop: dimens.margin_small,
    marginBottom: dimens.margin_small,
    backgroundColor: 'rgb(0, 143, 223)',
    height: 44,
    justifyContent: 'center',
    borderRadius: 4,
  },
  confirmButtonText: {
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    lineHeight: 21,
  },
});
