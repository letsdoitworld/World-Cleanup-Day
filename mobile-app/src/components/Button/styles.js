import { Dimensions, StyleSheet } from 'react-native';

import { colors, dm } from '../../themes';

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
  confirmButton: {
    width: Dimensions.get('window').width - dm.margin_medium * 2 - 40,
    flex: 1,
    marginTop: dm.margin_small,
    marginBottom: dm.margin_small,
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
  alertButton: {
    width: Dimensions.get('window').width - dm.margin_medium * 2 - 43,
    flex: 1,
    marginRight: 2,
    marginLeft: 2,
    marginTop: dm.margin_small,
    marginBottom: dm.margin_small + 1,
    backgroundColor: 'rgba(0, 143, 223, 0.1)',
    height: 44,
    justifyContent: 'center',
    borderRadius: 4,
  },
  alertButtonText: {
    alignSelf: 'center',
    color: 'rgb(0, 143, 223)',
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    lineHeight: 24,
  },
  searchButton: {
    borderRadius: 22,
    width: 138,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  searchButtonText: {
    fontFamily: 'Lato-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    lineHeight: 24,
    color: 'rgb(0, 143, 223)',
  },
});
