import {
  Box,
  Text,
  Center,
  Stack,
  Heading,
  Avatar,
  Button,
  Flex,
  SlideFade,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function QuestionCard({ question }) {
  const router = useRouter();

  return (
    <SlideFade offsetY="20px" in={true}>
      <Center py={6}>
        <Box
          maxW={"445px"}
          w={"full"}
          bg="white"
          boxShadow={"2xl"}
          rounded={"md"}
          p={5}
        >
          <Stack spacing={2}>
            <Heading color="gray.700" fontSize={"xl"}>
              What is the best way to learn React?
            </Heading>
            <Text color="gray.600" fontSize={"md"}>
              CSDS 132. Introduction to Java
            </Text>
            <Text color="gray.600" fontSize={"sm"}>
              2 Answers, 4 Comments
            </Text>
          </Stack>
          <Stack
            mt={8}
            direction={"row"}
            display={"flex"}
            w={"full"}
            justifyContent={"space-between"}
            spacing={4}
            align={"center"}
          >
            <Flex gap={3} justifyContent={"center"} align="center">
              <Avatar
                src={"https://avatars0.githubusercontent.com/u/1164541?v=4"}
                alt={"Author"}
                size="md"
              />
              <Stack direction={"column"} spacing={0} fontSize={"sm"}>
                <Text fontWeight={600}>Achim Rolle</Text>
                <Text color={"gray.500"}>Feb 08, 2021</Text>
              </Stack>
            </Flex>
            <Button
              type="submit"
              loadingText="Posting"
              spinnerPlacement="end"
              size="md"
              bg="cwru"
              color="white"
              colorScheme="black"
              _active={{
                transform: "scale(0.95)",
              }}
              _hover={{
                transform: "scale(1.02)",
              }}
              onClick={() => router.push("/question/2")}
            >
              View Question
            </Button>
          </Stack>
        </Box>
      </Center>
    </SlideFade>
  );
}
