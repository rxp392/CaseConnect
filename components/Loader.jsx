import { Spinner, Flex } from "@chakra-ui/react";

function Loader() {
  return (
    <Flex justify="center" align="center" height="100vh">
      <Spinner
        thickness="4px"
        speed=".75s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
}

export default Loader;
