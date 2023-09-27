import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Nav from "./components/Navbar";
import SignupCard from "./pages/SignUp";
import LoginCard from "./pages/Login";
import Flashcard from "./components/Flashcard";

export const App = () => {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Nav />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/signup" element={<SignupCard />} />
            <Route path="/login" element={<LoginCard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/flashcardtest" element={<Flashcard front="WW2" back="World War II or the Second World War, often abbreviated as WWII or WW2, was a global conflict that lasted from 1939 to 1945. The vast majority of the world's countries, including all of the great powers, fought as part of two opposing military alliances: the Allies and the Axis." />} />
            <Route path="*" element={"404"} />
          </Routes>
        </Box>
      </ChakraProvider>
    </BrowserRouter>
  );
};
