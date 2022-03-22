import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  ListIcon,
  Button,
  Flex,
  SlideFade,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { FaCheckCircle } from "react-icons/fa";
import ReactCanvasConfetti from "react-canvas-confetti";
import { useCallback, useRef, useEffect } from "react";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  transform: "translateX(10%)",
};

export default function Subscription({ user }) {
  const isBasic = user.subscription === "Basic";

  const basicPlanPerks = ["perk 1", "perk 2", "perk 3"];
  const premiumPlanPerks = ["perk 1", "perk 2", "perk 3"];

  const refAnimationInstance = useRef(null);
  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  useEffect(() => {
    !isBasic && fire();
  }, []);

  if (!isBasic) {
    return (
      <>
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        <SlideFade in={true} offsetY="20px">
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={4}
          >
            <Text fontSize={["lg", "2xl", "3xl"]} textAlign="center">
              Congratulations! You are a Premium user.
            </Text>
            <Button
              onClick={fire}
              px={[2, 4, 6]}
              py={[2, 4, 6]}
              bg="cwru"
              color="white"
              colorScheme="black"
              _hover={{
                backgroundColor: "rgba(10, 48, 78, 0.85)",
              }}
            >
              Fire Confetti
            </Button>
          </Flex>
        </SlideFade>
      </>
    );
  }

  return (
    <Box py={12} h={["full", "full", "auto"]}>
      <SlideFade in={true} offsetY="20px">
        <VStack spacing={2} textAlign="center">
          <Heading as="h1" fontSize="4xl">
            Plans that fit your need
          </Heading>
          <Text fontSize="lg" color={"gray.500"}>
            Start with 3 free questions. No credit card needed. Cancel at
            anytime.
          </Text>
        </VStack>
        <Stack
          direction={{ base: "column", md: "row" }}
          textAlign="center"
          justify="center"
          spacing={{ base: 4, lg: 10 }}
          py={10}
        >
          <PriceWrapper>
            {isBasic && (
              <Text
                textTransform="uppercase"
                bg="green.600"
                px={1}
                py={1}
                color="white"
                fontSize="sm"
                fontWeight="600"
                rounded="xl"
              >
                Your Current Plan
              </Text>
            )}
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl">
                Basic Plan
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600"></Text>
                <Text fontSize="5xl" fontWeight="900">
                  Free
                </Text>
                <Text fontSize="3xl" color="gray.500"></Text>
              </HStack>
            </Box>
            <VStack bg="gray.50" py={4} borderBottomRadius={"xl"}>
              <List spacing={3} textAlign="start" px={12}>
                {basicPlanPerks.map((perk, i) => (
                  <ListItem key={i}>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    {perk}
                  </ListItem>
                ))}
              </List>
              <Box w="80%" pt={7}></Box>
            </VStack>
          </PriceWrapper>

          <PriceWrapper>
            <Box position="relative">
              <Box
                position="absolute"
                top="-16px"
                left="50%"
                style={{ transform: "translate(-50%)" }}
              ></Box>
              {isBasic ? (
                <Text
                  textTransform="uppercase"
                  bg="cwru"
                  color="white"
                  px={3}
                  py={1}
                  fontSize="sm"
                  fontWeight="600"
                  rounded="xl"
                >
                  Most Popular Plan
                </Text>
              ) : (
                <Text
                  textTransform="uppercase"
                  bg="red.300"
                  px={3}
                  py={1}
                  color="gray.900"
                  fontSize="sm"
                  fontWeight="600"
                  rounded="xl"
                >
                  Your Current Plan
                </Text>
              )}
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="2xl">
                  Premium Plan
                </Text>
                <HStack justifyContent="center" spacing={0.35}>
                  <Text fontSize="3xl" fontWeight="600">
                    $
                  </Text>
                  <Text fontSize="5xl" fontWeight="900">
                    5
                  </Text>
                  <Text fontSize="3xl" fontWeight="900">
                    <sub>.00</sub>
                  </Text>
                </HStack>
              </Box>
              <VStack bg="gray.50" py={4} borderBottomRadius={"xl"}>
                <List spacing={3} textAlign="start" px={12}>
                  {premiumPlanPerks.map((perk, i) => (
                    <ListItem key={i}>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      {perk}
                    </ListItem>
                  ))}
                </List>
                <Box w="80%" pt={7}>
                  <Button
                    w="full"
                    size="md"
                    bg="cwru"
                    color="white"
                    colorScheme="black"
                    _hover={{
                      backgroundColor: "rgba(10, 48, 78, 0.85)",
                    }}
                  >
                    Subscribe Now
                  </Button>
                </Box>
              </VStack>
            </Box>
          </PriceWrapper>
        </Stack>
      </SlideFade>
    </Box>
  );
}

function PriceWrapper({ children }) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor="gray.200"
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  const user = await prisma.user.findUnique({
    where: { caseId: session.user.caseId },
    select: {
      caseId: true,
      name: true,
      subscription: true,
      canAnswer: true,
      browseLimit: true,
      accountCreated: true,
      courses: true,
    },
  });

  if (!user.courses.length) {
    res.writeHead(302, { Location: "/my-courses" });
    res.end();
    return { props: {} };
  }

  return {
    props: {
      user: {
        ...user,
        accountCreated: user.accountCreated.toISOString(),
      },
    },
  };
}
