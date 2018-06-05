import EStyleSheet from 'react-native-extended-stylesheet';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  $borderColor: '#7AC0FF',
  $widthSize10: getWidthPercentage(10),
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: '$widthSize10',
    paddingLeft: '$widthSize10',
  },
  tagContainer: {
    height: 30,
    borderWidth: 1,
    borderColor: 'rgb(0, 143, 223)',
    borderRadius: 15,
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
    backgroundColor: 'rgb(0, 143, 223)',
  },
  closeStyle: {
    textAlign: 'center',
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'rgb(225, 18, 131)',
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'rgb(0, 143, 223)',
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    lineHeight: 18,
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
