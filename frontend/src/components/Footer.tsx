import React from "react";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";

export default function Footer() {
  const bgColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Flex as="footer" align="center" justify="center" h="12" bg={bgColor}>
      <Text fontSize="sm">© 2023 FlashGenius.</Text>
    </Flex>
  );
}
