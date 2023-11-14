import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Flashcard from "../components/Flashcard";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getCookie } from "typescript-cookie";
import {
  Button,
  Text,
  useColorModeValue,
  VStack,
  List,
  Input,
  Box,
  SimpleGrid,

} from "@chakra-ui/react";

interface DeckFlashcard {
    term: string;
    definition: string;
  }

export default function FlashcardsDisplay () {
    const navigate = useNavigate();
    const { deckId } = useParams(); 
    const [flashcards, setFlashcards] = useState<DeckFlashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newDeckName, setNewDeckName] = useState('');
    const [showBack, setShowBack] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState('');

    const bgColor = useColorModeValue('gray.50', 'gray.700');

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
    
    const saveNewDeckName = async () => {
      try {
        await axios.post(`http://127.0.0.1:8000/deck/update/`, {
          deck_id: deckId,
          deck_name: newDeckName
        }, config);
        setSuccessMessage('Deck name updated successfully!');
        setErrorMessage('');
      } catch (error:any) {
        console.error("Error updating deck name:", error);
        setErrorMessage('Error updating deck name: ' + error.message); 
        setSuccessMessage('');
      }
    };
  
    useEffect(() => {
      const fetchFlashcards = async () => {
        try {
         
          const response = await axios.post(`http://127.0.0.1:8000/deck/get/`, {deck_id:deckId},config);
          setFlashcards(response.data.flashcards);
        } catch (error) {
          console.error("Error fetching flashcards:", error);
        }
      };
  
      fetchFlashcards();
    }, [deckId]);

    const renderFlashcardList = () => {
      return flashcards.map((flashcard, index) => (
        <Box
          key={index}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          mb={2}
          boxShadow="sm" 
          bg={bgColor} 
        >
          <SimpleGrid columns={2} spacing={10}>
            <Box fontWeight="bold">{flashcard.term}</Box>
            <Box>{flashcard.definition}</Box>
          </SimpleGrid>
        </Box>
      ));
    };
  
    const nextFlashcard = () => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowBack(false); 
      }
    };
  
    const prevFlashcard = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setShowBack(false); 
      }
    };
  
    return (
      <VStack spacing={4} align="center" marginBottom={20}>
        <Button onClick={() => navigate('/generate')}>Back to Flashcard Generator</Button>
        <Flashcard 
          front={flashcards[currentIndex]?.term} 
          back={flashcards[currentIndex]?.definition}
          showBack={showBack}
          toggleCard={() => setShowBack(!showBack)}
        />
        <VStack spacing={2}>
          <Button onClick={prevFlashcard} isDisabled={currentIndex === 0}>
            ←
          </Button>
          <Text>{currentIndex + 1}/{flashcards.length}</Text>
          <Button onClick={nextFlashcard} isDisabled={currentIndex === flashcards.length - 1}>
            →
          </Button>
          <VStack width="100%" align="start">
    </VStack>
        </VStack>
        <VStack spacing={4} align="center">
      <List spacing={2} w="50%" pt={5}>
        {renderFlashcardList()}
      </List>
    </VStack>
    <form onSubmit={(e) => {
        e.preventDefault();
        saveNewDeckName();
      }}>
        <VStack>
          <Input
            placeholder="Enter deck name"
            value={newDeckName}
            onChange={(e)=>{
              setNewDeckName(e.target.value)
            }}
            textAlign={"center"}
          />
          <Button type="submit" 
          bg={"orange.500"}
          color={"white"}
          _hover={{
            bg: "blue.500",
          }}>
            Save Deck 
          </Button>
        </VStack>
      </form>
      {successMessage && (
        <Text color="green.500">{successMessage}</Text>
      )}
      {errorMessage && (
        <Text color="red.500">{errorMessage}</Text>
      )}
      </VStack>
    );
  };
  

