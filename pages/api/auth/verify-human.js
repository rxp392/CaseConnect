import axios from "axios";

export default async function (req, res) {
  const { token } = req.body;
  const {
    data: { success },
  } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  );
  return res.json({ success });
}
