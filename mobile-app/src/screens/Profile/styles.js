import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

const styles = EStyleSheet.create({
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
  listContainer: {
    marginTop: 0,
  },
  separator: {
    marginTop: getHeightPercentage(20),
  },
  list: {
    backgroundColor: 'white',
  },
  listItem: {
    paddingTop: 13,
    paddingBottom: 13,
    borderWidth: 0,
  },
});
export default styles;
export const rightIcon = {
  name: 'chevron-right',
  type: 'entypo',
};
export const listItemProps = {
  containerStyle: {
    paddingTop: 13,
    paddingBottom: 13,
  },
  chevronColor: '#3E8EDE',
  titleStyle: {
    fontFamily: 'noto-sans-bold',
    fontSize: 20,
    color: '#3E8EDE',
  },
  avatarStyle: {
    backgroundColor: 'white',
    height: getHeightPercentage(60),
    width: getWidthPercentage(60),
    overflow: 'hidden',
  },
  avatarContainerStyle: {
    marginLeft: getWidthPercentage(20),
    marginTop: getHeightPercentage(20),
  },
  titleContainerStyle: {
    marginLeft: getWidthPercentage(50),
    marginTop: getHeightPercentage(5),
  },
  subtitleContainerStyle: {
    marginLeft: getWidthPercentage(50),
    minHeight: 50,
  },
  subtitleStyle: {
    fontFamily: 'noto-sans-regular',
    fontSize: 15,
    color: '#404040',
  },
  underlayColor: 'rgba(255,255,255,0.3)',
  rightIcon,
};