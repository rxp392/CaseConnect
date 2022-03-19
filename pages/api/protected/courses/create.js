import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { courseName } = req.body;

    await prisma.course.create({
      data: {
        courseName,
      },
    });
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
