import { Box, Button, Container, Flex, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useColorModeValue, useDisclosure, useMediaQuery, useToast, VStack } from "@chakra-ui/react";
import { useReducer, useRef, useState } from "react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { QRCode } from 'react-qrcode-logo';
import { getAllowedWeight } from "../helpers/getAllowedWeight";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, firestore } from "../environments/firebase";
import { useAllowedWeights } from '../hooks/useAllowedWeights';
import { generate12CharId } from "../helpers/generateId";
import Logo from '../assets/logo.png';

import { Link } from "react-router-dom";
import styles from '../styles/styles.module.css';
import { MdArrowBack } from "react-icons/md";

import data from './states.json'
interface ReducerState {
    tickets: {
        id: string;
        class: string;
        allowedWeight: number
    }[]
}

interface ReducerAction {
    type: Actions;
    payload?: any;
}

enum Actions {
    ADD_ITEM = 'ADD_ITEM',
    EMPTY_TICKETS = 'EMPTY_TICKETS'
}

const reducer = (state:ReducerState, action:ReducerAction) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
            ...state,
            tickets: [...state.tickets, action.payload]
            };
        case 'EMPTY_TICKETS':
            return {
                ...state,
                tickets: []
            }
        default:
            return state;
    }
};

function generateId() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return randomLetter + randomNumber;
}
  

