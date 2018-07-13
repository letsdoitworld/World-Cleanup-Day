import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  terms: {
    marginBottom: getHeightPercentage(20),
  },
  acceptContainer: {
    position: 'absolute',
    bottom: 16,
    left: 26,
    borderRadius: 4,
    height: 44,
    width: 150,
    marginBottom: getHeightPercentage(20),
    backgroundColor: 'rgb(0, 143, 223)',
  },
  denyContainer: {
    position: 'absolute',
    bottom: 16,
    right: 26,
    borderRadius: 4,
    height: 44,
    width: 150,
    marginBottom: getHeightPercentage(20),
    backgroundColor: 'rgb(225, 18, 131)',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 17,
    lineHeight: 24,
    color: 'white',
  },
});
