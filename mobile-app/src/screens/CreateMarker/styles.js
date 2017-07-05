import { StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  $headerTopMargin: '$statusBarHeight',
  bottomContainer: {
    height: getHeightPercentage(75),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  createButton: {
    alignSelf: 'center',
  },
  hashtagInput: {
    height: getHeightPercentage(35),
    width: getWidthPercentage(270),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: getWidthPercentage(17),
    paddingLeft: 20,
    backgroundColor: '#FFFFFF',
  },
  hashtagInputPlaceholder: {
    color: '#7D7D7D',
    fontFamily: 'noto-sans-regular',
    fontSize: 13,
  },
  trashtypesText: {
    fontFamily: 'noto-sans-bold',
    fontSize: 18,
  },
  inputContainer: {
    flex: 1,
    marginTop: getHeightPercentage(20),
    position: 'relative',
    height: getHeightPercentage(35),
  },
  tagsContainer: {
    paddingVertical: getWidthPercentage(20),
    paddingHorizontal: getHeightPercentage(20),
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#f6f6f6',
  },
  addTagGradient: {
    height: getHeightPercentage(35),
    width: getWidthPercentage(71),
    borderRadius: getWidthPercentage(52),
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.15,
  },
  addTagText: {
    color: '#3E8EDE',
    fontFamily: 'noto-sans-bold',
    fontSize: 13,
    backgroundColor: 'transparent',
  },
  addTagTouchable: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  addTagContainer: {
    backgroundColor: 'transparent',
  },
  addReportLinearGradient: {
    height: getHeightPercentage(35),
    width: getWidthPercentage(270),
    borderRadius: getWidthPercentage(17.5),
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.15,
  },
  notesText: {
    marginTop: getHeightPercentage(10),
    marginBottom: getHeightPercentage(10),
    fontSize: 13,
    color: '#2B2B2B',
  },
  containerBtnNote: {
    paddingLeft: getWidthPercentage(5),
    paddingRight: getWidthPercentage(5),
  },
  amountText: { color: '#3E8EDE', fontFamily: 'noto-sans-bold', fontSize: 13 },
});
