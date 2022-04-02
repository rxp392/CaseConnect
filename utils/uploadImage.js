import cloudinary from "lib/cloudinary";

export default function uploadImage({ imageToUpload, folder, public_id }) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageToUpload,
      {
        type: "private",
        folder,
        public_id,
        invalidate: true,
      },
      (err, res) => {
        if (err) reject(err);
        resolve(res.secure_url);
      }
    );
  });
}