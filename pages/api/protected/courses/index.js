import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const courses = await prisma.course.findMany({
      orderBy: {
        courseName: "asc",
      },
    });
    return res.status(200).json({ courses });
  } else if (req.method === "POST") {
    const { courseName } = req.body;
    await prisma.course.create({
      data: {
        courseName,
      },
    });
    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
