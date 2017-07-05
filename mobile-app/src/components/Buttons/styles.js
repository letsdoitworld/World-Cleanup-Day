import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: '$radius10',
    borderBottomRightRadius: '$radius10',
  },
  text: {
    color: '$blue',
    fontSize: 13,
    textDecorationLine: 'underline',
    fontFamily: '$boldFont',
  },
});
