import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../../../shared/helpers';

export default EStyleSheet.create({
  container: {
    height: getHeightPercentage(218),
    width: getWidthPercentage(320),
    backgroundColor: '$grey',
  },
  header: {
    marginLeft: getWidthPercentage(20),
    marginTop: getHeightPercentage(21),
    fontSize: 16,
    color: 'rgba(43, 43, 43, 0.98)',
    fontFamily: '$boldFont',
  },
  subHeader: {
    marginTop: getHeightPercentage(5),
    marginLeft: getWidthPercentage(20),
    marginRight: getWidthPercentage(30),
    fontFamily: '$font',
    color: 'rgba(43, 43, 43, 0.98)',
  },
  optionsContainer: {
    marginTop: getHeightPercentage(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  option: {
    flex: -1,
    marginLeft: getWidthPercentage(7),
    marginRight: getWidthPercentage(7),
    alignItems: 'center',
  },
  image: {
    width: getWidthPercentage(60),
    height: getHeightPercentage(60),
  },
  selectedImage: {
    width: getWidthPercentage(63),
    height: getHeightPercentage(63),
  },
  imageText: {
    marginTop: getHeightPercentage(15),
    fontSize: 10,
    fontFamily: '$boldFont',
    textAlign: 'center',
  },
});
