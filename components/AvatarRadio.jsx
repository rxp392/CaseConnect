import {
  Avatar,
  Box,
  Center,
  Tooltip,
  useRadio,
  useRadioGroup,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const { name } = props.children.props;

  return (
    <Tooltip hasArrow label={name} color="white" bg="black">
      <WrapItem>
        <Center>
          <Box as="label">
            <input {...input} />
            <Box
              {...checkbox}
              cursor="pointer"
              borderWidth="1px"
              borderRadius="100%"
              boxShadow="lg"
              _checked={{
                bg: "green.200",
                borderColor: "green.200",
              }}
              px={2}
              py={2}
              mb={1}
              mt={-3}
            >
              {props.children}
            </Box>
          </Box>
        </Center>
      </WrapItem>
    </Tooltip>
  );
}

function AvatarRadio({ currentAvatar, setAvatar }) {
  const options = [
    {
      name: "Gordon Ramsay",
      src: "/avatars/GordonRamsay.png",
    },
    {
      name: "Martha Stewart",
      src: "/avatars/MarthaStewart.png",
    },
    {
      name: "Anton Ego",
      src: "/avatars/AntonEgo.png",
    },
    {
      name: "Guy Fieri",
      src: "/avatars/GuyFieri.png",
    },
    {
      name: "Remy the Rat",
      src: "/avatars/RemyTheRat.png",
    },
    {
      name: "Bob Belcher",
      src: "/avatars/BobBelcher.png",
    },
    {
      name: "Wolfgang Puck",
      src: "/avatars/WolfgangPuck.png",
    },
    {
      name: "Rachael Ray",
      src: "/avatars/rachaelRay.png",
    },
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    defaultValue: currentAvatar || "Gordon Ramsay",
    onChange: (avatar) => setAvatar(avatar),
  });

  const group = getRootProps();

  return (
    <Wrap spacing="30px" justify="center" {...group}>
      {options.map(({ name, src }) => {
        const radio = getRadioProps({ value: name });
        return (
          <RadioCard key={name} {...radio}>
            <Avatar name={name} src={src} />
          </RadioCard>
        );
      })}
    </Wrap>
  );
}

export default AvatarRadio;
