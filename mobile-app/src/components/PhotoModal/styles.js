import EStyleSheet from 'react-native-extended-stylesheet';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

const styles = EStyleSheet.create({
  $iconSize: getWidthPercentage(20),
  buttonIcon: {
    textAlign: 'center',
    color: 'white',
  },
  buttonBody: {
    width: getWidthPercentage(30),
    height: getHeightPercentage(30),
    marginLeft: getWidthPercentage(265),
    marginTop: getHeightPercentage(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fe6669',
    borderRadius: 4,
  },
  modal: {
    backgroundColor: '#d8d8d8',
  },
  image: {
    flex: 1,
  },
});

export default styles;
