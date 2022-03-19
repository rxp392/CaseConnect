import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const allCourses = await prisma.course.findMany({
      orderBy: {
        courseName: "asc",
      },
    });
    return res.status(200).json({ allCourses });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
