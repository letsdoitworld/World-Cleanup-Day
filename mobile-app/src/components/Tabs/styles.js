import { StyleSheet, Dimensions } from 'react-native';

import { colors } from '../../themes';

export const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default StyleSheet.create({
  title: {
    fontSize: 17, alignSelf: 'center', paddingBottom: 18,
  },
  selectedTitle: {
    fontWeight: 'bold', color: colors.blue,
  },
  tabBar: {
    top: 0, height: 58,
  },
  tab: {
    marginTop: 51,
  },
  tabContainer: {
    marginBottom: -50,
  },
  tabBarShadow: {
    bottom: 0, top: null,
  },
});
