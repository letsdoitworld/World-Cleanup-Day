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
  button: {
    marginBottom: getHeightPercentage(20),
  },
});
