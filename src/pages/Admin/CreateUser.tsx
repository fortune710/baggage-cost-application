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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth, firestore } from '../../environments/firebase';

interface FormFields {
    name: string;
    email: string;
    password: string;
}

  
function AddUserCard() {
    const [form, setForm] = useState<FormFields>({
        email: '',
        password: '',
        name: '',
    });
    const toast = useToast();

    const addNewUser = async ({ email, password, name }: FormFields) => {

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            const ref = doc(firestore, 'users', user.uid);
            
            await Promise.all([
                await setDoc(ref, {
                    name,
                    email,
                    id: user.uid,
                    last_login: null,
                    password: password,
                    role: 'user',
                    last_logout: null,
                }),
                await updateProfile(user, { displayName: name })
            ])
    
            toast({
                title: "User created",
                position: "top-right",
                status: "success",
                isClosable: true
            })
    
            
        } catch (error:any) {
            //console.log(error);

            toast({
                title: error.code,
                position: "top-right",
                status: "error",
                isClosable: true
            })

        }
    }
    


    return (
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Create New User</Heading>
        </Stack>
        <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
        <Stack spacing={4}>
            <FormControl id="full_name">
                <FormLabel>Full Name</FormLabel>
                <Input 
                    required 
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    type="text" 
                />
            </FormControl>

            <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input 
                    required
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    type="email"
                />
            </FormControl>

            <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input 
                    type="password" 
                    required
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
            </FormControl>

            <Stack spacing={10}>
                <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}>
                </Stack>
                <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                        bg: 'blue.500',
                    }}
                    onClick={() => addNewUser(form)}
                >
                    Add User
                </Button>
            </Stack>
        </Stack>
        </Box>
    </Stack>
    );
}

const AddUserPage: React.FC = () => {
    return(
        <main>
            <AddUserCard/>

        </main>
    )
}


export default AddUserPage;