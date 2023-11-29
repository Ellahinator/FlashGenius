import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Nav from "./components/Navbar";
import SignupCard from "./pages/SignUp";
import LoginCard from "./pages/Login";
import Generator from "./pages/Generator";
import FlashcardsDisplay from "./pages/FlashcardsDisplay";
import UserDecks from "./pages/UserDecks";
import Footer from "./components/Footer";
import { useState , useEffect } from "react";
import { getCookie , removeCookie, setCookie} from "typescript-cookie";

export const App = () => {
  const [token,setToken] = useState<string>('');
  useEffect(()=> {
    const jwt_token = getCookie("jwt_token")
    if (jwt_token){
      setToken(jwt_token)
    }

  }, [])
  const logout = ()=>{
    setToken('')
    removeCookie("jwt_token");
  }
  const login = (token:string)=>{
    setCookie("jwt_token", token);
    setToken(token)
  }
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Nav token={token} logout={logout}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupCard />} />
            <Route path="/login" element={<LoginCard login = {login}/>} />
            <Route path="/account" element={<Account />} />
            <Route path="/generate" element={<Generator />} />
            <Route path="/deck/:deckId" element={<FlashcardsDisplay />} />
            <Route path="/myDecks" element={<UserDecks />} />
            <Route path="*" element={"404"} />
          </Routes>
        </Box>
        <Footer />
      </ChakraProvider>
    </BrowserRouter>
  );
};
