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
      document.body.appendChild(image);

      image.onload = () => {
        ctx.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          canvas.width,
          canvas.height,
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
