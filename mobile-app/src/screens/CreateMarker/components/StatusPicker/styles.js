import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    height: 127,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  option: {
    alignItems: 'center',
  },
  image: {
    width: 63,
    height: 63,
  },
  selectedImage: {
    width: 63,
    height: 63,
  },
  imageText: {
    marginTop: 7,
    color: 'rgb(138, 138, 143)',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
    fontFamily: 'Lato-Bold',
    letterSpacing: -0.4,
  },
});
