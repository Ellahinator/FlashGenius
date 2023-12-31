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
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { AxiosError } from "axios";
import axios from "../axiosInstance";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { LoginCardProps } from "../types";

export default function LoginCard({ login }: LoginCardProps) {
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
    try {
      const response = await axios.post("/auth/login/", formData);

      if (response.data.status === "success") {
        let access_token = response.data.access_token;
        let refresh_token = response.data.refresh_token;
        login(access_token, refresh_token);
        const protectedRouteResponse = await axios.get("/protected/", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (protectedRouteResponse.data.message === "You are authenticated.") {
          console.log("Authenticated");
          navigate("/generate");
        } else {
          console.error("Error accessing protected route");
        }
      } else {
        console.error("An error occurred:", response.data.message);
      }

      setIsLoading(false);
    } catch (error) {
      if ((error as AxiosError).response) {
        let errorType = (error as AxiosError<{ message: string }>).response
          ?.data?.message;
        setErrorMessage(errorType || "");
      }
      // Handle error
      else if (error instanceof Error) {
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
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="username" isRequired>
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
            {errorMessage && (
              <Text color={"red.500"} fontSize={"sm"} align={"start"}>
                {errorMessage}
              </Text>
            )}
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
                mb={"0"}
              >
                Login
              </Button>
              <Text align={"center"} fontSize={"md"}>
                Don't have an account?{" "}
                <Text
                  as={ReactRouterLink}
                  to="/signup"
                  color={"blue.400"}
                  fontSize={"sm"}
                >
                  Sign Up
                </Text>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
