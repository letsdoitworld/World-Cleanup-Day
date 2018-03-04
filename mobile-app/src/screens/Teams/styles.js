import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {
    backgroundColor: '$white',
  },
  teamContainer: {
    paddingHorizontal: getWidthPercentage(20),
    paddingVertical: getHeightPercentage(20),
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
    color: '$textColor',
  },
  teamText: {
    fontFamily: '$font',
    fontSize: 14,
    color: '$textColor',
  },
  teamJoinButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: '$radius10',
    borderBottomRightRadius: '$radius10',
    height: getHeightPercentage(35),
    color: '$white',
    backgroundColor: '#3e8ede',
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
});
