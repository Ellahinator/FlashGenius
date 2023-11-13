import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from "typescript-cookie";
import { Box, VStack, Text } from "@chakra-ui/react";

interface Deck {
  deck_id: any;
  deck_name: any;
  // any other deck properties you have
}

export default function UserDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const jwt_token = getCookie("jwt_token");
        const response = await axios.get('http://127.0.0.1:8000/decks/', {
          headers: {
            'Authorization': `Bearer ${jwt_token}`
          }
        });
        console.log(response.data);
        setDecks(response.data.decks);
      } catch (error) {
        console.error("Error fetching decks:", error);
        // handle errors, e.g., unauthorized user, no decks, etc.
      }
    };

    fetchDecks();
  }, []);

  return (
    <VStack>
      {decks.map((deck) => (
        <Box key={deck.deck_id} p={5} shadow="md" borderWidth="1px">
          <Text fontSize="xl">{deck.deck_name}</Text>
          {/* You can add more details or actions for each deck here */}
        </Box>
      ))}
    </VStack>
  );
}
