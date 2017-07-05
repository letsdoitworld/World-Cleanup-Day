import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  $borderColor: '#7AC0FF',
  $widthSize10: getWidthPercentage(10),
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagContainer: {
    height: getHeightPercentage(25),
    borderWidth: 1,
    borderColor: '$borderColor',
    borderRadius: getHeightPercentage(12.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: '$widthSize10',
    paddingLeft: '$widthSize10',
    marginTop: '$widthSize10',
    marginRight: '$widthSize10',
    position: 'relative',
    backgroundColor: 'white',
  },
  tagContainerSelected: {
    backgroundColor: '#4AA5FF',
  },
  text: {
    color: '#3E8EDE',
    fontFamily: '$font',
    fontSize: 13,
  },
  textSelected: {
    color: '$white',
    backgroundColor: 'transparent',
  },
  tagHastag: {
    paddingRight: getWidthPercentage(35),
    backgroundColor: '#c3c3c3',
    borderWidth: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.15,
  },
  tagText: {
    color: '#2A2A2A',
  },
  linearGradient: {
    width: getHeightPercentage(25),
    height: getHeightPercentage(25),
    borderRadius: getHeightPercentage(12.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  hashtagTouchable: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'transparent',
  },
});
