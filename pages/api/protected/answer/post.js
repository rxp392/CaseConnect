import prisma from "lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  try {
    const { answer, caseId, questionId, publisherName} = req.body;
    const creAns = await prisma.user.update({
      where: {
        caseId: caseId, 
      },
      data: {
        answers: {
          create: {
            answer: answer,
            question: { connect: { id: questionId } },
            publisherName: publisherName
          } 
        }
      },
      include: {
        answers: true,
      },
    });
    console.log(creAns)

    return res.status(200).json();
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error });
  }
}
