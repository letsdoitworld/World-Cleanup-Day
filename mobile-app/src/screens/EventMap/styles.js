
import { Dimensions } from 'react-native';
import { colors } from '../../themes';
import { getWidthPercentage } from '../../shared/helpers';

const widthScreen = Dimensions.get('window').width;

export default {

  containerProgress: {
    flex: 1,
    justifyContent: 'center',
  },
  containerContent: {
    flex: 1,
    backgroundColor: colors.$mainBackground,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  searchContainerStyle: {
    backgroundColor: 'rgb(228, 241, 253)',
  },
  mainContentContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  vertical: {
    flexDirection: 'column',
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  navigatorStyle: {
    tabBarHidden: true,
    navBarTitleTextCentered: true,
    navBarBackgroundColor: 'white',
    navBarTextColor: '$textColor',
    navBarTextFontSize: 17,
    navBarTextFontFamily: 'Lato-Bold',
    statusBarColor: 'white',
    statusBarTextColorScheme: 'dark',
  },
  trashPointItem: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonStyle: {
    position: 'absolute',
    left: 0,
    width: '6%',
  },
  horizontalListStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    overflow: 'hidden',
  },
  list: {
    position: 'absolute',
    bottom: 0,
  },
  listContainer: {
    marginBottom: getWidthPercentage(6),
    backgroundColor: 'transparent',
  },
  containerMapElement: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginTop: 3,
    marginLeft: getWidthPercentage(6),
    width: getWidthPercentage(240),
    backgroundColor: colors.white,
  },
  containerFirstMapElement: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginTop: 3,
    marginLeft: getWidthPercentage(30),
    width: getWidthPercentage(240),
    backgroundColor: colors.white,
  },
  emptyStyle: {
    marginLeft: getWidthPercentage(30),
  },
  eventContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    width: widthScreen - 37 * 2,
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  eventImage: {
    marginRight: 10,
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  searchButtonContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 22,
    width: 138,
    height: 34,
    top: 12,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  currentLocationStyle: {
    top: 12,
  },
};
