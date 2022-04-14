import {
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  SlideFade,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { BiBookAlt, BiQuestionMark } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { AiOutlineHistory, AiOutlineHome } from "react-icons/ai";
import { IoCheckmarkSharp } from "react-icons/io5";
import { BsCardText } from "react-icons/bs";
import axios from "axios";
import useSwr from "swr";
import NotificationCard from "./NotificationCard";
import { useState, useRef, useEffect } from "react";
import { GrClear } from "react-icons/gr";
import { BROWSE_LIMIT, POST_LIMIT } from "constants";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const LinkItems = [
  {
    name: "Home",
    icon: AiOutlineHome,
    href: "/questions",
  },
  {
    name: "Ask",
    icon: BiQuestionMark,
    href: "/ask-a-question",
  },
  {
    name: "Questions",
    icon: BsCardText,
    href: "/my-questions",
  },
  {
    name: "Courses",
    icon: BiBookAlt,
    href: "/my-courses",
  },
  {
    name: "Answers",
    icon: IoCheckmarkSharp,
    href: "/my-answers",
  },
  {
    name: "View History",
    icon: AiOutlineHistory,
    href: "/view-history",
  },
];

export default function Sidebar({ caseId, children }) {
  const { data, mutate } = useSwr(
    `/api/protected/user?caseId=${caseId}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [notificationAlertOpen, setNotificationAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const cancelRef = useRef();
  const [questions, setQuestions] = useState(0);
  const [views, setViews] = useState(0);

  useEffect(() => {
    const { id, courseId } = router.query;
    const filteredNotifications = (data?.user?.notifications || []).filter(
      (_notification) =>
        _notification.courseId !== Number(courseId) &&
        _notification.questionId !== Number(id)
    );
    setNotifications(filteredNotifications);
    setQuestions(data?.user?.questions.length || 0);
    setViews(data?.user?.viewHistory.length || 0);
    if (data) {
      setHasLoaded(true);
    }
  }, [data, router]);

  useEffect(() => {
    mutate();
  }, [router]);

  const getBadgeColor = (number, limit) => {
    if (number == limit) {
      return "red";
    } else if (number > limit / 2) {
      return "yellow";
    } else {
      return "green";
    }
  };

  return (
    <>
      <Box minH="100vh" bg={"gray.100"}>
        <SidebarContent
          onClose={() => onClose}
          subscription={data?.user.subscription}
          display={{ base: "none", md: "block" }}
          router={router}
          questions={questions}
          views={views}
          BROWSE_LIMIT={BROWSE_LIMIT}
          POST_LIMIT={POST_LIMIT}
          getBadgeColor={getBadgeColor}
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent
              onClose={onClose}
              subscription={data?.user.subscription}
              router={router}
              questions={questions}
              views={views}
              BROWSE_LIMIT={BROWSE_LIMIT}
              POST_LIMIT={POST_LIMIT}
              getBadgeColor={getBadgeColor}
            />
          </DrawerContent>
        </Drawer>
        <MobileNav
          onOpen={onOpen}
          caseId={caseId}
          name={data?.user.name}
          profileImage={data?.user.profileImage}
          router={router}
          notifications={notifications}
          setNotificationAlertOpen={setNotificationAlertOpen}
          hasLoaded={hasLoaded}
        />
        <Flex
          ml={{ base: 0, md: 60 }}
          p="4"
          justify="center"
          align="center"
          height="calc(100vh - 5rem)"
          overflow="scroll"
        >
          {children}
        </Flex>
      </Box>

      <NotificationAlert
        notificationAlertOpen={notificationAlertOpen}
        setNotificationAlertOpen={setNotificationAlertOpen}
        cancelRef={cancelRef}
        notifications={notifications}
        setNotifications={setNotifications}
        userCaseId={caseId}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </>
  );
}

const SidebarContent = ({
  onClose,
  subscription,
  router,
  questions,
  views,
  BROWSE_LIMIT,
  POST_LIMIT,
  getBadgeColor,
  ...rest
}) => {
  return (
    <Box
      color="white"
      bg={"white"}
      transition="3s ease"
      borderRight="1px"
      borderRightColor={"gray.200"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="4" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold" color="black">
          Case Connect
        </Text>
        <CloseButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
          color="black"
        />
      </Flex>
      <Flex
        mx="-2"
        h="full"
        alignItems="start"
        justifyContent="start"
        flexDirection="column"
        gap={2.5}
      >
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            href={link.href}
            onClick={onClose}
            router={router}
          >
            {link.name}
          </NavItem>
        ))}
      </Flex>

      {subscription === "Basic" ? (
        <SlideFade in={true} offsetY="20px">
          <NextLink href="/subscription" passHref>
            <Link
              pos="absolute"
              bottom="3%"
              mx="4"
              px={2}
              py={1}
              color="black"
              textDecoration="underline"
            >
              Basic Plan
            </Link>
          </NextLink>
          <Badge
            cursor="default"
            pos="absolute"
            bottom="8%"
            mx="4"
            px={2}
            py={1}
            variant="solid"
            fontWeight={"400"}
            fontSize="sm"
            rounded="md"
            colorScheme={getBadgeColor(views, BROWSE_LIMIT)}
          >
            <strong>
              {views}/{BROWSE_LIMIT} Questions Viewed
            </strong>{" "}
          </Badge>
          <Badge
            cursor="default"
            pos="absolute"
            bottom="13%"
            mx="4"
            px={2}
            py={1}
            variant="solid"
            fontWeight={"400"}
            fontSize="sm"
            rounded="md"
            colorScheme={getBadgeColor(questions, POST_LIMIT)}
          >
            <strong>
              {questions}/{POST_LIMIT} Questions Asked
            </strong>
          </Badge>
        </SlideFade>
      ) : (
        <SlideFade in={true} offsetY="20px">
          <Text
            pos="absolute"
            bottom="3%"
            mx="4"
            px={2}
            py={1}
            color="black"
            cursor={"default"}
          >
            Premium Plan
          </Text>
        </SlideFade>
      )}
    </Box>
  );
};

const NavItem = ({ icon, href, children, router, ...rest }) => {
  const isActive = router.pathname === href;

  return (
    <NextLink href={href} passHref>
      <Link
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
        color="black"
        w="full"
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor={isActive ? "default" : "pointer"}
          fontWeight={isActive ? "extrabold" : "none"}
          fontSize={"md"}
          _hover={
            !isActive && {
              bg: "gray.200",
            }
          }
          {...rest}
        >
          {icon && <Icon mr="4" fontSize={isActive ? "20" : "16"} as={icon} />}
          {children}
        </Flex>
      </Link>
    </NextLink>
  );
};

const MobileNav = ({
  onOpen,
  caseId,
  name,
  profileImage,
  router,
  notifications,
  setNotificationAlertOpen,
  hasLoaded,
  ...rest
}) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 2.5, md: 4 }}
      height="20"
      alignItems="center"
      borderBottomWidth={"1px"}
      borderBottomColor={"gray.200"}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
      bg="white"
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize={["lg", "xl"]}
        fontFamily="monospace"
        fontWeight="bold"
      >
        Case Connect
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {hasLoaded && (
          <Button
            isDisabled={notifications.length === 0}
            onClick={() => setNotificationAlertOpen(true)}
            size="md"
            variant="ghost"
            fontSize={["xs", "md"]}
          >
            {notifications.length > 0 ? notifications.length : "No"}{" "}
            Notification
            {notifications.length !== 1 ? "s" : ""}
          </Button>
        )}

        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={profileImage}
                  name={name}
                  bg="cwru"
                  color="white"
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {caseId}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg={"white"} borderColor={"gray.200"}>
              <MenuItem onClick={() => router.push("/my-profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => router.push("/subscription")}>
                Subscription
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() =>
                  signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_URL}` })
                }
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

