import { StyleSheet, Dimensions } from 'react-native';

import { colors } from '../../themes';

import { getHeightPercentage } from '../../shared/helpers';

export const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    padding: getHeightPercentage(5),
  },
  labelFocused: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  label: {
    color: colors.black,
  },
  tabBarContainer: {
    backgroundColor: 'white',
  },
  textIndicator: {
    backgroundColor: colors.blue,
    height: 5,
  },
});
