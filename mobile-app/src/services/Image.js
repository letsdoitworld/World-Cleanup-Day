import { ImageEditor, ImageStore } from 'react-native';

const ImageService = {
  async getResizedImageBase64({ width, height, uri }) {
    const resizedUri = await new Promise((resolve, reject) => {
      ImageEditor.cropImage(
        uri,
        {
          offset: { x: 0, y: 0 },
          size: { width, height },
          displaySize: {
            width: 270,
            height: 180,
          },
        },
        newUri => resolve(newUri),
        () => reject(),
      );
    });
    return new Promise((resolve, reject) => {
      ImageStore.getBase64ForTag(
        resizedUri,
        base64 => resolve(base64),
        err => reject(),
      );
    });
  },
};

export default ImageService;
