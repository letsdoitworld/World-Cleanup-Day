import EStylesheet from 'react-native-extended-stylesheet';

import { getHeightPercentage } from '../../shared/helpers';

export default EStylesheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F5F4F5',
    height: getHeightPercentage(40)
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  specialButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})