const CalculateBaggage: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, { tickets: [] });
    const [ticketID, setTicketID] = useState<string>("");
    //Ticket ID eventually named to booking reference
    const [ticketClass, setClass] = useState<string>("");
    const [airport, setAirport] = useState<{
        departure: string,
        arrival: string,
    }>({ departure: "", arrival: "" })

    const [totalWeight, setTotalWeight] = useState<number>(0);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [paymentID, setPaymentID] = useState<string>("");
    
    const transactionsRef = doc(firestore, "transactions", generate12CharId());
    const { allowedWeights } = useAllowedWeights();
    const toast = useToast();

    const [isMobile] = useMediaQuery('(max-width: 450px)')
    
    const AddTicket = () => {
        const ticket = {
            id: ticketID,
            class: ticketClass,
            allowedWeight: allowedWeights?.find((weight) => weight.id === ticketClass)?.allowed_weight!
        }
        dispatch({ type: Actions.ADD_ITEM, payload: ticket });
        setTicketID("");
        setClass("");
    }

    const addTransactionToFirestore = async (amount: number) => {
        if(!totalWeight){
            toast({
                title: "Total Weight not defined",
                position: "top-right",
                status: "error",
                isClosable: true
            })
            return;
        }
        
        const paymentId = generateId();
        setPaymentID(paymentId);

        onOpen();
        try {
            
            await setDoc(transactionsRef, {
                payment_id: paymentId,
                amount,
                date: Timestamp.fromDate(new Date()),
                issued_by: {
                    id: auth.currentUser?.uid!,
                    name: auth.currentUser?.displayName!
                },
                status: "pending",
                tickets: state.tickets,
                booking_reference: state.tickets.map((item) => item.id),
                airports: airport
            })

            toast({
                title: "Successful",
                position: "top-right",
                status: "success",
                isClosable: true
            })
        
        } catch (err) {
            toast({
                title: "Error while adding record",
                position: "top-right",
                status: "error",
                isClosable: true
            })
        
        }   
    }

    const handleModalClose = () => {
        onClose();
        dispatch({ type: Actions.EMPTY_TICKETS })
        setTotalWeight(0);
        setTicketID("")
    }

    const generateInvoice = async () => {
        const element = invoiceRef?.current;
        const canvas = await html2canvas(element!);
        const data = canvas.toDataURL('image/png');
    
        const pdf = new jsPDF('portrait', 'pt', 'a4');
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight =
          (imgProperties.height * pdfWidth) / imgProperties.width;
    
        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        const file = pdf.save(`Payment-${paymentID}.pdf`);
  
    }

    return(
        <Flex
            minH={'100vh'}
            align={'center'}
            direction="column"
            padding={2}
            position="relative"
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Flex position="absolute" top={10} left={15}>
                <Link to="/home">
                    <MdArrowBack size={30}/>
                </Link>
            </Flex>
            <img width="150px" src={Logo} alt="Adman-Logo"/>
            <Flex className={styles.calculateContainer}>
                <Container minWidth="35%" maxWidth="70%">
                    <Stack>
                        <div>
                            <Text>Booking Reference</Text>
                            <Input 
                                value={ticketID}
                                onChange={(e) => setTicketID(e.target.value)} 
                                placeholder="Enter the booking reference" 
                            />
                        </div>

                        <div>
                            <Text>Class</Text>
                            <RadioGroup value={ticketClass} onChange={setClass}>
                                <Stack>
                                    {
                                        allowedWeights?.map((item, index) => (
                                            <Radio key={index} value={item.id}>{item.id.replaceAll('-', ' ')}</Radio>
                                        ))
                                    }
                                </Stack>
                            </RadioGroup>
                        </div>

                        <Button marginY={2} bg="teal" color="white" onClick={AddTicket}>
                            Add Ticket
                        </Button>

                    </Stack>


                    

                    <HStack marginY={3} width="100%" justify={'center'}>
                        <div>
                            <Text>Total Allowed</Text>
                            <Input 
                                placeholder="Total Allowed" 
                                disabled
                                value={state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)}
                            />
                        </div>

                        <div>
                            <Text>Total Weight</Text>
                            <Input 
                                required
                                value={totalWeight}
                                isInvalid={!totalWeight}
                                type="number"
                                onChange={(e:any) => setTotalWeight(e.target.valueAsNumber)} 
                                placeholder="Total Weight of all bags" 
                            />
                        </div>

                        <div>
                            <Text>Excess Weight</Text>
                            <Input 
                                disabled 
                                value={`${totalWeight - state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)}`} placeholder="Total Weight of all bags" />
                        </div>


                    </HStack>
                    <Button
                        width="full"
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        onClick={() => addTransactionToFirestore((totalWeight - state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 100  < 0 ? 0 :(totalWeight - state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 100)}
                    >
                        Generate Invoice
                    </Button>

                </Container>
                <Container minWidth="60%" maxWidth="90%">
                    <Stack 
                        marginY={2}
                        width="100%" 
                        gap="10px" 
                        flexDirection={isMobile ? 'column' : 'row'} align="center"
                    >
                        <div>
                            <Text>Departure</Text>
                            <Select 
                                onChange={(event) => setAirport((previousValue) => ({...previousValue, departure: event.target.value}))}
                                minWidth={isMobile ? "100%":"47%"} placeholder="Select a state">
                                {data.states.map(state => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Text>Arrival</Text>
                            <Select 
                                onChange={(event) => setAirport((previousValue) => ({...previousValue, arrival: event.target.value}))}
                                minWidth={isMobile ? "100%":"47%"} 
                                placeholder="Select a state"
                            >
                                {data.states.map(state => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </Select>
                        </div>

                    </Stack>
                    
                    <section className="staff-table">
                            <TableContainer overflowY={"auto"} maxHeight="250px">
                                <Table variant='striped' colorScheme='teal'>
                                    <Thead position="sticky" top={0} zIndex={999}>
                                        <Tr>
                                            <Th>S/N</Th>
                                            <Th>Booking Reference</Th>
                                            <Th isNumeric>Class</Th>
                                            <Th>Allowed Baggage (KG)</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody zIndex={5}>
                                        {
                                            state.tickets.map((item, index) => (
                                                <Tr key={index}>
                                                    <Td>{index}</Td>
                                                    <Td>{item.id}</Td>
                                                    <Td isNumeric>{item.class}</Td>
                                                    <Td>{item.allowedWeight}</Td>
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>

                        </section>
                </Container>
            </Flex>
            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Your Invoice</ModalHeader>
                    <ModalCloseButton onClick={handleModalClose} />
                    <ModalBody justifyContent={"center"} ref={invoiceRef}>
                        <VStack>
                            <Heading>{paymentID}</Heading>
                            <QRCode 
                                fgColor="#fff" 
                                bgColor="#000" 
                                value={paymentID}
                                //`https://baggage-cost-app.netlify.app/transaction/
                            />

                            <div>
                                <Text textAlign="center">
                                    Excess: {totalWeight - state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)} kg
                                </Text>

                                <Text>
                                    Amount to be Paid: &#8358; {(totalWeight - state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 100  < 0 ? 0 :(totalWeight - state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 1500}
                                </Text>
                            </div>

                            <section className="staff-table">
                                <TableContainer>
                                    <Table variant='striped' colorScheme='teal'>
                                        <Thead position="sticky" top={0}>
                                            <Tr>
                                                <Th>Booking Reference</Th>
                                                <Th>Allowed Baggage (KG)</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                state.tickets.map((item, index) => (
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
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            onClick={generateInvoice} 
                            colorScheme='blue' 
                            mr={3} 
                        >
                            Print Invoice
                        </Button>
                        <Button 
                            onClick={handleModalClose} 
                            variant='ghost'
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
            <Text
                position={"absolute"}
                bottom={15}
                fontFamily="mono"
            >
                Powered by Wheels and Compass &#169; 2023
            </Text>
        </Flex>
    )
}

export default CalculateBaggage;