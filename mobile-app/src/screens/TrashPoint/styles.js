import { Dimensions } from 'react-native';

import { dm } from '../../themes';

const { width } = Dimensions.get('window');

export default {
  containerProgress: {
    flex: 1,
    justifyContent: 'center',
  },
  containerContent: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
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
  container: {
    backgroundColor: 'rgb(240, 240, 240)',
  },
  vertical: {
    flexDirection: 'column',
  },
  navigatorStyle: {
    tabBarHidden: true,
    navBarTitleTextCentered: true,
    navBarBackgroundColor: 'white',
    navBarTextColor: 'black',
    navBarTextFontSize: 17,
    navBarTextFontFamily: 'Lato-Bold',
    statusBarColor: 'white',
    statusBarTextColorScheme: 'dark',
  },
  searchField: {
    backgroundColor: 'white',
    flex: 1,
    height: 29,
    paddingVertical: 0,
    paddingHorizontal: dm.margin_small,
    margin: dm.margin_small,
    borderRadius: 5,
    fontFamily: 'Lato-Regular',
    color: 'rgb(40, 38, 51)',
    fontSize: 15,
    lineHeight: 21,
  },
  listDivider: {
    height: 1,
    backgroundColor: 'rgb(229, 229, 233)',
  },
  paginationFooter: {
    height: 86,
  },
  list: {
    flex: 1,
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    width: '100%',
    height: 30,
    backgroundColor: 'rgb(0, 143, 223)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    color: 'white',
  },
  map: {
    height: 198,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dm.margin_medium,
    height: 44,
    backgroundColor: 'white',
  },
  textLabel: {
    fontFamily: 'Lato-Regular',
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.4,
    textAlign: 'left',
    color: 'rgb(40, 38, 51)',
    marginLeft: 20,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dm.margin_medium,
    height: 44,
    backgroundColor: 'rgb(240, 240, 240)',
  },
  textHeader: {
    fontFamily: 'Lato-Bold',
    fontSize: 13,
    lineHeight: 14,
    letterSpacing: -0.1,
    textAlign: 'left',
    color: 'rgb(126, 124, 132)',
  },
  statusImage: {
    width: 24,
    height: 24,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  photo: {
    width,
    height: 235,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiper: {
    width,
    height: 235,
  },
  pageControlStyle: {
    marginVertical: dm.margin_medium,
  },
  dotStyle: {
    backgroundColor: 'rgb(40, 38, 51)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },
  activeDotStyle: {
    backgroundColor: 'rgb(63, 162, 247)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },
  paginationStyle: {
    bottom: 0,
  },
  confirmButton: {
    marginHorizontal: dm.margin_medium,
    marginVertical: dm.margin_medium,
    backgroundColor: 'rgb(0, 143, 223)',
    height: 44,
    flex: 1,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.4,
    color: 'white',
  },

};
