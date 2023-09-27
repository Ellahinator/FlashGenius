import { useState, useEffect } from "react";
import { EditIcon } from '@chakra-ui/icons'
import {
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
  Box
} from "@chakra-ui/react";


const Account = () => {
  const [formData, setFormData] = useState({
    firstName: "Berk",
    lastName: "Gulay",
    email: "berkgulay@htht",
    password: "12345",
    profilePicture: "profile.png",
  });
  const [isEditing , setIsEditing ] = useState(false)
  return (
    <div>
        <Flex p = {6} direction={"column"} align={"center"}> 
      <h1>Account Settings</h1>
      <Image 
  borderRadius='full'
  boxSize='150px'
  src={`${process.env.PUBLIC_URL}/${formData.profilePicture}`}
  alt='Profile Pic'
/>
<Flex justify={"flex-end"}> 
<EditIcon/>
</Flex>
      <FormControl>
        <FormLabel>First Name</FormLabel>
        <Input type="text" name="firstName" readOnly= {!isEditing ? true :false} value={formData.firstName} />
      </FormControl>
      <FormControl>
        <FormLabel>Last Name</FormLabel>
        <Input type="text" name="lastName" readOnly= {!isEditing ? true :false} value={formData.lastName} />
      </FormControl>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input type="email" name="email" readOnly= {!isEditing ? true :false} value={formData.email} />
      </FormControl>
      <Button colorScheme="blue" mt={4} >Change Password</Button>

      </Flex>
    </div>
  );
};
export default Account;
