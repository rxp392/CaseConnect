import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { caseId } = req.body;
    await prisma.user.update({
      where: { caseId },
      data: {
        subscription: "Premium",
      },
    });
    return res.status(200).json({ allCourses });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
