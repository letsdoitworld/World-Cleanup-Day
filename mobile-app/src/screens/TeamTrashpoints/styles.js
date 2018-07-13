import { Dimensions } from 'react-native';
import { dm } from '../../themes';

const { width } = Dimensions.get('window');

export default {
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  listDivider: {
    height: 1,
    backgroundColor: 'rgb(229, 229, 233)',
  },
  trashpoint: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  locationIcon: {
    marginLeft: 15,
    marginRight: 7,
    width: 20,
    height: 25,
  },
};
