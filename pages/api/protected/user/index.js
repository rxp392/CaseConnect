import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { caseId } = req.query;
    const user = await prisma.user.findUnique({
      where: { caseId },
      select: {
        caseId: true,
        name: true,
        profileImage: true,
        isFirstLogin: true,
        subscription: true,
        accountCreated: true,
        questions: true,
        answers: true,
        viewHistory: true,
        notifications: true,
        totalQuestions: true,
      },
    });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
