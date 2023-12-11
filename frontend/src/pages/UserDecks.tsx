import { useEffect, useState } from "react";
import axios from "../axiosInstance";
import { getCookie } from "typescript-cookie";
import { Box, VStack, Text, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Deck } from "../types";
import { DeleteIcon } from "@chakra-ui/icons";

export default function UserDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const response = await axios.get("decks/");
      setDecks(response.data.decks);
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  const handleDelete = async (deck_id: string) => {
    try {
      await axios.post("deck/delete/", { deck_id });
      fetchDecks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack margin={8} minH="100vh">
      {decks.map((deck) => (
        <Flex w="100%" justify="center" align="center" key={deck.deck_id}>
          <Link to={`/deck/${deck.deck_id}`} style={{ width: "70%" }}>
            <Box
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
          <DeleteIcon
            ml="15px"
            color="red"
            onClick={() => handleDelete(deck.deck_id)}
          />
        </Flex>
      ))}
    </VStack>
  );
}
