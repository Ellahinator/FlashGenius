"use client";

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Image,
  Link,
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
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    removeCookie("jwt_token");
    navigate("/login")
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/login");
  };

  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Link href="/">
              <Image src="logo256.png" boxSize="48px" objectFit="cover" />
            </Link>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7} align="center">
              <Link href="#" style={{ fontSize: "1rem" }}>
                Features
              </Link>
              <Link href="#" style={{ fontSize: "1rem" }}>
                Pricing
              </Link>
              <Link href="#" style={{ fontSize: "1rem" }}>
                About
              </Link>
              <Link href="#" style={{ fontSize: "1rem" }}>
                Contact
              </Link>

              {isLoggedIn ? (
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
                    <Link href="/myDecks">
                      <MenuItem>My Decks</MenuItem>
                    </Link>
                    <Link href="/account">
                      <MenuItem>Account Settings</MenuItem>
                    </Link>
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
