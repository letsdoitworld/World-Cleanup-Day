import EStyleSheet from 'react-native-extended-stylesheet';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers'

export default EStyleSheet.create({
  container: {
    backgroundColor: '$white',
    marginVertical: getHeightPercentage(178),
    marginHorizontal: getWidthPercentage(20),
    borderRadius: 8,
    height: getHeightPercentage(212),
    width: getWidthPercentage(280),
    alignItems: 'center',
  },
  image: {
    marginTop: getHeightPercentage(20),
    width: getWidthPercentage(50),
    height: getHeightPercentage(50),
  },
  header: {
    marginTop: getHeightPercentage(15),
    color: 'rgba(43,43,43,0.98)',
    fontFamily: '$boldFont',
    fontSize: 16,
  },
  subHeader: {
    marginTop: getHeightPercentage(5),
    paddingHorizontal: getWidthPercentage(20),
    fontFamily: '$font',
    color: 'rgba(43,43,43,0.98)',
    fontSize: 13,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: getWidthPercentage(20),
    height: getHeightPercentage(48),
    width: getWidthPercentage(280),
    flexDirection: 'row',
    
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
  },
});
