import {
  IconButton,
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
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import { FiMenu, FiChevronDown, FiBell } from "react-icons/fi";
import { MdOutlineQuestionAnswer, MdOutlineFeed } from "react-icons/md";
import { BiBookAlt } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { BsQuestionCircle } from "react-icons/bs";

const LinkItems = [
  { name: "Questions", icon: MdOutlineFeed, href: "/questions" },
  {
    name: "Ask a question",
    icon: MdOutlineQuestionAnswer,
    href: "/ask-a-question",
  },
  {
    name: "My Questions",
    icon: BsQuestionCircle,
    href: "/my-questions",
  },
  { name: "My Courses", icon: BiBookAlt, href: "/my-courses" },
];

export default function Sidebar({
  subscription,
  caseId,
  name,
  profileImage,
  children,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={"gray.100"}>
      <SidebarContent
        onClose={() => onClose}
        subscription={subscription}
        display={{ base: "none", md: "block" }}
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
          <SidebarContent onClose={onClose} subscription={subscription} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav
        onOpen={onOpen}
        caseId={caseId}
        name={name}
        profileImage={profileImage}
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
  );
}

const SidebarContent = ({ onClose, subscription, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={"white"}
      borderRight="1px"
      borderRightColor={"gray.200"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          href={link.href}
          onClick={onClose}
        >
          {link.name}
        </NavItem>
      ))}
      <NextLink href="/subscription" passHref>
        <Tag
          pos="absolute"
          bottom="4%"
          cursor="pointer"
          mx="8"
          size="lg"
          borderRadius="full"
          variant="solid"
          bg="cwru"
        >
          {subscription} Plan
        </Tag>
      </NextLink>
    </Box>
  );
};

const NavItem = ({ icon, href, children, ...rest }) => {
  return (
    <NextLink href={href} passHref>
      <Link style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "cwru",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </NextLink>
  );
};

const MobileNav = ({ onOpen, caseId, name, profileImage, ...rest }) => {
  const router = useRouter();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg="white"
      borderBottomWidth={"1px"}
      borderBottomColor={"gray.200"}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
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
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Tooltip
          hasArrow
          label="No new notifications"
          color="white"
          bg="black"
          placement="bottom"
        >
          <IconButton
            size="lg"
            variant="ghost"
            aria-label="open menu"
            icon={<FiBell />}
          />
        </Tooltip>

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
                  <Text fontSize="sm">{caseId}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {name}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg={"white"} borderColor={"gray.200"}>
              <MenuItem onClick={() => router.push("/profile")}>
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
