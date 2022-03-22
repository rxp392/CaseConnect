import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  SlideFade,
  Badge,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function ProfileCard({ user }) {
  const { data: session } = useSession();

  const isUser = session.user.caseId === user.caseId;

  return (
    <SlideFade in={true} offsetY="20px">
      <Center py={6}>
        <Box
          w={["85vw", "320px"]}
          maxW={"320px"}
          bg={"white"}
          boxShadow={"2xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
        >
          <Avatar
            size={"xl"}
            src={`/profile-pics/${user.caseId}.jpg`}
            name={user.name}
            bg={"cwru"}
            color={"white"}
            mb={4}
            pos={"relative"}
          />
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            {user.name}
          </Heading>
          <Text fontWeight={600} color={"gray.500"} mb={4}>
            @{user.caseId}
          </Text>
          <Text textAlign={"center"} color={"gray.700"}>
            {isUser ? "You" : `${user.name} (${user.caseId})`}{" "}
            {isUser ? "have" : "has"} asked{" "}
            <span style={{ fontWeight: "bold", color: "#0a304e" }}>
              {user.questions.length}
            </span>{" "}
            question{user.questions.length === 1 ? "" : "s"}, answered{" "}
            <span style={{ fontWeight: "bold", color: "#0a304e" }}>
              {user.answers.length}
            </span>{" "}
            question
            {user.answers.length === 1 ? "" : "s"}, commented on{" "}
            <span style={{ fontWeight: "bold", color: "#0a304e" }}>
              {user.comments.length}
            </span>{" "}
            question
            {user.comments.length === 1 ? "" : "s"}, and belong
            {isUser ? "" : "s"} to{" "}
            <span style={{ fontWeight: "bold", color: "#0a304e" }}>
              {user.courses.length}
            </span>{" "}
            course
            {user.courses.length === 1 ? "" : "s"}.
          </Text>

          <Stack
            align={"center"}
            justify={"center"}
            direction={"row"}
            flexWrap="wrap"
            gap={1}
            mt={6}
          >
            <Badge px={2} py={1} bg="cwru" color="white" fontWeight={"400"}>
              {user.subscription} Plan
            </Badge>
            <Badge px={2} py={1} bg="cwru" color="white" fontWeight={"400"}>
              Created{" "}
              {new Date(user.accountCreated).toLocaleDateString("en-us")}
            </Badge>
          </Stack>
        </Box>
      </Center>
    </SlideFade>
  );
}
