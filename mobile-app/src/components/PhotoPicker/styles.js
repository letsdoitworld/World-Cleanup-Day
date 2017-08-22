import EStyleSheet from 'react-native-extended-stylesheet';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {
    height: getHeightPercentage(208),
    width: getWidthPercentage(320),
    backgroundColor: '$grey',
  },
  title: {
    marginTop: getHeightPercentage(20),
    marginLeft: getWidthPercentage(20),
    fontFamily: 'noto-sans-bold',
    fontSize: 16,
    color: '$textColor',
  },
  photoContainer: {
    flexDirection: 'row',
    marginTop: getHeightPercentage(10),
    marginLeft: getWidthPercentage(5),
  },
  photoPlaceholder: {
    backgroundColor: '#d8d8d8',
  },
  photo: {
    marginLeft: getWidthPercentage(10),
    width: getWidthPercentage(180),
    height: getHeightPercentage(135),
  },
  photoDivider: {
    // marginLeft: getWidthPercentage(10),
  },
  $photoSize: getWidthPercentage(22),
  photoButtonContainer: {
    marginTop: getHeightPercentage(100),
    marginLeft: getWidthPercentage(4),
    width: getWidthPercentage(30),
    height: getHeightPercentage(30),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fe6669',
  },
  photoButtonPlaceholder: {
    backgroundColor: '#4aa5ff',
  },
  photoButton: {
    textAlign: 'center',
    color: 'white',
  },
  photoButtonText: {
    backgroundColor: '$white',
  },
  deleteButton: {
    color: '$red',
  },
});
