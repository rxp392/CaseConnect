import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { courseName } = req.body;
    const courses = await prisma.course.findMany({
      where: {
        courseName,
      },
    });
    if (courses.length) {
      return res.status(200).json({ error: "Course already exists" });
    }
    const { id } = await prisma.course.create({
      data: {
        courseName,
      },
      select: {
        id: true,
      },
    });
    return res.status(200).json({ addedCourseId: id });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
