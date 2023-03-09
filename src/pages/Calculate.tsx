import { Box, Button, Container, Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useReducer, useRef, useState } from "react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { QRCode } from 'react-qrcode-logo';
import { getAllowedWeight } from "../helpers/getAllowedWeight";


interface ReducerState {
    tickets: {
        id: string;
        class: string;
        allowedWeight: number
    }[]
}

interface ReducerAction {
    type: Actions;
    payload: any;
}

enum Actions {
    ADD_ITEM = 'ADD_ITEM'
}

const reducer = (state:ReducerState, action:ReducerAction) => {
    switch (action.type) {
      case 'ADD_ITEM':
        return {
          ...state,
          tickets: [...state.tickets, action.payload]
        };
      default:
        return state;
    }
  };

const CalculateBaggage: React.FC = () => {

    const [state, dispatch] = useReducer(reducer, { tickets: [] });
    const [ticketID, setTicketID] = useState<string>("");
    const [ticketClass, setClass] = useState<string>("");

    const [totalWeight, setTotalWeight] = useState<number>(0);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();


    const AddTicket = () => {
        const ticket = {
            id: ticketID,
            class: ticketClass,
            allowedWeight: getAllowedWeight(ticketClass)
        }
        dispatch({ type: Actions.ADD_ITEM, payload: ticket });
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
        const file = pdf.save('your-resume.pdf');
        const blob = file.output('blob')
        console.log(blob); 
  
    }

    return(
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            direction="column"
            padding={2}
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Container width="50%" maxWidth="90%">

                <Stack>
                    <div>
                        <Text>Ticket ID</Text>
                        <Input onChange={(e) => setTicketID(e.target.value)} placeholder="Enter the ticket ID" />
                    </div>

                    <div>
                        <Text>Class</Text>
                        <Select variant={'filled'} onChange={(e) => setClass(e.target.value)}>
                            <option value=""></option>
                            <option value="First-Class">First Class</option>
                            <option value="Business-Class">Business Class</option>
                            <option value="Economy-Class">Economy Class</option>
                        </Select>
                    </div>

                    <Button marginY={2} bg="teal" color="white" onClick={AddTicket}>
                        Add Ticket
                    </Button>

                </Stack>


                <section className="staff-table">
                    <TableContainer>
                        <Table variant='striped' colorScheme='teal'>
                            <Thead>
                                <Tr>
                                    <Th>S/N</Th>
                                    <Th>Ticket ID</Th>
                                    <Th isNumeric>Class</Th>
                                    <Th>Allowed Baggage</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
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
                            <Tfoot>
                                <Tr>
                                    <Th>S/N</Th>
                                    <Th>Transaction ID</Th>
                                    <Th isNumeric>Amount</Th>
                                    <Th>Date</Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>

                </section>

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
                    onClick={onOpen}
                >
                    Generate Invoice
                </Button>

            </Container>
            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Your Invoice</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody ref={invoiceRef}>
                        <QRCode fgColor="#fff" bgColor="#000" value="D002"/>
                        <Text>
                            Excess: {totalWeight - state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)}
                        </Text>

                        <Text>
                            Amount to be Paid: {(totalWeight - state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 100  < 0 ? 0 :(totalWeight - state.tickets.reduce((acc, item) => acc + item.allowedWeight, 0)) * 100}
                        </Text>
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
                            onClick={onClose} 
                            variant='ghost'
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Flex>
    )
}

export default CalculateBaggage;