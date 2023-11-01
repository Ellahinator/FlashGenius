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
  VStack
} from "@chakra-ui/react";

interface DeckFlashcard {
    term: string;
    definition: string;
  }

export default function FlashcardsDisplay () {
    const navigate = useNavigate();
    const { deckId } = useParams(); // Assuming you're using deck_id as a route parameter
    const [flashcards, setFlashcards] = useState<DeckFlashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);
  
    useEffect(() => {
      const fetchFlashcards = async () => {
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
          const response = await axios.post(`http://127.0.0.1:8000/deck/get/`, {deck_id:deckId},config);
          console.log(response.data)
          setFlashcards(response.data.flashcards);
        } catch (error) {
          console.error("Error fetching flashcards:", error);
        }
      };
  
      fetchFlashcards();
    }, [deckId]);
  
    const nextFlashcard = () => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowBack(false); // Reset to front side on next card
      }
    };
  
    const prevFlashcard = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setShowBack(false); // Reset to front side on prev card
      }
    };
  
    return (
      <VStack spacing={4} align="center">
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
        </VStack>
      </VStack>
    );
  };
  

