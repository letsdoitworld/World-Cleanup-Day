const ImageService = {
  async getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  },
  async getResizedImageBase64({ base64 }) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.style.opacity = 0;
      const ctx = canvas.getContext('2d');

      canvas.width = 270; // target width
      canvas.height = 180; // target height
      const image = new Image();

      const calculateTargetSize = (imgWidth, imgHeight) => {
        let sizeCoeff;
        const ifUploadedImgOversized =
        (imgWidth > canvas.width || imgHeight > canvas.heigth);
        const ifWidthMoreThanHeight = imgWidth > imgHeight;
        if (
          ifUploadedImgOversized &&
          ifWidthMoreThanHeight
        ) {
          sizeCoeff = imgWidth / canvas.width;
          return {
            width: imgWidth / sizeCoeff,
            height: imgHeight / sizeCoeff,
          };
        }
        if (ifUploadedImgOversized && !ifWidthMoreThanHeight) {
          sizeCoeff = imgHeight / canvas.width;
          return {
            width: imgWidth / sizeCoeff,
            height: imgHeight / sizeCoeff,
          };
        }
        return {
          width: imgWidth,
          height: imgHeight,
        };
      };

      console.log();

      document.body.appendChild(image);
      image.onload = () => {
        const targetSize = calculateTargetSize(image.width, image.height);
        const targetWidth = targetSize.width;
        const targetHeight = targetSize.height;
        ctx.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          targetWidth,
          targetHeight,
        );

        // create a new base64 encoding
        resolve({ base64: canvas.toDataURL().split(',')[1] });
        image.remove();
        canvas.remove();
      };
      image.src = `data:image/jpg;base64,${base64}`;
    });
  },
};

export default ImageService;
