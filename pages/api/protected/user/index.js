import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { caseId } = req.query;
    const user = await prisma.user.findUnique({
      where: { caseId },
    });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
