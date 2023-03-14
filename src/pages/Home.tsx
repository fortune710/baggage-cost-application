import {
    Button,
    FormControl,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    Grid,
    GridItem,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    Spacer,
    HStack,
    Skeleton,
    useDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    useToast
} from '@chakra-ui/react';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../environments/firebase';
import { usePayment } from '../hooks/usePayment';
import { useStaff } from '../hooks/useStaffTransaction';



export default function UserHome(): JSX.Element {
    const [paymentId, setPaymentId] = useState<string>("");
    const [newTotalWeight, setTotalWeight] = useState<number>(0);
    const navigate = useNavigate();
    const  { transaction: data, isLoading } = useStaff(auth.currentUser?.uid!);
    const { transaction: payment, isLoading: paymentLoading, error } = usePayment(paymentId);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();


    const updateAmount = async (docId: string, newAmount: number) => {
        const ref = doc(firestore, 'transactions', docId);
        
        try {
            await updateDoc(ref, {
                amount: newAmount
            })

            toast({
                title: "Update Sucessful",
                position: "top-right",
                status: "success",
                isClosable: true
            })
        
            onClose();
        } catch (err) {
            toast({
                title: "Update Failed",
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
        direction="column"
        padding={2}
        gap={30}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        
        <Button onClick={() => navigate('/calculate')}>
            New Transaction
        </Button>

        <HStack>
            <Input
                onChange={(e) => setPaymentId(e.target.value)}
                type="search"
                placeholder="Enter 4 character code eg.D001"
            />
            <Button onClick={onOpen}>
                Search
            </Button>
        </HStack>
        

        <section className="staff-table">
            <TableContainer overflowY={"auto"} maxHeight="300px">
                <Table variant='striped' colorScheme='teal'>
                    {!isLoading && data.length === 0 && <TableCaption>Make a new transaction</TableCaption>}
                    <Thead>
                        <Tr>
                            <Th>S/N</Th>
                            <Th>Transaction ID</Th>
                            <Th isNumeric>Amount</Th>
                            <Th>Date</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            isLoading ? (
                            <Tr>
                                <Td>
                                    <Skeleton/>
                                </Td>
                                <Td>
                                    <Skeleton/>
                                </Td>
                                <Td>
                                    <Skeleton/>
                                </Td>
                                <Td>
                                    <Skeleton/>
                                </Td>
                            </Tr>
                            ) :
                            data.map((transaction, index) => (
                                <Tr key={transaction.id}>
                                    <Td>{index}</Td>
                                    <Td>{transaction.id}</Td>
                                    <Td isNumeric>{transaction.amount}</Td>
                                    <Td>{""}</Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                    {
                        !isLoading && data.length > 6 ?
                        <Tfoot>
                            <Tr>
                                <Th>S/N</Th>
                                <Th>Transaction ID</Th>
                                <Th isNumeric>Amount</Th>
                                <Th>Date</Th>
                            </Tr>
                        </Tfoot>
                        : null
                    }
                </Table>
            </TableContainer>

        </section>



        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Your Invoice</ModalHeader>
                <ModalCloseButton />
                <ModalBody justifyContent={"center"}>

                    <VStack>
                        <Heading>{paymentId}</Heading>
                        <section className="staff-table">
                            <TableContainer maxWidth="100%">
                                <Table variant='striped' colorScheme='teal'>
                                    <Thead position="sticky" top={0}>
                                        <Tr>
                                            <Th>Ticket ID</Th>
                                            <Th>Allowed Baggage (KG)</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            payment[0]?.tickets.map((item, index) => (
                                                <Tr key={index}>
                                                    <Td>{item.id}</Td>
                                                    <Td>{item.allowedWeight}</Td>
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </section>

                        <Text>
                            Amount to be Paid: &#8358; {(newTotalWeight - payment[0]?.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 100  < 0 ? 0 :(newTotalWeight - payment[0]?.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 1500}
                        </Text>


                        <HStack marginY={3} width="100%" justify={'center'}>
                            <div>
                                <Text>Total Allowed</Text>
                                <Input 
                                    placeholder="Total Allowed" 
                                    disabled
                                    value={payment[0]?.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)}
                                />
                            </div>

                            <div>
                                <Text>Total Weight</Text>
                                <Input 
                                    type="number"
                                    onChange={(e:any) => setTotalWeight(e.target.valueAsNumber)} 
                                    placeholder="Total Weight of all bags" 
                                />
                            </div>

                            <div>
                                <Text>Excess Weight</Text>
                                <Input 
                                    disabled 
                                    value={`${newTotalWeight - payment[0]?.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)}`} placeholder="Total Weight of all bags" />
                            </div>
                        </HStack>


                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        //Should generate invoice too
                        onClick={() => updateAmount(payment[0].id, 
                            (newTotalWeight - payment[0].tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 100  < 0 ? 0 :(newTotalWeight - payment[0].tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 1500
                        )} 
                        colorScheme='blue' 
                        mr={3} 
                    >
                        Update Amount
                    </Button>
                    <Button 
                        onClick={onClose} 
                        variant='ghost'
                    >
                        Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>


    </Flex>
    );
}