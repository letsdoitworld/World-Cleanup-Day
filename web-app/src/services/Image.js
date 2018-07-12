const EXIF = require('exif-js');

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

  async getEXIFCoordinates(base64) {
    const image = new Image();
    image.src = `data:image/jpg;base64,${base64}`;

    // convert to DDD coordinate format as used by the Geolocation API
    function sanitizeEXIFCoordinate(coords, ref) {
      if (coords === undefined) return '';

      // resolve possible fractions as per spec (eg. stores [dd/1, mmmm/100, 0/1] for DMM format) and aggregate
      let coordinate = coords.reduce((sum, val, idx) => {
        return sum + (val.numerator / val.denominator) / Math.pow(60, idx)
      }, 0);

      // account for coordinate quadrant
      if (ref === 'S' || ref === 'W') {
        coordinate = -coordinate;
      }

      return coordinate;
    }

    function extractCoordinates() {
      EXIF.getData(image, function() {
        let lat = EXIF.getTag(this, 'GPSLatitude');
        let ref = EXIF.getTag(this, 'GPSLatitudeRef');
        lat = sanitizeEXIFCoordinate(lat, ref);

        let lng = EXIF.getTag(this, 'GPSLongitude');
        ref = EXIF.getTag(this, 'GPSLongitudeRef');
        lng = sanitizeEXIFCoordinate(lng, ref);
        image.lat = lat;
        image.lng = lng;
      });
    }

    function load() {
      return new Promise(function (resolve, reject) {
        image.onload = resolve;
      });
    }

    await load().then(extractCoordinates);
    return { lat: image.lat, lng: image.lng };
  },
};

export default ImageService;
