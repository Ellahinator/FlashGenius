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
import { useState, useContext,Dispatch,SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

interface NavProps {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  loggedIn:boolean
}

const  Nav: React.FC<NavProps>= ({setLoggedIn,loggedIn}) =>  {
  const ctx = useContext(UserContext)
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode} background={"transparent"}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              {ctx.loggedIn ? (
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
                    <MenuItem>Your Servers</MenuItem>
                    <Link href="/account">
                      <MenuItem>Account Settings</MenuItem>
                    </Link>
                    <MenuItem onClick={() =>{ 
                      setLoggedIn(false);
                      navigate("/")
                      } }>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  colorScheme="orange"
                  bg="orange.400"
                  _hover={{ bg: "orange.500" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
export default Nav
