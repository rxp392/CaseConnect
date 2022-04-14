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
import { MdPayment } from "react-icons/md";

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
  const [isLoading, setIsLoading] = useState(false);
  const isBasic = _user.subscription === "Basic";
  const router = useRouter();
  const { status } = router.query;
  const toast = useToast();

  const basicPlanPerks = [
    `Ask up to ${POST_LIMIT} questions`,
    `View up to ${BROWSE_LIMIT} questions`,
    `Answer up to ${BROWSE_LIMIT} questions`,
  ];
  const premiumPlanPerks = [
    "Ask unlimited questions",
    "View unlimited questions",
    "Answer unlimited questions",
  ];

  useEffect(() => {
    if (status === "success") {
      window.history.replaceState(
        null,
        "",
        `${process.env.NEXT_PUBLIC_URL}/subscription`
      );
    } else if (status === "cancel") {
      window.history.replaceState(
        null,
        "",
        `${process.env.NEXT_PUBLIC_URL}/subscription`
      );
      toast({
        title: "Payment cancelled",
        description: "No payment was made",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
        variant: "left-accent",
      });
    }
  }, [status]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const stripe = await getStripe();
    const checkoutSession = await axios.post(
      "/api/protected/subscription/create-session",
      {}
    );
    await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
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
    if (!isBasic) {
      fire();
    }
  }, []);

  if (!isBasic) {
    return (
      <>
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        <SlideFade in={true} offsetY="20px">
          <Heading fontSize={["lg", "2xl", "3xl"]} textAlign="center">
            Congratulations! You&apos;re a Premium user
          </Heading>
          <Text textAlign={"center"} mt={2} fontSize={["md", "lg", "xl"]}>
            You&apos;re now able to ask, view, and answer unlimited questions
          </Text>
        </SlideFade>
      </>
    );
  }

  return (
    <SlideFade in={true} offsetY="20px">
      <Box py={12} h={"auto"}>
        <Heading
          as="h1"
          fontSize="4xl"
          textAlign="center"
          mt={[16, 16, 0]}
          mb={[6, 6, 0]}
        >
          Payment Plans
        </Heading>
        <Stack
          direction={{ base: "column", md: "row" }}
          textAlign="center"
          justify="center"
          spacing={{ base: 16, lg: 10 }}
          py={[0, 0, 10]}
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
                Most Valuable Plan
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
              </VStack>
            </Box>
          </PriceWrapper>
        </Stack>
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
        p={"1.5rem"}
        transform={"translateY(-2rem)"}
        leftIcon={
          <MdPayment
            style={{
              transform: "scale(1.25)",
            }}
          />
        }
      >
        Upgrade Now
      </Button>
    </SlideFade>
  );
}

function PriceWrapper({ children }) {
  return (
    <Box
      mb={-8}
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

export async function getServerSideProps({ req, res, query }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  let user;

  if (query?.status === "success") {
    user = await prisma.user.update({
      where: { caseId: session.user.caseId },
      data: {
        subscription: "Premium",
      },
      select: {
        caseId: true,
        name: true,
        subscription: true,
        accountCreated: true,
        courses: true,
      },
    });
    return {
      props: {
        _user: {
          ...user,
          accountCreated: user.accountCreated.toISOString(),
        },
      },
    };
  } else {
    user = await prisma.user.findUnique({
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
