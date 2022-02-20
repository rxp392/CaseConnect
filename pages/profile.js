import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";

export default function Profile() {
  const { data: session } = useSession();

  const [username, setUsername] = useState(session.user.caseID);
  const [email, setEmail] = useState(`${session.user.caseID}@case.edu`);
  const [role, setRole] = useState(session.user.role);

  return (
    <Stack
      spacing={4}
      w={"full"}
      maxW={"md"}
      bg={useColorModeValue("white", "gray.700")}
      rounded={"xl"}
      boxShadow={"lg"}
      p={6}
      my={12}
    >
      <Heading
        lineHeight={1.1}
        fontSize={{ base: "2xl", sm: "3xl" }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: ".5rem",
        }}
      >
        <CgProfile /> Your Profile
      </Heading>
      <FormControl id="userName">
        <FormLabel>User Icon</FormLabel>
        <Stack direction={["column", "row"]} spacing={6}>
          <Center>
            <Avatar
              size="xl"
              src={`/avatars/${session.user.avatar.replace(/\s+/g, "")}.png`}
            />
          </Center>
          <Center w="full">
            <Button w="full">Change Icon</Button>
          </Center>
        </Stack>
      </FormControl>
      <FormControl id="userName">
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="UserName"
          _placeholder={{ color: "gray.500" }}
          type="text"
          value={username}
          isDisabled
        />
      </FormControl>
      <FormControl id="email">
        <FormLabel>CWRU Email</FormLabel>
        <Input
          value={email}
          isDisabled
          _placeholder={{ color: "gray.500" }}
          type="email"
        />
      </FormControl>
      <FormControl id="isTutor">
        <FormLabel>Are you a Student or a Tutor?</FormLabel>
        <RadioGroup value={role} isDisabled>
          <Stack direction="row">
            <Radio value="Student" defaultChecked>
              Student
            </Radio>
            <Radio value="Tutor">Tutor</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <Stack spacing={6} direction={["column", "row"]}>
        <Button
          isDisabled
          bg={"blue.400"}
          color={"white"}
          w="full"
          _hover={{
            bg: "blue.500",
          }}
        >
          Update
        </Button>
      </Stack>
    </Stack>
  );
}

Profile.auth = true;
