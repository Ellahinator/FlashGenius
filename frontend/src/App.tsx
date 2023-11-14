import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Nav from "./components/Navbar";
import SignupCard from "./pages/SignUp";
import LoginCard from "./pages/Login";
import Generator from "./pages/Generator";
import FlashcardsDisplay from "./pages/FlashcardsDisplay";
import UserDecks from "./pages/UserDecks";

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
            <Route path="/generate" element={<Generator />} />
            <Route path="/deck/:deckId" element={<FlashcardsDisplay />} />
            <Route path="/myDecks" element={<UserDecks/>}/>
            <Route path="*" element={"404"} />
          </Routes>
        </Box>
      </ChakraProvider>
    </BrowserRouter>
  );
};
