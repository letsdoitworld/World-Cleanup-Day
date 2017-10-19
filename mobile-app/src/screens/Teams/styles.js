import EStyleSheet from 'react-native-extended-stylesheet';

import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {},
  teamContainer: {
    paddingHorizontal: getWidthPercentage(20),
    paddingVertical: getHeightPercentage(20),
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: '$white',
  },
  nameContainer: {
    paddingLeft: getWidthPercentage(20),
  },
  actionContainer: {
    paddingRight: getWidthPercentage(20),
  },
  teamTitle: {
    fontFamily: '$boldFont',
    fontSize: 20,
    color: '$textColor',
  },
  teamText: {
    fontFamily: '$font',
    fontSize: 20,
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
});
