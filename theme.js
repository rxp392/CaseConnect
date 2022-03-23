import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "IBM Plex Sans",
    heading: "IBM Plex Sans",
  },
  colors: {
    cwru: "#0a304e",
  },
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          _checked: {
            bg: "cwru",
            borderColor: "cwru",
            _hover: {
              bg: "rgba(10, 48, 78, 0.85)",
            },
          },
        },
      },
    },
  },
});

export default theme;
