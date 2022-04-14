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
          maxW={"320px"}
          bg={"white"}
          boxShadow={"2xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
        >
          <Avatar
            size={"xl"}
            src={user.profileImage}
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
            {isUser ? "You" : `${user.name}`} {isUser ? "have" : "has"} <br />{" "}
            asked{" "}
            <span style={{ fontWeight: "bold", color: "#0a304e" }}>
              {user.totalQuestions}
            </span>{" "}
            question{user.totalQuestions === 1 ? "" : "s"},<br /> answered{" "}
            <span style={{ fontWeight: "bold", color: "#0a304e" }}>
              {user.answers.length}
            </span>{" "}
            question
            {user.answers.length === 1 ? "" : "s"}, <br /> and belong
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
            <Badge
              px={2}
              py={1}
              fontWeight={"400"}
              rounded="md"
              bg="cwru"
              color="white"
            >
              {user.subscription} Plan
            </Badge>
            <Badge
              px={2}
              py={1}
              fontWeight={"400"}
              rounded="md"
              bg="cwru"
              color="white"
            >
              Created{" "}
              {new Date(user.accountCreated).toLocaleDateString("en-us")}
            </Badge>
          </Stack>
        </Box>
      </Center>
    </SlideFade>
  );
}
