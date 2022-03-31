import { IncomingForm } from "formidable";

export default async function getImage(formData) {
  return await new Promise(function (resolve, reject) {
    const form = new IncomingForm();
    form.parse(formData, function (err, fields, files) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}
