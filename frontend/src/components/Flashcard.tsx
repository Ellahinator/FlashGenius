import React, {useState} from "react";
import { Card, Text } from '@chakra-ui/react'

interface FlashcardProps {
  front: string;
  back: string;
}

const Flashcard = ({ front, back }: FlashcardProps) => {
    const [showBack, setShowBack] = useState(false);

  const toggleCard = () => {
    setShowBack(!showBack);
  };
    return (
        <Card
          p={4}
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          bg="white"
          onClick={toggleCard} 
        _hover={{
            boxShadow: "lg",
            transform: "scale(1.02)",
            cursor: "pointer", 
        }}
        // maxWidth="400px"
        width="500px"
        height="300px"
        margin="5px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        >
    <Text fontSize="30px" fontWeight="bold" color={"black"} display={showBack ? "none" : "block"} >
             {front}
        </Text>
        <Text mt={2} color={"black"} display={showBack ? "block" : "none"}>
            {back}
        </Text>
        </Card>
      );
};

export default Flashcard;
