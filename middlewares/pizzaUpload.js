const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/imgs/pizze/",
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const pizzaUpload = multer({ storage: storage });

module.exports = pizzaUpload;
