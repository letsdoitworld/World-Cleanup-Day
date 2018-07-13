import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';
import { colors } from '../../themes';

export default {
  image: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    marginTop: 50,
    width: 139,
    height: 95,
  },
  heading: {
    marginTop: 24,
    color: colors.$black,
    textAlign: 'center',
    fontSize: 26,
    lineHeight: 28,
    fontFamily: 'ChauPhilomeneOne-Regular',
    fontWeight: 'bold',
    width: getWidthPercentage(215),
    height: getWidthPercentage(64),
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 50,
    alignItems: 'center',
  },
  button: {
    height: getHeightPercentage(43),
    width: getWidthPercentage(290),
  },
  buttonSeparator: {
    marginTop: getHeightPercentage(10),
  },
  skipLogoutContainer: {
    width: getWidthPercentage(210),
    marginTop: getHeightPercentage(30),
    marginBottom: getHeightPercentage(35),
  },
  skipLogout: {
    color: colors.black,
    fontSize: 13,
    textDecorationLine: 'underline',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    paddingBottom: 12,
  },
  linksContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingHorizontal: getWidthPercentage(30),
    marginTop: getHeightPercentage(44),
  },
  skipButton: {
    backgroundColor: colors.$mainBlue,
    flexDirection: 'row',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
    height: getHeightPercentage(43),
    width: getWidthPercentage(290),
  },
  text: {
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color: colors.$white,
  },
  orContainer: {
    flexDirection: 'row',
    width: getWidthPercentage(290),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  line: {
    width: 108,
    height: 2,
  },
  orText: {
    color: colors.black,
    fontFamily: 'ChauPhilomeneOne-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  $fbButtonColor: colors.fbColor,
  $googleButtonColor: colors.googleColor,
};

