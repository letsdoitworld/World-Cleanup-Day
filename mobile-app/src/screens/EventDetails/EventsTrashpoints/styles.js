import { StyleSheet } from 'react-native';

import { colors, dm } from '../../../themes';

import { getWidthPercentage } from '../../../shared/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: dm.margin_large,
    backgroundColor: colors.gray100,
  },
  trashpointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderColor: colors.gray100,
    paddingHorizontal: getWidthPercentage(15),
  },
});
