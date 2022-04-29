import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { caseId, name, isFirstLogin } = req.body;
    await prisma.user.upsert({
      where: {
        caseId,
      },
      update: {
        isFirstLogin: Boolean(isFirstLogin),
      },
      create: {
        caseId,
        name,
      },
    });
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
