import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {
    paddingTop:20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  flexContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems:'center',
  },
  aboutText: {
    paddingLeft:30,
    paddingRight:30,
    textAlign: 'center',
  },
  imgLdiLogo: {
    height: getHeightPercentage(125),
    width: getWidthPercentage(125),
  },
  imgWcdLogo: {
    height: getHeightPercentage(125),
    width: getWidthPercentage(125),
  },
  imgQualitanceLogo: {
    marginRight: 20,
    height: getHeightPercentage(125),
    width: getWidthPercentage(125),
  },
  imgDuxLogo: {
    marginLeft: 20,
    height: getHeightPercentage(50),
    width: getWidthPercentage(50),
  },
});
