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
  async getEXIFCoordinates(base64) {
    let image = new Image();
    image.src = `data:image/jpg;base64,${base64}`;

    // convert to DDD coordinate format as used by the Geolocation API
    function sanitizeEXIFCoordinate(coords, ref) {
      if (coords === undefined) return "";

      // resolve possible fractions as per spec (eg. stores [dd/1, mmmm/100, 0/1] for DMM format) and aggregate
      let coordinate = coords.reduce((sum, val, idx) => {
        return sum + (val.numerator/val.denominator) / Math.pow(60, idx)
      }, 0);

      // account for coordinate quadrant
      if (ref === "S" || ref === "W") {
        coordinate = - coordinate;
      }

      return coordinate;
    }

    function extractCoordinates() {
      EXIF.getData(image, function() {
        let lat = EXIF.getTag(this, "GPSLatitude");
        let ref = EXIF.getTag(this, "GPSLatitudeRef");
        lat = sanitizeEXIFCoordinate(lat, ref);

        let lng = EXIF.getTag(this, "GPSLongitude");
        ref = EXIF.getTag(this, "GPSLongitudeRef");
        lng = sanitizeEXIFCoordinate(lng, ref);
        console.log(lat + " | " + lng); // TODO: remove when verified
        image.lat = lat;
        image.lng = lng;
      });
    }

    function load() {
      return new Promise(function(resolve, reject) {
        image.onload = resolve;
      });
    }

    await load().then(extractCoordinates);
    return { lat: image.lat, lng: image.lng };
  },
};

export default ImageService;
