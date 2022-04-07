import {
  Text,
  Flex,
  Box,
  IconButton,
  HStack,
  Link,
  Heading,
  Grid,
  GridItem
} from "@chakra-ui/react";

import {
  TriangleDownIcon,
  TriangleUpIcon
} from '@chakra-ui/icons'

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
    <Flex h="min-content"
      w="full"
      justify="center"
      align="center"
      direction="column"
      gap={1}>

      <Box
        as="form"
        rounded={"lg"}
        bg="#c4cbcf"
        color="#495c69"
        boxShadow={"lg"}
        w="100%"
        p={10}
      >

        <Heading fontSize='xl'>{
          <Link>{publisherName}</Link>
        }</Heading>

        <Text fontSize="xl">
          {answer}
        </Text>

        <HStack spacing={1}>
          <IconButton
            bg="#66CC99"
            color="white"
            aria-label='Search database'
            icon={<TriangleUpIcon />}
          />
          <IconButton
            bg="#CC6666"
            color="white"

            aria-label='Search database'
            icon={<TriangleDownIcon />}
          />
        </HStack>

      </Box>
    </Flex>
  );
}
