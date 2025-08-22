// 1. Import multer.
import multer from 'multer';
import Path from "path";

// 2. Configure storage with filename and location.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Path.resolve('uploads'));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + '-' + file.originalname
    );
  },
});

const upload = multer({ storage: storage })
export default upload;