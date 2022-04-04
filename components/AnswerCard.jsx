import { Text, Button, Flex } from "@chakra-ui/react";

export default function AnswerCard({ _answer }) {
  const {
    id,
    answer,
    questionId,
    userCaseId,
    publisherName,
    numThumbsUp,
    numThumbsDown,
    createdAt,
    readOrNot,
  } = _answer;
  return (
    <Flex>
      <Text fontSize="xl">{answer}</Text>
      <Button size="lg" colorScheme="green" mt="24px">
        Helpful
      </Button>
      <Button size="lg" colorScheme="green" mt="24px">
        Unhelpful
      </Button>
      <Button size="lg" colorScheme="green" mt="24px">
        Comment
      </Button>
    </Flex>
  );
}
