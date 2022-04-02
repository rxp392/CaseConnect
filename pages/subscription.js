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
  SlideFade,
  useToast,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { FaCheckCircle } from "react-icons/fa";
import ReactCanvasConfetti from "react-canvas-confetti";
import { useCallback, useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import getStripe from "utils/getStripe";
import { BROWSE_LIMIT, POST_LIMIT, PREMIUM_PRICE } from "constants";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  transform: "translateX(10%)",
};

export default function Subscription({ _user }) {
  const [user, setUser] = useState(_user);
  const [isLoading, setIsLoading] = useState(false);
  const isBasic = user.subscription === "Basic";
  const router = useRouter();
  const { status } = router.query;
  const toast = useToast();

  const basicPlanPerks = [
    `Ask up to ${POST_LIMIT} Questions`,
    `View up to ${BROWSE_LIMIT} Questions`,
    `Answer up to ${BROWSE_LIMIT} Questions`,
  ];
  const premiumPlanPerks = [
    "Ask unlimited questions",
    "View unlimited questions",
    "Answer unlimited Questions",
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    const stripe = await getStripe();

    const checkoutSession = await axios.post(
      "/api/protected/subscription/create-session",
      {
        caseId: _user.caseId,
      }
    );

    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result.error) {
      // toast
    }

    // await axios.post("/api/protected/subscription/update", {
    //   caseId: _user.caseId,
    // });

    setUser({
      ...user,
      subscription: "Premium",
    });

    // toast
    setIsLoading(false);
  };

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
    let intervalId;
    if (!isBasic) {
      fire();
      intervalId = setInterval(() => {
        fire();
      }, 1500);
    }
    return () => clearInterval(intervalId);
  }, []);

  if (!isBasic) {
    return (
      <>
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        <SlideFade in={true} offsetY="20px">
          <Text fontSize={["lg", "2xl", "3xl"]} textAlign="center">
            Congratulations! You are a Premium user.
          </Text>
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
            <Text
              textTransform="uppercase"
              bg="green.600"
              px={2}
              py={2}
              color="white"
              fontSize="sm"
              fontWeight="600"
              roundedTop="lg"
            >
              Your Current Plan
            </Text>
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
              <Text
                textTransform="uppercase"
                bg="cwru"
                color="white"
                px={2}
                py={2}
                fontSize="sm"
                fontWeight="600"
                roundedTop="lg"
              >
                Most Popular Plan
              </Text>
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="2xl">
                  Premium Plan
                </Text>
                <HStack justifyContent="center" spacing={0.35}>
                  <Text fontSize="3xl" fontWeight="600">
                    $
                  </Text>
                  <Text fontSize="5xl" fontWeight="900">
                    {PREMIUM_PRICE}
                  </Text>
                  <Text fontSize="3xl" fontWeight="900">
                    <sub>.00</sub>
                  </Text>
                </HStack>
              </Box>
              <VStack bg="gray.50" py={4}>
                <List spacing={3} textAlign="start" px={12}>
                  {premiumPlanPerks.map((perk, i) => (
                    <ListItem key={i}>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      {perk}
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </Box>
            <Button
              isFullWidth
              size="md"
              bg="cwru"
              color="white"
              colorScheme="black"
              _hover={{
                backgroundColor: "rgba(10, 48, 78, 0.85)",
              }}
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Loading..."
              roundedBottom="lg"
              roundedTop="none"
            >
              Subscribe Now
            </Button>
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
      borderRadius={"lg"}
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
      _user: {
        ...user,
        accountCreated: user.accountCreated.toISOString(),
      },
    },
  };
}
