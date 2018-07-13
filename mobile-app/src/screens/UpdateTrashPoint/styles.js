import EStyleSheet from 'react-native-extended-stylesheet';
import { dm } from '../../themes';

export default EStyleSheet.create({
  controlsContainer: {
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    paddingBottom: 29,
  },
  updateButton: {
    flex: 1,
    backgroundColor: 'rgb(0, 143, 223)',
    height: 44,
    marginRight: dm.margin_large,
    justifyContent: 'center',
    borderRadius: 4,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'rgb(225, 18, 131)',
    height: 44,
    justifyContent: 'center',
    borderRadius: 4,
  },
  updateButtonText: {
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    lineHeight: 21,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 20,
    paddingHorizontal: 26,
  },
  clickableText: {
    fontSize: 17,
    color: 'rgb(225, 18, 131)',
    textDecorationLine: 'underline',
    fontFamily: 'Lato-Bold',
  },
});
