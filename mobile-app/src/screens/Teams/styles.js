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
  deleteButtonWrapper: {
    position: 'absolute',
    top: 13,
    right: 10,
  },
  deleteButton: {
    width: 21,
    height: 21,
  },
  listDivider: {
    height: 1,
    backgroundColor: 'rgb(229, 229, 233)',
  },
  teamsListItem: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginHorizontal: 12,
  },
  upperText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 2,
  },
  lowerText: {
    color: 'grey',
    paddingTop: 2
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTeams: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center'
  }
};