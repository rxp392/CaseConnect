import {
    Box,
    Text,
    Center,
    Stack,
    Heading,
    Avatar,
    IconButton,
    Button,
    Flex,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useToast,
    Textarea,
    FormControl,
    FormErrorMessage,
    Tooltip,
    Badge,
    Wrap,
    WrapItem,
    useMediaQuery,
    ButtonGroup,
    Divider,
  } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsFillTrashFill } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { useSession } from "next-auth/react";

export default function AnswerCard({
    _answer,
  }) {
    const {
      id,
      answer,
      questionId,
      userCaseId,
      publisherName,
      numThumbsUp,
      numThumbsDown,
      createdAt,
      readOrNot,
    } = _answer;
    // console.log(_Answer)
    // console.log(answer)
    return (
    <Flex>
        <Text fontSize='xl'>
           {answer}
        </Text>
        <Button size='lg' colorScheme='green' mt='24px'>
          Helpful
        </Button>
        <Button size='lg' colorScheme='green' mt='24px'>
          Unhelpful
        </Button>
        <Button size='lg' colorScheme='green' mt='24px'>
          Comment 
        </Button>
    </Flex>
    );
  }