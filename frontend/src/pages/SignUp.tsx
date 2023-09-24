"use client";

import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { getCookie } from "typescript-cookie";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    setIsLoading(true);
    setErrorMessage("");
    e.preventDefault();
    let csrftoken = await getCookie("csrftoken");
    try {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        withCredentials: true,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/signup/",
        formData,
        config
      );
      if ((response.data as any).status === "success") {
        console.log("Registration successful.");
        navigate("/");
      } else {
        console.log("An error occurred:", response.data.message);
        setErrorMessage(response.data.message || "An error occurred.");
      }
      setIsLoading(false);
    } catch (error: unknown) {
      // Handle error
      if (error instanceof Error) {
        console.error("There was an error sending the data", error);
        setErrorMessage(error.message || "An error occurred.");
      } else {
        console.error("An unknown error occurred", error);
        setErrorMessage("An unknown error occurred.");
      }
      setIsLoading(false);
    }
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Flex
      minH={"100vh"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} py={12} px={6} w={"lg"}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign up</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" name="username" onChange={handleChange} />
              </FormControl>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" name="email" onChange={handleChange} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password1"
                  onChange={handleChange}
                />
                <InputRightElement>
                  <Button
                    variant={"ghost"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password2"
                  onChange={handleChange}
                />
                <InputRightElement>
                  <Button
                    variant={"ghost"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Text fontSize={"sm"} color="red">
              {errorMessage && <p>{errorMessage}</p>}
            </Text>
            <Stack spacing={10}>
              <Button
                isLoading={isLoading}
                loadingText="Signing up..."
                bg={"orange.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSubmit}
              >
                Sign up
              </Button>
            </Stack>
            <Stack>
              <Text align={"center"}>
                Already a user?{" "}
                <ChakraLink
                  as={ReactRouterLink}
                  to="/login"
                  color={"orange.400"}
                >
                  Login
                </ChakraLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
