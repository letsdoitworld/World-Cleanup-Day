import { dm } from '../../themes';

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
    marginHorizontal: dm.margin_medium,
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
  deleteButton: {
    width: 21,
    height: 21,
  },
  deleteButtonContainer: {
    top: 13,
    right: 10,
    width: 21,
    height: 21,
  },
};
