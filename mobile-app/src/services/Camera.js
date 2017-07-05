import { ImagePicker, Constants } from 'expo';

const CameraService = {
  pickPhotoAsync(options) {
    return ImagePicker.launchImageLibraryAsync(options);
  },
  takePhotoAsync(options) {
    // caveat for most simulators, since they don't usually hav a camera
    if (!Constants.isDevice) {
      return ImagePicker.launchImageLibraryAsync(options);
    }
    return ImagePicker.launchCameraAsync(options);
  },
};

export default CameraService;
