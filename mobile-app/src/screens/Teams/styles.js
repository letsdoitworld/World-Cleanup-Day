import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {
    backgroundColor: '$white',
    flex: 1
  },
  teamContainer: {
    paddingHorizontal: getWidthPercentage(10),
    paddingVertical: getHeightPercentage(10),
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: '$white',
  },
  nameContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: getWidthPercentage(60),
    paddingLeft: getWidthPercentage(10),
  },
  actionContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: getWidthPercentage(15),
    paddingLeft: getWidthPercentage(5),
    paddingRight: getWidthPercentage(10),
  },
  teamTitle: {
    fontFamily: '$boldFont',
    fontSize: 20,
    color: '$textTitleColor',
  },
  inputContainer: {
    marginTop: getHeightPercentage(20),
    marginBottom: getHeightPercentage(20),
    paddingHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getWidthPercentage(20),
    paddingVertical: getHeightPercentage(20),
  },
  teamIconContainer: {
    flex: 1,
    flexGrow: 1,
  },
  teamIconImage: {
    width: getWidthPercentage(40),
    height: getHeightPercentage(40),
    borderRadius: getWidthPercentage(20),
  },
  teamContentContainer: {
    flex: 4,
  },
  teamChevronContainer: {
    flex: 0.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  teamChevron: {
    height: getHeightPercentage(15),
    resizeMode: 'contain',
  },
  searchContainer: {
    backgroundColor: '$headerGrey',
    borderBottomWidth: 1,
    borderBottomColor: '$headerBorderBlack',
    height: getHeightPercentage(45),
    paddingHorizontal: getWidthPercentage(10),
    flexDirection: 'row'
  },
  searchInput: {
    height: getHeightPercentage(30),
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: getHeightPercentage(20),
    backgroundColor: '$white',
    flex: 5,
  },
  searchButton: {
    marginLeft: -30,
    flex: 1,
    height: getHeightPercentage(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getHeightPercentage(20),
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '$white',
  },
  defaultContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultTextHeader: {
    fontSize: 25,
    fontFamily: '$boldFont',
    paddingHorizontal: getWidthPercentage(20),
    paddingVertical: getHeightPercentage(20),
  },
  defaultTextDescription: {
    fontSize: 16,
    paddingHorizontal: getWidthPercentage(20),
  }
});
