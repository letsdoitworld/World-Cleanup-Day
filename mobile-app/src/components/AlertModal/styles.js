import EStyleSheet from 'react-native-extended-stylesheet';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';
import { colors } from '../../themes';

export default EStyleSheet.create({
  noButtonsContainer: {
    height: getHeightPercentage(170),
    paddingBottom: getHeightPercentage(20),
  },
  image: {
    position: 'absolute',
    top: 66,
    alignSelf: 'center',
    width: getWidthPercentage(280),
    height: getHeightPercentage(380),
  },
  header: {
    marginTop: getHeightPercentage(15),
    color: colors.white,
    fontFamily: 'Lato-Bold',
    fontSize: 18,
  },
  subHeader: {
    marginTop: getHeightPercentage(38),
    paddingHorizontal: getWidthPercentage(20),
    fontFamily: 'Lato-Bold',
    color: colors.textColor,
    fontSize: 18,
    textAlign: 'center',
  },
  text: {
    marginTop: getHeightPercentage(5),
    paddingHorizontal: getWidthPercentage(20),
    fontFamily: 'Lato-Regular',
    color: colors.modalText,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: getHeightPercentage(23),
    flexDirection: 'row',
    bottom: 0,
  },
  mainContainer: {
    position: 'absolute',
    top: getHeightPercentage(235),
    left: 20,
    right: 20,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 11,
  },
  fullSize: {
    flex: 1,
  },
  background: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
  },
});
