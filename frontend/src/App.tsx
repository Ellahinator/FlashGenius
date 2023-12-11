import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Nav from "./components/Navbar";
import SignupCard from "./pages/SignUp";
import LoginCard from "./pages/Login";
import Generator from "./pages/Generator";
import FlashcardsDisplay from "./pages/FlashcardsDisplay";
import UserDecks from "./pages/UserDecks";
import Footer from "./components/Footer";

const AppContent = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const jwt_token = getCookie("jwt_token");
    if (jwt_token) {
      setToken(jwt_token);
    }

    const handleUnauthorized = () => {
      logout();
      navigate("/login");
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  const logout = () => {
    setToken("");
    removeCookie("jwt_token");
    removeCookie("refresh_token");
    navigate("/");
  };

  const login = (access_token: string, refresh_token: string) => {
    setCookie("jwt_token", access_token, { path: "/" });
    setCookie("refresh_token", refresh_token, { path: "/" });
    setToken(access_token);
  };

  return (
    <Box textAlign="center" fontSize="xl">
      <Nav token={token} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupCard login={login} />} />
        <Route path="/login" element={<LoginCard login={login} />} />
        <Route path="/account" element={<Account />} />
        <Route path="/generate" element={<Generator />} />
        <Route path="/deck/:deckId" element={<FlashcardsDisplay />} />
        <Route path="/myDecks" element={<UserDecks />} />
        <Route path="*" element={"404"} />
      </Routes>
      <Footer />
    </Box>
  );
};

export const App = () => (
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <AppContent />
    </ChakraProvider>
  </BrowserRouter>
);
