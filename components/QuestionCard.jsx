import {
  Box,
  Text,
  Center,
  Stack,
  Heading,
  Avatar,
  Button,
  Flex,
  Badge,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function QuestionCard({
  _question,
  isUser,
  isPageLoading,
  setIsPageLoading,
}) {
  const {
    courseId,
    courseName,
    createdAt,
    publisherName,
    question,
    id,
    answers,
    userCaseId,
    views,
    attachment,
    userImage,
  } = _question;

  const { data: session } = useSession();
  const answersLength = answers.length;
  const viewedDate = views.find((view) => view.caseId === session.user.caseId);
  const router = useRouter();

  const formatBadge = (number, type) => {
    if (number === 0) return `no ${type}s`;
    return `${number} ${type}${number > 1 ? "s" : ""}`;
  };

  return (
    <>
      <Center py={6}>
        <Box
          maxW={["85vw", "445px"]}
          minW={["85vw", "445px"]}
          w={"full"}
          bg="white"
          boxShadow={"xl"}
          rounded={"lg"}
          px={3}
          pt={4}
          pb={3}
          pos="relative"
        >
          <Stack spacing={2}>
            <Heading color="black" fontSize={"2xl"} fontWeight="semibold">
              {question}
            </Heading>
            <Text
              color="gray.900"
              fontSize={"md"}
              fontWeight="normal"
              isTruncated
            >
              {courseName}
            </Text>
            <Wrap pt={1}>
              <WrapItem>
                <Badge colorScheme="green">
                  {formatBadge(answersLength, "answer")}
                </Badge>
              </WrapItem>

              <WrapItem>
                <Badge colorScheme="blue">
                  {viewedDate ? (
                    <>
                      Viewed{" "}
                      {new Date(viewedDate.viewedAt).toLocaleDateString(
                        "en-us"
                      )}
                    </>
                  ) : (
                    "Not Viewed"
                  )}
                </Badge>
              </WrapItem>

              <WrapItem>
                <Badge colorScheme="facebook">
                  {attachment ? "1" : "no"} Attachment
                </Badge>
              </WrapItem>
            </Wrap>
          </Stack>
          <Stack
            textAlign="left"
            mt={8}
            direction={"row"}
            display={"flex"}
            w={"full"}
            justifyContent={"space-between"}
            spacing={[5, 10]}
            align={"center"}
          >
            <Button
              variant="ghost"
              pl={1}
              pr={1.5}
              py={2}
              onClick={() =>
                router.push(isUser ? "/my-profile" : `/profile/${userCaseId}`)
              }
              isDisabled={isPageLoading}
              rounded={"lg"}
            >
              <Flex gap={2} justifyContent={"center"} align={"center"}>
                <Avatar
                  src={userImage}
                  name={publisherName}
                  size="sm"
                  bg="cwru"
                  color="white"
                  getInitials={(_name) => {
                    const splitName = _name.split(" ");
                    if (splitName.length === 1) {
                      return splitName[0].charAt(0);
                    } else if (splitName.length == 2) {
                      return `${splitName[0].charAt(0)}${splitName[1].charAt(
                        0
                      )}`;
                    } else {
                      return `${splitName[0].charAt(0)}${splitName[
                        splitName.length - 1
                      ].charAt(0)}`;
                    }
                  }}
                />
                <Stack
                  direction={"column"}
                  spacing={0}
                  fontSize={"xs"}
                  textAlign="left"
                >
                  <Text fontWeight={600}>
                    {publisherName} {isUser && "(you)"}
                  </Text>
                  <Text color={"gray.500"}>
                    {new Date(createdAt).toLocaleDateString("en-US")}
                  </Text>
                </Stack>
              </Flex>
            </Button>
            <Flex gap={1.5}>
              <Button
                p={2.5}
                fontSize={"sm"}
                variant="solid"
                onClick={() => {
                  setIsPageLoading(true);
                  router.push(`/question?id=${id}&courseId=${courseId}`);
                }}
                isDisabled={isPageLoading}
                colorScheme="black"
                color="white"
                bg="cwru"
                _hover={{
                  backgroundColor: "rgba(10, 48, 78, 0.85)",
                }}
              >
                View Question
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Center>
    </>
  );
}
