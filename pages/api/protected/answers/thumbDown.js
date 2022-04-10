import prisma from "lib/prisma";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const {id} = req.body;
    await prisma.answer.update({
      where: {
        id: id, 
      },
      data: {
        numThumbsDown: {increment: 1}
      },
    });

    return res.status(200).json();
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error });
  }
}
