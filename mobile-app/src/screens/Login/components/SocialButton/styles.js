import { colors } from '../../../../themes';
import {
  getHeightPercentage,
  getWidthPercentage,
} from '../../../../shared/helpers';

export default {
  $iconSize: 20,
  container: {
    backgroundColor: colors.$white,
    flexDirection: 'row',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  iconContainer: {
    flex: -1,
    height: getHeightPercentage(25),
    width: getWidthPercentage(25),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginLeft: 10,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    height: 25,
    width: 25,
    margin: 5,
  },
  text: {
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color: colors.$white,
  },
};

