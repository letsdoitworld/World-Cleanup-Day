import EStyleSheet from 'react-native-extended-stylesheet';
import { StyleSheet } from 'react-native';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

export default EStyleSheet.create({
  $sizeWidth10: getWidthPercentage(10),
  $sizeHeight20: getHeightPercentage(20),
  $sizeWidth20: getWidthPercentage(20),
  $sizeWidth280: getWidthPercentage(280),
  $font13: 13,
  container: { backgroundColor: '#EEEEEE' },
  divider: {
    backgroundColor: '#D9D9D9',
    height: StyleSheet.hairlineWidth,
    marginTop: '$sizeHeight20',
    marginBottom: '$sizeHeight20',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: '$sizeWidth20',
  },
  streetContainer: {
    fontFamily: 'noto-sans-bold',
    fontSize: 30,
    color: '#404040',
    width: '$sizeWidth280',
  },
  addressContainer: {
    fontFamily: 'noto-sans-regular',
    fontSize: '$font13',
    color: '#7F7F7F',
    width: '$sizeWidth280',
    paddingLeft: '$sizeWidth10',
  },
  locationImage: { width: 11, height: 15 },
  threatImage: { width: 17, height: 15 },
  threatText: {
    fontFamily: 'noto-sans-bold',
    fontSize: '$font13',
    color: '#EB5757',
    paddingLeft: getWidthPercentage(4),
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creationImage: {
    width: 9,
    height: 9,
    marginLeft: getWidthPercentage(3),
  },
  updateImage: {
    width: 11,
    height: 12,
    marginLeft: getWidthPercentage(3),
  },
  createdText: {
    fontFamily: 'noto-sans-regular',
    fontSize: '$font13',
    color: '#7d7d7d',
    paddingLeft: getWidthPercentage(7),
  },
  dateCreatedText: {
    color: '$textColor',
    fontFamily: 'noto-sans-regular',
    fontSize: '$font13',
    marginLeft: getWidthPercentage(3),
  },
  updatedText: {
    fontFamily: 'noto-sans-regular',
    fontSize: '$font13',
    color: '#7d7d7d',
    paddingLeft: getWidthPercentage(6),
  },
  dateUpdatedText: {
    color: '$textColor',
    fontFamily: 'noto-sans-regular',
    fontSize: '$font13',
  },
  containerTypes: {
    paddingVertical: '$sizeWidth20',
    paddingHorizontal: '$sizeHeight20',
  },
  typesTitle: {
    fontFamily: 'noto-sans-bold',
    fontSize: 16,
    color: '$textColor',
  },
  containerTags: {
    marginTop: getHeightPercentage(15),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  containerTag: {
    paddingHorizontal: '$sizeWidth20',
    paddingVertical: getHeightPercentage(5),
    marginRight: '$sizeWidth10',
    marginTop: '$sizeWidth10',
    backgroundColor: '#E4E4E4',
    borderRadius: 25,
  },
  tagText: {
    fontFamily: 'noto-sans-regular',
    fontSize: 13,
  },
  completeAddressContainer: {
    flexDirection: 'row',
    marginTop: getHeightPercentage(5),
    marginBottom: '$sizeHeight20',
  },
});
