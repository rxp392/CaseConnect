import {
  Wrap,
  WrapItem,
  SlideFade,
  Flex,
  Heading,
  IconButton,
  Button,
  ButtonGroup,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import QuestionCard from "components/QuestionCard";
import { usePagination } from "react-use-pagination";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { useRef, useState } from "react";

export default function CardPage({ questions, setQuestions, title }) {
  const { data: session } = useSession();
  const cancelRef = useRef();
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const {
    currentPage,
    totalPages,
    setNextPage,
    setPreviousPage,
    nextEnabled,
    previousEnabled,
    startIndex,
    endIndex,
    setPage,
  } = usePagination({
    totalItems: questions.length,
    initialPageSize: 4,
  });

  return (
    <>
      <FilterDialog
        isFilterDialogOpen={isFilterDialogOpen}
        setIsFilterDialogOpen={setIsFilterDialogOpen}
        cancelRef={cancelRef}
      />

      <Flex
        justify="space-between"
        align="center"
        direction="column"
        h="full"
        w="full"
        p={2}
        overflowX="hidden"
        overflowY={"scroll"}
        pos="relative"
      >
        <SlideFade in={true} offsetY="20px">
          <Heading textAlign="center">{title}</Heading>
        </SlideFade>
        <SlideFade in={true} offsetY="20px">
          <Wrap justify="center" spacing="30px">
            {questions.slice(startIndex, endIndex + 1).map((question) => (
              <WrapItem key={question.id}>
                <QuestionCard
                  _question={question}
                  isUser={session?.user.caseId === question.userCaseId}
                  questions={questions}
                  setQuestions={setQuestions}
                />
              </WrapItem>
            ))}
          </Wrap>
        </SlideFade>

        <SlideFade in={true} offsetY="20px">
          <Flex justify="center" align="center" gap={2}>
            <IconButton
              onClick={setPreviousPage}
              isDisabled={!previousEnabled}
              icon={<AiOutlineArrowLeft />}
              variant="outline"
              color="cwru"
              borderColor="cwru"
              bg="gray.100"
              _hover={
                previousEnabled && {
                  bg: "gray.200",
                }
              }
            />
            <ButtonGroup isAttached variant="outline">
              {[...Array(totalPages).keys()].map((i) => (
                <Button
                  key={i + 1}
                  isDisabled={i === currentPage}
                  color="cwru"
                  borderColor="cwru"
                  bg="gray.100"
                  _hover={
                    i !== currentPage && {
                      bg: "gray.200",
                    }
                  }
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Button>
              ))}
            </ButtonGroup>
            <IconButton
              variant="outline"
              color="cwru"
              borderColor="cwru"
              bg="gray.100"
              _hover={
                nextEnabled && {
                  bg: "gray.200",
                }
              }
              onClick={setNextPage}
              isDisabled={!nextEnabled}
              icon={<AiOutlineArrowRight />}
            />
          </Flex>
        </SlideFade>

        <Tooltip label="Filter results" placement="left">
          <IconButton
            icon={<BsFilter />}
            pos="absolute"
            top="0"
            right="0"
            m={2}
            size="md"
            variant="outline"
            color="cwru"
            borderColor="cwru"
            bg="gray.100"
            _hover={{
              bg: "gray.200",
            }}
            onClick={() => setIsFilterDialogOpen(true)}
          />
        </Tooltip>
      </Flex>
    </>
  );
}

function FilterDialog({
  isFilterDialogOpen,
  setIsFilterDialogOpen,
  cancelRef,
}) {
  return (
    <AlertDialog
      isOpen={isFilterDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsFilterDialogOpen(false)}
      isCentered
      returnFocusOnClose={false}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Question
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete your question?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => setIsFilterDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              loadingText="Deleting..."
              spinnerPlacement="end"
              // isLoading={isLoading}
              onClick={() => {}}
              ml={3}
            >
              Ok
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
