
import { useState, useEffect } from "react";
import { EditIcon } from '@chakra-ui/icons'
import { 
  CloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  ButtonGroup,
  Image,
  Stack,
  Flex,
  Center,
  Box,
  Heading,
  useColorModeValue
} from "@chakra-ui/react";


const Account = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePicture: "",
  });
  const [isEditing , setIsEditing ] = useState(false)
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData , [event.target.name]:event.target.value})
  }
  return (
    <Flex
    minH={"100vh"}
    justify={"center"}
    bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w = {["95%","80%","70%"]}>
        <Stack align={"center"}>
         <Heading fontSize={"4xl"}>Account Settings</Heading>

        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w = {"100%"}
        >
        <Stack spacing={4}>
          <Center>

      <Image
  borderRadius='full'
  boxSize='150px'
  src={`${process.env.PUBLIC_URL}/profile_pic.png`}
  alt='Profile Pic'
/></Center>
<Flex justify={"flex-end"}> 
{ !isEditing ?<EditIcon onClick={()=> setIsEditing(true)}/> : <CloseButton onClick={()=> setIsEditing(false)}/> }
</Flex>
      <FormControl>
        <FormLabel>First Name</FormLabel>
        <Input type="text" name="firstName" readOnly= {!isEditing ? true :false} value={formData.firstName} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Last Name</FormLabel>
        <Input type="text" name="lastName" readOnly= {!isEditing ? true :false} value={formData.lastName} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input type="email" name="email" readOnly= {!isEditing ? true :false} value={formData.email} onChange={handleChange} />
      </FormControl>
      {isEditing && <Button colorScheme="blue" mt={4} >Submit Changes</Button>} 

      </Stack>
      </Box>
      </Stack>
    </Flex>
  );
};
export default Account;

