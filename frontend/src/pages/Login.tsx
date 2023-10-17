"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";


export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
        "http://127.0.0.1:8000/login/",
        formData,
        config
      );
      if ((response.data as any).status === "success") {
        console.log("You are now logged in");
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
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          {/* <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Text color={'blue.400'}>features</Text> ✌️
          </Text> */}
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="username" isRequired >
              <FormLabel>Username</FormLabel>
              <Input type="text" name="username" onChange={handleChange} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
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
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Text color={"blue.400"} fontSize={"md"}>
                  Forgot password?
                </Text>
              </Stack>
              <Button
                isLoading={isLoading}
                loadingText="Logging in..."
                bg={"orange.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSubmit}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
