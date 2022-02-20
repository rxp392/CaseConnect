import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";

export default function Index() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How it works</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{/* <Lorem count={2} /> */}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text color={"blue.400"} as={"span"}>
                Case Connect
              </Text>{" "}
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit
              temporibus soluta, voluptatum quam animi minima.
            </Text>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Button
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={() => router.push("/signup")}
              >
                Get Started
              </Button>
              <Button rounded={"full"} onClick={onOpen}>
                How It Works
              </Button>
            </Stack>
            <Text align={{ base: "center", md: "left" }}>
              Have an account?{" "}
              <NextLink href="/signin" passHref>
                <Link color="blue.500">Sign in</Link>
              </NextLink>
            </Text>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            src={
              "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
          />
        </Flex>
      </Stack>
    </>
  );
}
