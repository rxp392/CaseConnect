import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { courseName } = req.body;
  await prisma.course.create({
    data: {
      courseName,
    },
  });

  return res.status(200).json({ success: true });
}
