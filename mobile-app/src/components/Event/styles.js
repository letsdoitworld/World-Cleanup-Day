import { StyleSheet } from 'react-native';

import { colors } from '../../themes';

import { getWidthPercentage } from '../../shared/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginTop: 3,
    backgroundColor: colors.white,
  },
  avatar: {
    width: getWidthPercentage(80),
    height: getWidthPercentage(80),
    borderRadius: getWidthPercentage(40),
  },
  participantsContainer: {
    backgroundColor: colors.yellow,
    padding: 5,
    alignItems: 'center',
    borderRadius: 20,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: colors.textColorDivider,
  },
  image: {
    marginRight: 10,
  },
  middleColumn: {
    justifyContent: 'space-between',
    flex: 2,
  },
  title: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontWeight: 'bold',
  },
  coordinatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinatorText: {
    flex: 1,
    fontSize: 12,
  },
  icon: {
    width: 25,
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 3,
  },
  rightColumn: {
    justifyContent: 'space-between',
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
