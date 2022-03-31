import cloudinary from "lib/cloudinary";

export default function deleteImage({ public_id }) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      public_id,
      {
        invalidate: true,
        type: "private",
      },
      function (err, result) {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}
