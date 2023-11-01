import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCookie } from "typescript-cookie";
import {
  Button,
  Container,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";


export default function FlashcardGenerator () {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const navigate= useNavigate();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const generateFlashcards = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const jwt_token = getCookie("jwt_token")
      const csrftoken = getCookie("csrftoken");
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
          'Authorization': `Bearer ${jwt_token}`,
        },
        withCredentials: true,
      };
      const response = await axios.post('http://127.0.0.1:8000/deck/create/', { content: text }, config);
      console.log(response.data)
      if(response.data.deck_id){
        navigate(`/deck/${response.data.deck_id}`);
      }

    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while generating flashcards.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" p={4} rounded="lg" bg={bgColor} boxShadow="lg" mt={"20px"} >
      <Text fontSize="xl" fontWeight="bold" mb={4}>Flashcard Generator</Text>
      <Textarea
        value={text}
        onChange={(e)=>{
          setText(e.target.value);
        }}
        placeholder="Enter your text here..."
        size="sm"
        mb={4}
        height={'md'}
      />
      <Button
        bg={"orange.500"}
        color={"white"}
        _hover={{
          bg: "blue.500",
        }}
        isLoading={isLoading}
        onClick={generateFlashcards}
        mb={4}
      >
        Generate Flashcards
      </Button>
      {errorMessage && (
        <Text color="red.500" mt={4}>{errorMessage}</Text>
      )}
    </Container>
  );
};


