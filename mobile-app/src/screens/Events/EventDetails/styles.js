import { StyleSheet, Dimensions } from 'react-native';

import { colors, dm } from '../../../themes';

import { getWidthPercentage, getHeightPercentage } from '../../../shared/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  contentContainer: {
    backgroundColor: colors.gray100,
  },
  nameContainer: {
    height: getHeightPercentage(35),
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: dm.margin_medium,
  },
  name: {
    flexWrap: 'wrap',
    fontSize: 17,
    color: colors.black,
    fontFamily: 'Lato-Bold',
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    
  },
  button: {
    width: '90%',
    marginVertical: dm.margin_medium,
    alignSelf: 'center',
  },
  title: {
    flexWrap: 'wrap',
    fontSize: 13,
    color: colors.textColorDivider,
    fontFamily: 'Lato-Bold',
    paddingVertical: dm.margin_medium,
    paddingHorizontal: dm.margin_medium,
  },
  dateContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: dm.margin_medium,
    paddingHorizontal: dm.margin_medium,
  },
  timeContainer: {
    paddingHorizontal: dm.margin_medium,
  },
  timeText: {
    fontSize: 17,
    fontFamily: 'Lato',
  },
  calendarText: {
    fontSize: 12,
    fontFamily: 'Lato',
    color: colors.grey,
  },
  locationContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: dm.margin_medium,
    paddingHorizontal: dm.margin_medium,
  },
  locationText: {
    fontSize: 17,
    fontFamily: 'Lato',
    paddingHorizontal: dm.margin_medium,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: 'grey',
    height: getHeightPercentage(120),
  },
  trashpointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: dm.margin_medium,
    paddingHorizontal: dm.margin_medium,
  },
  circleContainer: {
    position: 'relative',
    backgroundColor: colors.accentPink,
    height: 29,
    width: 29,
    borderRadius: dm.margin_small * 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: dm.margin_medium,
  },
  circleText: {
    fontSize: 17,
    color: colors.white,
    fontFamily: 'Lato-Bold',
  },
  readMoreContainer: {
    backgroundColor: colors.white,
    paddingVertical: dm.margin_medium,
    paddingHorizontal: dm.margin_medium,
  },
});
