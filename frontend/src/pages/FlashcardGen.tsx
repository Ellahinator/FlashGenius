import { useState, useEffect } from "react";
import { Textarea, Button, Flex, Grid, Text, Spinner } from "@chakra-ui/react";
import Flashcard from "../components/Flashcard";

export default function FlashcardGen() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState<
    { term: string; definition: string }[]
  >([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  // Mock data
  const inputData =
    "An array is a number of elements in a specific order, typically all of the same type (depending on the language, individual elements may either all be forced to be the same type, or may be of almost any type). Elements are accessed using an integer index to specify which element is required. Typical implementations allocate contiguous memory words for the elements of arrays (but this is not always a necessity). Arrays may be fixed-length or resizable. A linked list (also just called list) is a linear collection of data elements of any type, called nodes, where each node has itself a value, and points to the next node in the linked list. The principal advantage of a linked list over an array is that values can always be efficiently inserted and removed without relocating the rest of the list. Certain other operations, such as random access to a certain element, are however slower on lists than on arrays. A record (also called tuple or struct) is an aggregate data structure. A record is a value that contains other values, typically in fixed number and sequence and typically indexed by names. The elements of records are usually called fields or members. In the context of object-oriented programming, records are known as plain old data structures to distinguish them from objects.[11] Hash tables, also known as hash maps, are data structures that provide fast retrieval of values based on keys. They use a hashing function to map keys to indexes in an array, allowing for constant-time access in the average case. Hash tables are commonly used in dictionaries, caches, and database indexing. However, hash collisions can occur, which can impact their performance. Techniques like chaining and open addressing are employed to handle collisions.";
  const generateFlashcards = () => {
    setLoading(true);
    setTimeout(() => {
      const flashcardsContent = [
        {
          term: "Array",
          definition:
            "A collection of elements in a specific order, often of the same type, accessed by integer indexes.",
        },
        {
          term: "Linked List",
          definition:
            "A linear data structure consisting of nodes, where each node contains a value and a reference to the next node; allows efficient insertions and removals.",
        },
        {
          term: "Record",
          definition:
            "An aggregate data structure that stores values, typically in a fixed sequence, often indexed by names; also known as a tuple or struct.",
        },
        {
          term: "Hash Table (or Hash Map)",
          definition:
            "Data structures that use a hashing function to map keys to indexes in an array, enabling fast value retrieval based on keys; commonly used in dictionaries, caches, and databases; may encounter collisions.",
        },
        {
          term: "Hash Collision",
          definition:
            "A situation where two different keys in a hash table produce the same hash code, potentially affecting the performance; resolved using techniques like chaining or open addressing.",
        },
      ];
      setFlashcards(flashcardsContent);
      setLoading(false);
    }, 1000); // Simulate API call
  };
  const nextFlashcard = () => {
    setCurrentFlashcardIndex(
      (prevIndex) => (prevIndex + 1) % flashcards.length
    );
  };

  const prevFlashcard = () => {
    setCurrentFlashcardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      minHeight={"100vh"}
    >
      <Text fontSize="3xl">Flashcard Generator</Text>
      <Grid>
        <Textarea
          placeholder=""
          value={inputData}
          onChange={(e) => setText(e.target.value)}
          disabled
          size={"lg"}
          minHeight={"300px"}
          maxWidth={"800px"}
        />
        <Flex flexDirection="column" alignItems="center">
          <Button
            onClick={generateFlashcards}
            isLoading={loading}
            marginTop={"4"}
          >
            Generate Flashcards
          </Button>
          {flashcards.length > 0 && (
            <>
              <Flex marginTop={4}>
                <Button
                  onClick={prevFlashcard}
                  disabled={flashcards.length === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={nextFlashcard}
                  disabled={flashcards.length === 0}
                >
                  Next
                </Button>
              </Flex>
              <Text marginTop={4}>
                {currentFlashcardIndex + 1}/{flashcards.length}
              </Text>
            </>
          )}
        </Flex>
        <Flex
          flexDirection="column"
          alignItems={{ base: "center", lg: "flex-start" }}
        >
          {flashcards.length > 0 && (
            <Flashcard
              front={flashcards[currentFlashcardIndex].term}
              back={flashcards[currentFlashcardIndex].definition}
            />
          )}
        </Flex>
      </Grid>
    </Flex>
  );
}
