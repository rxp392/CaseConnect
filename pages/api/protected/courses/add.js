import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { courseName } = req.body;

  await prisma.course.create({
    data: {
      courseName,
    },
  });

  return res.status(200).json();
}
