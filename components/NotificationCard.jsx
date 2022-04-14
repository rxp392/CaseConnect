import {
  Flex,
  Box,
  IconButton,
  Text,
  Badge,
  Link,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import NextLink from "next/link";
import { IoCheckmarkSharp } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import { useRouter } from "next/router";

export default function NotificationCard({
  notification,
  setNotificationAlertOpen,
  isLoading,
  setIsLoading,
  notifications,
  setNotifications,
}) {
  const {
    id,
    question,
    type,
    notifierName,
    notifierCaseId,
    createdAt,
    questionId,
    courseId,
  } = notification;

  const router = useRouter();

  const getBadgeColor = (_type) => {
    switch (_type) {
      case "answer":
        return "green";
      case "update":
        return "blue";
      case "upvote":
        return "green";
      case "downvote":
        return "yellow";
    }
  };

  return (
    <Flex
      justify="space-between"
      borderBottom="1px solid #cdcdcd"
      p={1}
      w="full"
      direction="column"
    >
      <Flex direction="column" w="full" fontSize="sm">
        <Flex w="full" textAlign="left" align="center" gap={1}>
          <Badge fontSize="xs" colorScheme={getBadgeColor(type)} rounded="sm">
            {type === "update" ? "Answer Change" : type}
          </Badge>{" "}
          from{" "}
          <NextLink href={`/profile/${notifierCaseId}`} passHref>
            <Link onClick={() => setNotificationAlertOpen(false)}>
              {notifierName}
            </Link>
          </NextLink>
        </Flex>
        <Box w="full" textAlign="left" mt={0.5}>
          <Text fontStyle="italic" isTruncated>
            {question}
          </Text>
        </Box>
      </Flex>

      <Flex justify="space-between" align="center" w="full" mt={-1}>
        <Text fontSize="sm">
          {new Date(createdAt).toLocaleDateString("en-us")}
        </Text>
        <Flex align="end" justify="end">
          <ButtonGroup isAttached>
            <Tooltip label="Ok">
              <IconButton
                icon={<IoCheckmarkSharp />}
                variant="ghost"
                size="sm"
                onClick={async () => {
                  setIsLoading(true);
                  await axios.delete(
                    "/api/protected/notifications/delete-one",
                    {
                      data: {
                        id,
                      },
                    }
                  );
                  const newNotifications = notifications.filter(
                    (_notification) => _notification.id !== id
                  );
                  setNotifications(newNotifications);
                  setIsLoading(false);
                  if (!newNotifications.length) {
                    setNotificationAlertOpen(false);
                  }
                }}
                isDisabled={isLoading}
              />
            </Tooltip>
            <Tooltip label="View">
              <IconButton
                icon={<FiEye />}
                variant="ghost"
                size="sm"
                onClick={async () => {
                  setIsLoading(true);
                  await axios.delete(
                    "/api/protected/notifications/delete-one",
                    {
                      data: {
                        id,
                      },
                    }
                  );
                  setNotifications(
                    notifications.filter(
                      (_notification) => _notification.id !== id
                    )
                  );
                  router.push(
                    `/question?id=${questionId}&courseId=${courseId}`
                  );
                  setIsLoading(false);
                  setNotificationAlertOpen(false);
                }}
                isDisabled={isLoading}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>
      </Flex>
    </Flex>
  );
}
