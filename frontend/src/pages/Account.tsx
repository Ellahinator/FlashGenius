import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EditIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { getCookie } from "typescript-cookie";
import { Deck } from "../types";
import {
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Stack,
  Flex,
  Center,
  Box,
  Heading,
  useColorModeValue,
  Spinner,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

const Account = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [decks, setDecks] = useState<Deck[]>([]);
  const toast = useToast();
  const navigate = useNavigate();

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const boxColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const jwt_token = getCookie("jwt_token");
        let userInfoResponse = await axios.get(
          "http://127.0.0.1:8000/user-info/",
          {
            headers: { Authorization: `Bearer ${jwt_token}` },
          }
        );
        setEmail(userInfoResponse.data.email);

        let decksResponse = await axios.get("http://127.0.0.1:8000/decks/", {
          headers: { Authorization: `Bearer ${jwt_token}` },
        });
        setDecks(decksResponse.data.decks);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Please login to continue.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          navigate("/login"); // Redirect to login page
        } else {
          toast({
            title: "Error",
            description: "An error occurred while fetching data.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast, navigate]);

  const handlePasswordChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setConfirmPassword(event.target.value);
  }

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The passwords do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    // TODO: Implement password change logic here
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <Flex minH={"100vh"} justify={"center"} bg={bgColor}>
      <Stack
        spacing={8}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
        w={["95%", "80%", "70%"]}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Account Dashboard</Heading>
        </Stack>
        <Box rounded={"lg"} bg={boxColor} boxShadow={"lg"} p={8} w={"100%"}>
          <Stack spacing={4}>
            <Center>
              <Image
                borderRadius="full"
                boxSize="150px"
                src={`${process.env.PUBLIC_URL}/profile_pic.png`}
                alt="Profile Picture"
              />
            </Center>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} isReadOnly />
            </FormControl>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handlePasswordVisibility}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handlePasswordVisibility}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button colorScheme="blue" mt={4} onClick={handleSubmit}>
              Change Password
            </Button>
            <Box mt={8}>
              <Heading fontSize={"2xl"}>Your Decks</Heading>
              {/* Render decks here */}
              {decks.map((deck, index) => (
                <Box key={index} p={4} shadow="md" borderWidth="1px" mt={4}>
                  {deck.deck_name}
                </Box>
              ))}
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Account;
