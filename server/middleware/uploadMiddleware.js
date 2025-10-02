import multer from "multer";
import path from "path";

const sanitizeFileName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, "")
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    const productName = req.body.name || "product"
    const safeName = sanitizeFileName(productName)
    cb(null, `${safeName}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error("Only images are allowed"), false)
  }
}

export const upload = multer({ storage, fileFilter })
