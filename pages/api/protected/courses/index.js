import prisma from "lib/prisma";

export default async function handler(_, res) {
  const allCourses = await prisma.course.findMany({
    orderBy: {
      courseName: "asc",
    },
  });
  return res.status(200).json({ allCourses });
}
