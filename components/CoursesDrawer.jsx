import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Select,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
  Stack,
  useToast,
} from "@chakra-ui/react";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios(url).then((res) => res.data);

export default function CoursesDrawer({
  isLoading,
  setIsLoading,
  setIsSubmitted,
  showDrawer,
  setShowDrawer,
  tags,
  setTags,
  name,
}) {
  const toast = useToast();
  const { data } = useSWR("/api/protected/courses", fetcher);

  return (
    <Drawer
      isOpen={showDrawer}
      size="md"
      closeOnOverlayClick={false}
      onClose={() => setShowDrawer(false)}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Hey there, {name}!</DrawerHeader>
        <DrawerBody>
          <FormControl>
            <FormLabel htmlFor="courseName">
              Choose up to 10 courses to get started
            </FormLabel>
            <Select
              placeholder={"CWRU courses"}
              id="courseName"
              onChange={(e) => {
                if (tags.length < 10) {
                  const [courseName, id] = e.target.value.split("|");
                  setTags([
                    ...new Set([
                      {
                        courseName,
                        id,
                      },
                      ...tags,
                    ]),
                  ]);
                } else {
                  toast({
                    title: "Select up to 10 courses for now",
                    description: `Click "Add Courses" to continue`,
                    variant: "left-accent",
                    position: "top",
                    status: "info",
                    duration: 6000,
                    isClosable: true,
                  });
                }
              }}
            >
              {data?.courses.map(({ id, courseName }) => (
                <option key={id} value={`${courseName}|${id}`}>
                  {courseName}
                </option>
              ))}
            </Select>
          </FormControl>
          <Stack spacing={5} mt={6}>
            {tags.map(({ courseName, id }) => (
              <Tag
                key={id}
                bg="cwru"
                color="white"
                w="fit-content"
                py="1"
                px="2"
              >
                <TagLabel>{courseName}</TagLabel>
                <TagCloseButton
                  color="white"
                  transform="scale(1.1)"
                  id={id}
                  onClick={(e) => {
                    let _id;
                    if (e.target.parentElement.id) {
                      _id = e.target.parentElement.id;
                    } else {
                      _id = e.target.parentElement.parentElement.id;
                    }
                    setTags(tags.filter((_tag) => _tag.id !== _id));
                  }}
                />
              </Tag>
            ))}
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <Button
            isLoading={isLoading}
            type="submit"
            loadingText={tags.length === 1 ? "Adding Course" : "Adding Courses"}
            spinnerPlacement="end"
            size="md"
            bg="cwru"
            color="white"
            colorScheme="black"
            _active={{
              transform: "scale(0.95)",
            }}
            isDisabled={tags.length === 0}
            onClick={() => {
              setIsLoading(true);
              setIsSubmitted(true);
            }}
          >
            Add Course{tags.length > 1 && "s"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
