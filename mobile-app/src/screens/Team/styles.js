import { Dimensions } from 'react-native';
import { dm } from '../../themes';

const { width } = Dimensions.get('window');

const fontFamily = 'Lato-Regular';
const fontSize = 16;

export default {
  container: {
    backgroundColor: '#F0F0F0'
  },
  infoTitle: {
    paddingLeft: 15,
    marginBottom: 5,
    color: '#6e6e6e',
    fontFamily,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 25,
  },
  button: {
    width: 300,
    height: 40,
    backgroundColor: '#1791DC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    fontSize,
    fontFamily,
    color: 'white',
  },
  infoTextWrapper: {
    minHeight: 40,
    backgroundColor: 'white',
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: 15,
  },
  text: {
    fontFamily,
    fontSize,
    paddingLeft: 15,
    marginVertical: 5,
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};