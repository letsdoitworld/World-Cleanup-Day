import EStyleSheet from 'react-native-extended-stylesheet';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';
import { colors, dm } from '../../themes';

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
  locationimage: {
    marginTop: getHeightPercentage(20),
    width: getWidthPercentage(50),
    height: getHeightPercentage(50),
  },
  locationheader: {
    marginTop: getHeightPercentage(15),
    color: 'rgba(43,43,43,0.98)',
    fontFamily: 'Lato-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  locationsubHeader: {
    marginTop: getHeightPercentage(5),
    paddingHorizontal: getWidthPercentage(20),
    fontFamily: 'Lato-Bold',
    color: 'rgba(43,43,43,0.98)',
    fontSize: 15,
    textAlign: 'center',
  },
  locationbuttonsContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingVertical: dm.margin_small,
  },
  locationmainContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 178,
    left: 20,
    right: 20,
    borderRadius: 8,
    paddingBottom: 30,
    alignItems: 'center',
  },
  locationfullSize: {
    flex: 1,
  },
  locationbackground: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
  },
});
