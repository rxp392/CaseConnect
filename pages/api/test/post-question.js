import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { question, courseId, publisherName, userCaseId, courseName } =
      req.body;
    await prisma.question.create({
      data: {
        question,
        courseId,
        publisherName,
        userCaseId,
        courseName,
        attachment: null,
      },
    });
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
