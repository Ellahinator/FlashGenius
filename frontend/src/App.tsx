import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Home from "./pages/Home";
import Nav from "./components/Navbar";

export const App = () => {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={"404"} />
          </Routes>
        </Box>
      </ChakraProvider>
    </BrowserRouter>
  );
};
