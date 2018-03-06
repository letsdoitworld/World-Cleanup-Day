import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {},
  infoContainer: {
    paddingHorizontal: getWidthPercentage(20),
    paddingVertical: getHeightPercentage(20),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '$yellow',
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
    // fontFamily: '$font',
    fontSize: '$fontDefaultSize',
    color: '#7F7F7F',
    marginLeft: getWidthPercentage(5),
  },
  userNameContainer: {
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 15,
    paddingVertical: 8,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  additionalInfoText: {
    fontSize: 15,
    paddingHorizontal: 12,
  }
});
