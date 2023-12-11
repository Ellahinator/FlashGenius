import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flashcard from "../components/Flashcard";
import { DeckFlashcard } from "../types";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  Textarea,
  useClipboard
} from "@chakra-ui/react";
import { DeleteIcon,EditIcon } from "@chakra-ui/icons";




export default function FlashcardsDisplay() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();
  const { deckId } = useParams();
  const [flashcards, setFlashcards] = useState<DeckFlashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newDeckName, setNewDeckName] = useState("");
  const [showBack, setShowBack] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editTerm, setEditTerm] = useState("");
  const [editDef, setEditDef] = useState("");
  const [editId, setEditId] = useState(0);
  const [exportData, setExportData] = useState("");
  const { hasCopied, onCopy } = useClipboard(exportData);

  const generateExportData = () => {
    let formattedData = flashcards.map(flashcard => `${flashcard.term},${flashcard.definition}`).join(';');
    setExportData(formattedData);
  };

  const handleExport = () => {
    generateExportData();
    onOpen();
  };

  const bgColor = useColorModeValue("gray.50", "gray.700");

  const jwt_token = getCookie("jwt_token");
  const csrftoken = getCookie("csrftoken");
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      Authorization: `Bearer ${jwt_token}`,
    },
    withCredentials: true,
  };

  const saveNewDeckName = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/deck/update/`,
        {
          deck_id: deckId,
          deck_name: newDeckName,
        },
        config
      );
      setSuccessMessage("Deck name updated successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating deck name:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage("Error updating deck name: " + errorMessage);
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    
    fetchFlashcards();
  }, [deckId]);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/deck/get/`,
        { deck_id: deckId },
        config
      );
      console.log("flashcards",response.data.flashcards)
      setFlashcards(response.data.flashcards);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleDelete =async (flashcardId: number) => {
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
      await axios.post('http://127.0.0.1:8000/flashcards/delete/', { flashcard_id: flashcardId }, config);
      fetchFlashcards()
    } catch (error) {
      console.error(error)
    }
    
  }
  const handleEdit =async (flashcardId: number) => {
    try {
      const jwt_token = getCookie("jwt_token")
      const csrftoken = getCookie("csrftoken");
      const config = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
          'Authorization': `Bearer ${jwt_token}`,
        },
        withCredentials: true,
      };
      await axios.put('http://127.0.0.1:8000/flashcards/edit/', { flashcard_id: flashcardId,term:editTerm,definition:editDef }, config);

      onClose()
      fetchFlashcards()
    } catch (error) {
      console.error(error)
    }
    
  }

  const renderFlashcardList = () => {
    return flashcards.map((flashcard, index) => (
      <Flex key={index} justify="center" align="center">
      <Box
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
      <DeleteIcon ml = "15px" color="red" onClick={()=>handleDelete(flashcard.flashcard_id)}/>
      <EditIcon ml ="15px" onClick={()=> handleModalOpen(flashcard.term,flashcard.definition,flashcard.flashcard_id)}/>
      </Flex>
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
  const handleModalOpen = (term:string,definition:string,flashcard_id:number) => {
    onOpen()
    setEditTerm(term)
    setEditDef(definition)
    setEditId(flashcard_id)
  }
  return (
    <>
    <Modal onClose={onClose} size={"lg"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Flashcard</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Input value={editTerm} onChange={(e)=> setEditTerm(e.target.value)}/>
          <Textarea  value={editDef} onChange={(e)=> setEditDef(e.target.value)}/>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
            <Button onClick ={()=> handleEdit(editId)}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    <VStack spacing={4} align="center" marginBottom={20}>
      <Button onClick={() => navigate("/generate")}>
        Back to Flashcard Generator
      </Button>
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
        <Text>
          {currentIndex + 1}/{flashcards.length}
        </Text>
        <Button
          onClick={nextFlashcard}
          isDisabled={currentIndex === flashcards.length - 1}
        >
          →
        </Button>
        <VStack width="100%" align="start"></VStack>
      </VStack>
      <VStack spacing={4} align="center">
        <List spacing={2} w="50%" pt={5}>
          {renderFlashcardList()}
        </List>
      </VStack>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveNewDeckName();
        }}
      >
        <VStack>
          <Input
            placeholder="Enter deck name"
            value={newDeckName}
            onChange={(e) => {
              setNewDeckName(e.target.value);
            }}
            textAlign={"center"}
          />
          <Button
            type="submit"
            bg={"orange.500"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
          >
            Save Deck
          </Button>
          <Button onClick={handleExport}>Export</Button>

    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent >
        <ModalHeader>Export to Quizlet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea height={"lg"} value={exportData} isReadOnly />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onCopy} bg={"orange.500"} color={"white"} _hover={{ bg: "blue.500" }}>
            {hasCopied ? "Copied!" : "Copy"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
        </VStack>
      </form>
      {successMessage && <Text color="green.500">{successMessage}</Text>}
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
    </VStack>
    </>
  );
}