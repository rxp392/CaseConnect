import prisma from "lib/prisma";
import { getSession } from "next-auth/react";
import {
  Image,
  Link,
  Heading,
  Text,
  Flex,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { GrAttachment } from "react-icons/gr";

export default function Question({ _question, caseId }) {
  const {
    id,
    courseId,
    userCaseId,
    question,
    courseName,
    attachment,
    publisherName,
    createdAt,
  } = _question;

  const isUser = caseId === userCaseId;

  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);

  return (
    <>
      <AttachmentModal
        isOpen={attachmentModalOpen}
        onClose={() => setAttachmentModalOpen(false)}
        attachment={attachment}
      />

      <Flex h="full" w="full" justify="center" mt={6} pos="relative">
        {attachment && (
          <Tooltip label="View attachment" placement="left">
            <IconButton
              icon={<GrAttachment />}
              pos="absolute"
              top="-3"
              right="1"
              onClick={() => setAttachmentModalOpen(true)}
            />
          </Tooltip>
        )}
        <Flex
          h="min-content"
          w="full"
          justify="center"
          align="center"
          direction="column"
        >
          <Heading>{question}</Heading>
          <Text fontSize="lg">{courseName}</Text>
          <Text fontSize="md">
            Posted {new Date(createdAt).toLocaleDateString("en-us")} by{" "}
            <NextLink
              href={isUser ? "/my-profile" : `/profile/${userCaseId}`}
              passHref
            >
              <Link color="cwru">{publisherName}</Link>
            </NextLink>
          </Text>
        </Flex>
      </Flex>
    </>
  );
}

function AttachmentModal({ isOpen, onClose, attachment }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w="fit-content" h="fit-content">
        <ModalCloseButton />
        <ModalHeader>Attachment</ModalHeader>
        <ModalBody>
          <Image
            src={`/question-attachments/${attachment}.jpg`}
            alt="attachment"
            maxW="full"
            maxH="full"
            objectFit="cover"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export async function getServerSideProps({ params, req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const { courses, viewHistory, caseId } = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      courses: true,
      viewHistory: true,
      caseId: true,
    },
  });

  if (!courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  try {
    const [id, courseId] = params.questionId.split("-");

    if (!courses.some((course) => course.id === Number(courseId))) {
      res.writeHead(302, { Location: "/questions" });
      res.end();
      return { props: {} };
    }

    const question = await prisma.question.findUnique({
      where: { id: Number(id) },
    });

    await prisma.history.upsert({
      where: {
        id:
          viewHistory.find((history) => history.questionId === Number(id))
            ?.id || -1,
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        questionId: Number(id),
        caseId: session.user.caseId,
      },
    });

    return {
      props: {
        _question: {
          ...question,
          createdAt: question.createdAt.toISOString(),
        },
        caseId,
      },
    };
  } catch {
    res.writeHead(302, { Location: "/questions" });
    res.end();
    return { props: {} };
  }
}
