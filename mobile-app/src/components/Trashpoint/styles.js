import { StyleSheet } from 'react-native';

import { colors } from '../../themes';

import { getWidthPercentage } from '../../shared/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getWidthPercentage(15),
    marginTop: 3,
    backgroundColor: colors.white,
  },
  image: {
    marginRight: 10,
  },
  iconContainer: {
    marginRight: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Lato',
  },
});
