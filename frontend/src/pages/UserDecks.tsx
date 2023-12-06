import { useEffect, useState } from "react";
import axios from "axios";
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
      const jwt_token = getCookie("jwt_token");
      console.log({jwt_token})
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

  const handleDelete =async (deck_id: string) => {
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
      await axios.post('http://127.0.0.1:8000/deck/delete/', { deck_id: deck_id }, config);
      fetchDecks()
    } catch (error) {
      console.error(error)
    }
    
  }
  return (
    <VStack margin={8}>
      {decks.map((deck) => (
        <Flex w = "100%" justify = "center" align = "center" key={deck.deck_id}>
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
        <DeleteIcon ml = "15px" color="red" onClick={()=> handleDelete(deck.deck_id)}/>
        </Flex>
      ))}
    </VStack>
  );
}
