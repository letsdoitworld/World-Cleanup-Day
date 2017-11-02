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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '$white',
    flexWrap: 'wrap',
  },
  teamIconContainer: {
    width: '20%',
    flexGrow: 1,
  },
  teamIconImage: {
    width: getWidthPercentage(40),
    height: getWidthPercentage(40),
  },
  teamContentContainer: {
    flexGrow: 1,
    width: '70%',

  },
  teamTitleContainer: {
  },
  teamTitle: {
    fontFamily: '$boldFont',
    fontSize: 20,
    color: '#3E8EDE',
    paddingRight: 20,
  },
  teamNameContainer: {
  },
  teamName: {
    fontFamily: '$font',
    fontSize: 15,
    color: '#404040',
    paddingRight: 20,
  },
  teamChevronContainer: {
    width: '10%',
    alignItems: 'flex-end',
    height: '100%',
    paddingTop: 10,
  },
  teamChevron: {
    height: getHeightPercentage(15),
  },
});