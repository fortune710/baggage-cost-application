//import { BleClient } from '@capacitor-community/bluetooth-le';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../environments/firebase';

interface FormFields {
  email: string;
  password: string;
}

  
function LoginCard() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormFields>({
    email: '',
    password: '',
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const signIn = async () => {
    setLoading(true);
    try {
      const {user} = await signInWithEmailAndPassword(auth, form.email, form.password);
      const ref = doc(firestore, 'users', user.uid);
      await updateDoc(ref, {
        last_login: Timestamp.fromDate(new Date())
      })

      setLoading(false);
      toast({
        title: "Login Sucessful",
        position: "top-right",
        status: "success",
        isClosable: true
      })
      navigate('/home');

    } catch (err:any) {
      setLoading(false);
      toast({
        title: err.code,
        position: "top-right",
        status: "error",
        isClosable: true
      })


    }
  }

  return (
    <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
    >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>

            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input  
                  type="email" 
                  onChange={(e:any) => setForm({ ...form, email: e.target.value })} 
                  required
                />
              </FormControl>

              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input 
                  type="password" 
                  onChange={(e:any) => setForm({ ...form, password: e.target.value })} 
                  required

                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  isLoading={isLoading}
                  onClick={signIn}
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
}

const LoginPage: React.FC = () => {

 
    return(
        <main>
            <LoginCard/>
        </main>
    )
}


export default LoginPage;