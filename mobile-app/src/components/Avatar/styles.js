import { StyleSheet } from 'react-native';

import { getWidthPercentage } from '../../shared/helpers';

export default StyleSheet.create({
  avatar: {
    width: getWidthPercentage(80),
    height: getWidthPercentage(80),
    borderRadius: getWidthPercentage(40),
  },
});