function NotificationAlert({
  notificationAlertOpen,
  setNotificationAlertOpen,
  cancelRef,
  notifications,
  setNotifications,
  userCaseId,
  isLoading,
  setIsLoading,
}) {
  return (
    <AlertDialog
      isOpen={notificationAlertOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setNotificationAlertOpen(false)}
      isCentered
      trapFocus={false}
      scrollBehavior={"inside"}
    >
      <AlertDialogOverlay>
        <SlideFade in={true} offsetY="20px">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Notifications
            </AlertDialogHeader>
            <AlertDialogBody>
              <Tooltip label="Clear">
                <IconButton
                  icon={<GrClear />}
                  pos="absolute"
                  top="0"
                  right="0"
                  variant="ghost"
                  size="sm"
                  m={1}
                  onClick={async () => {
                    await axios.delete(
                      "/api/protected/notifications/delete-all",
                      {
                        userCaseId,
                      }
                    );
                    setNotifications([]);
                    setNotificationAlertOpen(false);
                  }}
                  isDisabled={isLoading}
                />
              </Tooltip>
              <Flex direction="column" align="center" justify="center" gap={2}>
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    setNotificationAlertOpen={setNotificationAlertOpen}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    notifications={notifications}
                    setNotifications={setNotifications}
                  />
                ))}
              </Flex>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                colorScheme="blue"
                ref={cancelRef}
                onClick={() => setNotificationAlertOpen(false)}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </SlideFade>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
