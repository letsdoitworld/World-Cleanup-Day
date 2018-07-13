import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';

import {
  getHeightPercentage,
  getWidthPercentage,
} from '../../../../shared/helpers';

import { dm } from '../../../../themes';

export default EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    marginTop: getHeightPercentage(40),
    height: getHeightPercentage(270),
    width: getWidthPercentage(270),
  },
  imageText: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: getHeightPercentage(237),
    fontSize: 22,
    color: 'rgb(0.17, 0.17, 0.17)',
    // fontFamily: '$boldFont',
  },
  header: {
    width: getWidthPercentage(148),
    height: getHeightPercentage(45),
    marginTop: getHeightPercentage(30),
    // fontFamily: '$boldFont',
    fontSize: 30,
    textAlign: 'center',
  },
  subHeader: {
    marginTop: getHeightPercentage(10),
    fontSize: 13,
  },
  button: {
    position: 'absolute',
    bottom: getHeightPercentage(20),
    left: getWidthPercentage(20),
    right: getWidthPercentage(20),
  },
  buttonText: {},
  confirmButton: {
    marginTop: 30,
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
});
