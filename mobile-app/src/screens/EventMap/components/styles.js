import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';
import { getHeightPercentage, getWidthPercentage } from '../../../shared/helpers';
import { colors, dm } from '../../../themes';

export default EStyleSheet.create({
  image: {
    marginTop: 10,
    alignSelf: 'center',
    width: getWidthPercentage(111),
    height: getHeightPercentage(112),
  },
  subHeader: {
    marginTop: getHeightPercentage(15),
    paddingHorizontal: getWidthPercentage(20),
    fontFamily: 'Lato-Bold',
    color: colors.textColor,
    fontSize: 15,
    textAlign: 'center',
  },
  text: {
    marginTop: getHeightPercentage(5),
    paddingHorizontal: getWidthPercentage(20),
    fontFamily: 'Lato-Regular',
    color: colors.modalText,
    fontSize: 15,
    textAlign: 'center',
  },
  buttonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
  },
  mainContainer: {
    top: getHeightPercentage(142),
    width: getWidthPercentage(283),
    height: getHeightPercentage(258),
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'white',
    borderRadius: 4,
    alignItems: 'center',
    zIndex: 11,
  },
  fullSize: {
    flex: 1,
  },
  confirmButton: {
    width: Dimensions.get('window').width - dm.margin_medium * 2 - 40,
    flex: 1,
    backgroundColor: 'rgb(0, 143, 223)',
    height: 44,
    justifyContent: 'center',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  confirmButtonText: {
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    lineHeight: 21,
  },
});
