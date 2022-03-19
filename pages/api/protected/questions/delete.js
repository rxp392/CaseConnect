import prisma from "lib/prisma";

export default async function handler(req, res) {
  const { id } = req.body;

  await prisma.question.delete({
    where: {
      id: Number(id),
    },
  });

  return res.status(200).json();
}
