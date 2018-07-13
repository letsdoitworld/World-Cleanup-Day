import { Dimensions } from 'react-native';
import { dm } from '../../themes';

const { width } = Dimensions.get('window');

export default {
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  searchContainerStyle: {
    backgroundColor: 'rgb(228, 241, 253)',
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
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerContent: {
    flex: 1,
    justifyContent: 'center',
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
  carousel: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flex: 1,
    height: 82,
    width,
  },
  searchButtonContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 22,
    width: 138,
    height: 34,
    top: '10%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
