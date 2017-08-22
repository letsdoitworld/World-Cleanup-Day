import EStyleSheet from 'react-native-extended-stylesheet';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    marginTop: getHeightPercentage(50),
    width: getWidthPercentage(200),
    height: getHeightPercentage(162),
  },
  heading: {
    marginTop: getHeightPercentage(20),
    color: '$white',
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 'bold',
    width: getWidthPercentage(215),
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    width: '100%',
    marginTop: getHeightPercentage(77),
    alignItems: 'center',
  },
  button: {
    height: getHeightPercentage(35),
    width: getWidthPercentage(260),
  },
  buttonSeparator: {
    marginTop: getHeightPercentage(10),
  },
  skipLogoutContainer: {
    width: getWidthPercentage(210),
    marginTop: getHeightPercentage(10),
    marginBottom: getHeightPercentage(35)
  },
  skipLogout: {
    color: '$white',
    fontSize: 13,
    textDecorationLine: 'underline',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingHorizontal: getWidthPercentage(30)
  },
  $fbButtonColor: '$fbColor',
  $googleButtonColor: '$googleColor',
});
