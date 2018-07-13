import { getWidthPercentage } from '../../../shared/helpers';

export default {
  containerProgress: {
    flex: 1,
    justifyContent: 'center',
  },
  containerContent: {
    flex: 1,
    justifyContent: 'center',
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
  emptyView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emptyImage: {
    marginTop: getWidthPercentage(70),
    width: 246,
    height: 246,
  },
  text: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Lato-Bold',
    color: 'rgb(40, 38, 51)',
  },
  textGrey: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Lato-Bold',
    color: 'rgb(123, 125, 128)',
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
