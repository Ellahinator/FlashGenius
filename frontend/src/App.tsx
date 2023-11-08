import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Nav from "./components/Navbar";
import SignupCard from "./pages/SignUp";
import LoginCard from "./pages/Login";
import MockGenerator from "./pages/MockGenerator";
import { createContext, useState } from "react";


export const UserContext = createContext({loggedIn:false});

export const App = () => {
const [loggedIn,setLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <UserContext.Provider value={{loggedIn:loggedIn}}>
        <ChakraProvider theme={theme}>
          <Box textAlign="center" fontSize="xl">
            <Nav setLoggedIn ={setLoggedIn} loggedIn = {loggedIn}/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignupCard />} />
              <Route path="/login" element={<LoginCard setLoggedIn ={setLoggedIn} />} />
              <Route path="/account" element={<Account />} />
              <Route path="/generate" element={<MockGenerator />} />
              <Route path="*" element={"404"} />
            </Routes>
          </Box>
        </ChakraProvider>
      </UserContext.Provider>
    </BrowserRouter>
  );
};
