import { Dimensions } from 'react-native';
import { dm } from '../../themes';

export default {
  container: {
    flex: 1,
  },
  map: {
    marginTop: 44,
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
  confirmButton: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width - dm.margin_medium * 2,
    marginHorizontal: dm.margin_medium,
    marginBottom: dm.margin_medium,
    backgroundColor: 'rgb(0, 143, 223)',
    height: 44,
    justifyContent: 'center',
    borderRadius: 4,
  },
  confirmButtonText: {
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    lineHeight: 21,
  },
  searchTextInput: {
    width: '100%',
    height: 29,
    marginHorizontal: dm.margin_small,
    lineHeight: 21,
    fontSize: 15,
    color: 'rgb(40, 38, 51)',
    alignContent: 'center',
  },
  searchTextInputContainer: {
    width: '100%',
    height: 44,
    backgroundColor: 'rgb(228, 241, 253)',
  },
  searchDescription: {
    fontWeight: 'bold',
  },
  searchListView: {
    backgroundColor: 'white',
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
};
