import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {},
  infoContainer: {
    paddingHorizontal: getWidthPercentage(20),
    paddingVertical: getHeightPercentage(20),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '$white',
  },
  pictureContainer: {},
  nameContainer: {
    paddingLeft: getWidthPercentage(20),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getHeightPercentage(5),
  },
  countryText: {
    fontFamily: '$font',
    fontSize: '$fontDefaultSize',
    color: '#7F7F7F',
    marginLeft: getWidthPercentage(5),
  },
  username: {
    fontFamily: '$boldFont',
    fontSize: 20,
    color: '$textColor',
    paddingRight: 20,
    width: getWidthPercentage(165),
  },
  usernameImage: {
    width: getWidthPercentage(80),
    height: getWidthPercentage(80),
    borderRadius: getWidthPercentage(40),
  },
  logoutContainer: {
    marginTop: getHeightPercentage(20),
    alignItems: 'center',
  },
  teamContainer: {
    paddingHorizontal: getWidthPercentage(20),
    paddingVertical: getHeightPercentage(20),
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '$white',
  },
  teamTitle: {
    fontFamily: '$boldFont',
    fontSize: 20,
    color: '$textColor',
    paddingRight: 20,
    width: getWidthPercentage(165),
  },
  teamText: {
    fontFamily: '$font',
    fontSize: 20,
    color: '$textColor',
    paddingRight: 20,
    textAlign: 'left',
    width: getWidthPercentage(165),
  },
  teamNameContainer: {
    paddingHorizontal: getWidthPercentage(20),
    paddingVertical: getHeightPercentage(20),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
