import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Nav from "./components/Navbar";
import SignupCard from "./pages/SignUp";
import LoginCard from "./pages/Login";
import Flashcard from "./components/Flashcard";
import FlashcardGen from "./pages/FlashcardGen";

export const App = () => {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupCard />} />
            <Route path="/login" element={<LoginCard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/flashcardgen" element={<FlashcardGen />} />
            <Route path="*" element={"404"} />
          </Routes>
        </Box>
      </ChakraProvider>
    </BrowserRouter>
  );
};
