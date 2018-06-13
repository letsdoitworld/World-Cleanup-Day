import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1
  },
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
    height: getHeightPercentage(80),
    borderRadius: getWidthPercentage(40),
  },
  descriptionContainer: {
    backgroundColor: '$white',
    paddingHorizontal: getWidthPercentage(10),
    paddingVertical: getHeightPercentage(5),
  },
  bottomContainer: {
    height: getHeightPercentage(80),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  createButton: {
    alignSelf: 'center',
  },
  descriptionText: {
    paddingVertical: getWidthPercentage(10),
  },
  trashPointsContainer: {
    paddingHorizontal: getWidthPercentage(15),
    paddingVertical: getHeightPercentage(15),
    flexDirection: 'column'
  },
  trashPointsText: {
    fontFamily: '$boldFont',
    fontSize: 18,
  },
  circlesContainer: {
    height: getHeightPercentage(100),
    flexDirection: 'row',
  },
  circleContainer: {
    flex: 1,
    marginHorizontal: getWidthPercentage(5),
    marginVertical: getHeightPercentage(10),
    paddingTop: getHeightPercentage(10),
    alignItems: 'center'
  },
  circle: {
    borderRadius: getWidthPercentage(60),
    width: getWidthPercentage(50),
    height: getWidthPercentage(50),
    borderWidth: 1
  },
  circleTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleText: {
    fontFamily: '$boldFont',
    fontSize: 11,
  }
});
