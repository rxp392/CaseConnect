import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { id } = req.body;

    await prisma.notification.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
