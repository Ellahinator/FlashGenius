"use client";

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Image,
  Link as ChakraLink,
  LinkProps,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { removeCookie } from "typescript-cookie";
import {useNavigate, Link as ReactRouterLink } from "react-router-dom";

interface NavProps{
  token:string;
  logout:()=> void;
}

export default function Nav({token,logout}:NavProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
    navigate("/login")
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
          <ChakraLink as ={ReactRouterLink} to ="/">
              <Image src="logo256.png" boxSize="48px" objectFit="cover" />
            </ChakraLink>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7} align="center">
              <ChakraLink as ={ReactRouterLink} to ="#" style={{ fontSize: "1rem" }}>
                Features
              </ChakraLink>
              <ChakraLink as ={ReactRouterLink} to ="#" style={{ fontSize: "1rem" }}>
                Pricing
              </ChakraLink>
              <ChakraLink as ={ReactRouterLink} to ="#" style={{ fontSize: "1rem" }}>
                About
              </ChakraLink>
              <ChakraLink as ={ReactRouterLink} to ="#" style={{ fontSize: "1rem" }}>
                Contact
              </ChakraLink>

              {token ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar
                        size={"2xl"}
                        src={
                          "https://avatars.dicebear.com/api/male/username.svg"
                        }
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>Username</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <ChakraLink as ={ReactRouterLink} to="/myDecks">
                      <MenuItem>My Decks</MenuItem>
                    </ChakraLink>
                    <ChakraLink as ={ReactRouterLink} to ="/account">
                      <MenuItem>Account Settings</MenuItem>
                    </ChakraLink>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  colorScheme="orange"
                  bg="orange.400"
                  _hover={{ bg: "orange.500" }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}
              <Button onClick={toggleColorMode} background={"transparent"}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
