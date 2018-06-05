import EStyleSheet from 'react-native-extended-stylesheet';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';
import { dm } from '../../themes';

export default EStyleSheet.create({
  container: {
    height: getHeightPercentage(208),
    width: getWidthPercentage(320),
    backgroundColor: '$grey',
  },
  title: {
    marginTop: getHeightPercentage(20),
    marginLeft: getWidthPercentage(20),
    // fontFamily: 'noto-sans-bold',
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
    width: 235,
    height: 147,
    marginRight: 10,
  },
  photoDivider: {
    // marginLeft: getWidthPercentage(10),
  },
  $photoSize: getWidthPercentage(22),
  photoButtonContainer: {
    marginBottom: 8,
    marginLeft: 18,
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fe6669',
  },
  photoButtonPlaceholder: {
    backgroundColor: '#4aa5ff',
    bottom: 0,
    left: 0,
    marginLeft: 8,
    position: 'absolute',
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
  closeTouchAreaStyle: {
    borderRadius: 1,
    height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'absolute',
    right: -5,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: dm.margin_medium,
  },
  deletePhotoButton: {
    width: 30,
    height: 30,
    overflow: 'hidden',
    position: 'absolute',
  },
  addImageCircle: {
    width: 30,
    height: 30,
    backgroundColor: 'rgb(0, 143, 223)',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'absolute',
    right: -5,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: dm.margin_medium,
  },
  imageClose: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
    color: 'white',
  },
});
