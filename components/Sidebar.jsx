import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
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
} from "@chakra-ui/react";
import { FiHome, FiMenu, FiChevronDown } from "react-icons/fi";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { IoSchoolOutline } from "react-icons/io5";
import { BiBookAlt } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import NextLink from "next/link";

const LinkItems = [
  { name: "Home", icon: FiHome, href: "/home" },
  { name: "Ask a question", icon: MdOutlineQuestionAnswer, href: "/ask" },
  { name: "Questions", icon: BiBookAlt, href: "/questions" },
  { name: "Courses", icon: IoSchoolOutline, href: "/courses" },
];

export default function Sidebar({
  children,
  username,
  fullName,
  subscription,
  avatar,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
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
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav
        onOpen={onOpen}
        username={username}
        fullName={fullName}
        avatar={avatar}
      />
      <Flex
        ml={{ base: 0, md: 60 }}
        p="4"
        justify="center"
        align="center"
        height="calc(100vh - 5rem)"
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
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
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
          size="md"
          borderRadius="full"
          variant="solid"
          colorScheme="linkedin"
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
            bg: "cyan.400",
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

const MobileNav = ({ onOpen, username, fullName, avatar, ...rest }) => {
  const router = useRouter();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth={"1px"}
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
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
                  src={`/avatars/${avatar?.replace(/\s+/g, "")}.png`}
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{username}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {fullName}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => router.push("/profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => router.push("/subscription")}>
                Subscription
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={async () => {
                  const { url } = await signOut({
                    redirect: false,
                    callbackUrl: "/",
                  });
                  router.push(url);
                }}
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
