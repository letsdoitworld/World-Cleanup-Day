import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  labelImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  labelText: {
    // fontFamily: 'noto-sans-bold',
    fontSize: 10,
    backgroundColor: 'transparent',
  },
  labelContainer: {
    borderRadius: 100,
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    position: 'absolute',
    left: 14,
  },
});
