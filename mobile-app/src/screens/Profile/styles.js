import { StyleSheet, Dimensions } from 'react-native';

import { colors } from '../../themes';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    paddingHorizontal: getWidthPercentage(10),
    paddingVertical: getHeightPercentage(10),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellow,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    paddingLeft: getWidthPercentage(20),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getHeightPercentage(5),
  },
  countryText: {
    fontSize: 15,
    color: '#7F7F7F',
    marginLeft: getWidthPercentage(5),
  },
  userNameContainer: {
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 15,
    paddingVertical: 5,
    fontWeight: 'bold',
  },
  logoutContainer: {
    marginTop: getHeightPercentage(20),
    alignItems: 'center',
  },
  locationText: {
    fontSize: 15,
    paddingHorizontal: 4,
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    paddingVertical: getHeightPercentage(10),
    paddingHorizontal: getHeightPercentage(10),
  },
  additionalInfoText: {
    fontSize: 15,
    paddingHorizontal: 12,
  },
  tabContent: {
    flex: 1,
    backgroundColor: colors.gray200,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.yellow,
  },
  imgPlaceholder: {
    width: Dimensions.get('window').width * 0.9,
    height: 300,
    backgroundColor: colors.gray200,
    marginHorizontal: getHeightPercentage(20),
  },
  trashpointContainer: {
    paddingHorizontal: getWidthPercentage(15),
    backgroundColor: colors.white,
    borderTopWidth: 2,
    borderColor: colors.gray200,
  },
  arrow: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 15,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getHeightPercentage(10),
    paddingHorizontal: getHeightPercentage(10),
  }
});
