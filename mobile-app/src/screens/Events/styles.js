import dimens from '../../config/dimens';

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
    paddingHorizontal: dimens.margin_small,
    margin: dimens.margin_small,
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
};
