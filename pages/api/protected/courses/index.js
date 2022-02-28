import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const courses = await prisma.course.findMany({
    orderBy: {
      courseName: "asc",
    },
  });
  return res.status(200).json({ courses });
}
