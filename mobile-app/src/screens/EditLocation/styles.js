import ESTyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default ESTyleSheet.create({
  $heightSize20: getHeightPercentage(20),
  $heightSize10: getHeightPercentage(10),
  $borderRadius: 8,
  container: { flex: 1, position: 'relative' },
  image: {
    position: 'absolute',
    width: 38,
    height: 49,
  },
  adressContainer: {
    position: 'absolute',
    top: '$heightSize10',
    left: getWidthPercentage(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: getWidthPercentage(300),
    backgroundColor: '$white',
    borderRadius: 2,
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    padding: getWidthPercentage(10),
  },
  addressLabel: {
    fontFamily: 'noto-sans-regular',
    fontSize: '$fontDefaultSize',
    color: '$textColor',
  },
  saveButtonStyle: {
    width: getWidthPercentage(280),
    height: getHeightPercentage(35),
    borderRadius: 50,
    backgroundColor: 'transparent',
    position: 'absolute',
    left: getWidthPercentage(20),
    bottom: '$heightSize20',
  },
  modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: getWidthPercentage(280),
    height: getHeightPercentage(212),
    backgroundColor: '$white',
    borderRadius: '$borderRadius',
    paddingTop: '$heightSize20',
  },
  modalButton: {
    backgroundColor: '#F2F2F2',
    borderRadius: 0,
    borderBottomLeftRadius: '$borderRadius',
    borderBottomRightRadius: '$borderRadius',
  },
  modalButtonTextStyle: {
    color: '#3E8EDE',
    fontSize: '$fontDefaultSize',
    fontFamily: '$boldFont',
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: '$heightSize20',
  },
  title: {
    fontFamily: '$boldFont',
    fontSize: 16,
    color: '$textColor',
    marginVertical: '$heightSize10',
  },
  description: {
    fontFamily: 'noto-sans-regular',
    fontSize: '$fontDefaultSize',
    color: '$textColor',
  },
});
