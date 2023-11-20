import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Testimonials() {
  const bgColor = useColorModeValue("orange.400", "orange.500");
  return (
    <Box py="24" px="6" bg={bgColor} textAlign="center">
      <Heading as="h2" size="2xl" fontWeight="bold" mb="8" color="gray.100">
        Testimonials
      </Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap="8">
        <GridItem>
          <Text mb="4" color="gray.100">
            "This flashcard generator has been a game-changer for my studies."
          </Text>
          <Text fontWeight="bold" color="gray.100">
            - User 1
          </Text>
        </GridItem>
        <GridItem>
          <Text mb="4" color="gray.100">
            "I love the customization options. It makes studying a lot more
            interesting."
          </Text>
          <Text fontWeight="bold" color="gray.100">
            - User 2
          </Text>
        </GridItem>
        <GridItem>
          <Text mb="4" color="gray.100">
            "Sharing flashcards with my study group has never been easier."
          </Text>
          <Text fontWeight="bold" color="gray.100">
            - User 3
          </Text>
        </GridItem>
      </Grid>
    </Box>
  );
}
