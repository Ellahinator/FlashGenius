import { useState } from "react";
import { Card, Text, useColorModeValue } from "@chakra-ui/react";

interface FlashcardProps {
  front: string;
  back: string;
  showBack: boolean;
  toggleCard: () => void;
}

const Flashcard = ({ front, back, showBack, toggleCard }: FlashcardProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Card
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      bg={bgColor}
      borderColor={borderColor}
      onClick={toggleCard}
      _hover={{
        boxShadow: "lg",
        transform: "scale(1.02)",
        cursor: "pointer",
      }}
      width="500px"
      height="300px"
      margin="20px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text
        fontSize="30px"
        fontWeight="bold"
        color={textColor}
        display={showBack ? "none" : "block"}
      >
        {front}
      </Text>
      <Text mt={2} color={textColor} display={showBack ? "block" : "none"}>
        {back}
      </Text>
    </Card>
  );
};

export default Flashcard;
