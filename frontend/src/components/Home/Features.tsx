import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, ViewIcon, ExternalLinkIcon } from "@chakra-ui/icons";

export default function Features() {
  const bgColor = useColorModeValue("gray.100", "gray.900");

  return (
    <Box py="24" px="6" textAlign="center" bg={bgColor}>
      <Heading as="h2" size="2xl" fontWeight="bold" mb="8">
        Features
      </Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap="8">
        <GridItem textAlign="center">
          <EditIcon w={16} h={16} mb="4" />
          <Heading as="h3" size="xl" mb="2">
            Customize
          </Heading>
          <Text>
            Customize your flashcards with personalized texts and images.
          </Text>
        </GridItem>
        <GridItem textAlign="center">
          <ViewIcon w={16} h={16} mb="4" />
          <Heading as="h3" size="xl" mb="2">
            Generate
          </Heading>
          <Text>
            Create your flashcard decks and generate them in an instant.
          </Text>
        </GridItem>
        <GridItem textAlign="center">
          <ExternalLinkIcon w={16} h={16} mb="4" />
          <Heading as="h3" size="xl" mb="2">
            Share
          </Heading>
          <Text>Share your flashcard decks with friends or the community.</Text>
        </GridItem>
      </Grid>
    </Box>
  );
}
