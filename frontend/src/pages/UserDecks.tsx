import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "typescript-cookie";
import { Box, VStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Deck } from "../types";

export default function UserDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const jwt_token = getCookie("jwt_token");
        const response = await axios.get("http://127.0.0.1:8000/decks/", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        });
        console.log(response.data);
        setDecks(response.data.decks);
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };

    fetchDecks();
  }, []);

  return (
    <VStack margin={8}>
      {decks.map((deck) => (
        <Link to={`/deck/${deck.deck_id}`} style={{ width: "70%" }}>
          <Box
            key={deck.deck_id}
            p={5}
            shadow="md"
            borderWidth="1px"
            _hover={{ bg: "gray.100" }}
            transition="background-color 0.2s"
          >
            <Text fontSize="xl">{deck.deck_name}</Text>
            <Text fontSize="sm">{deck.term_count} Terms</Text>
          </Box>
        </Link>
      ))}
    </VStack>
  );
}
