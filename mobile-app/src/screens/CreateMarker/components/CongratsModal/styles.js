import EStyleSheet from 'react-native-extended-stylesheet';
import { getHeightPercentage, getWidthPercentage } from '../../../../shared/helpers';
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
  header: {
    width: getWidthPercentage(148),
    height: getHeightPercentage(41),
    marginTop: getHeightPercentage(30),
    fontFamily: '$boldFont',
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
});
