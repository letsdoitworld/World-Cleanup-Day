import { StyleSheet } from 'react-native';

import { colors } from '../../../themes';

import { getWidthPercentage, getHeightPercentage } from '../../../shared/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(41, 127, 202, 0.6)',
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.$white,
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
    height: getHeightPercentage(39),
    width: getWidthPercentage(290),
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonsContainer: {
    backgroundColor: colors.$white,
    borderRadius: 12,
    width: getWidthPercentage(290),
    marginBottom: 10,
  },
  itemContainer: {
    alignItems: 'center',
    height: getHeightPercentage(39),
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Lato-Bold',
    fontSize: 20,
  },
});
