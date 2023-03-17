import { 
    TableContainer, 
    Table, Thead, 
    Tr, Th, Tbody, 
    Td, 
    Text, Tfoot, 
    Skeleton, 
    TableCaption, HStack, Button, Input, useDisclosure, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react"
import { useState } from "react";
import { useBookingRefernce } from "../../hooks/useBookingReference";
import { useTransaction } from "../../hooks/useTransaction"

const PaymentsPage: React.FC = () => {
    const { transaction, isLoading, error } = useTransaction();
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [bookingRefrenceQuery, setBookingRefrence] = useState<string>("")
    const [searchText, setSearchText] = useState<string>("")
    const { transaction: transactionFromBookingRef } = useBookingRefernce(bookingRefrenceQuery)

    const searchUsingBookingRefernce = () => {
        setBookingRefrence(searchText);
        onOpen()
    }

    return (
        <>
            <HStack>
                <Input
                    onChange={(e) => setSearchText(e.target.value)}
                    type="search"
                    placeholder="Enter booking reference"
                />
                <Button onClick={searchUsingBookingRefernce}>
                    Search
                </Button>
            </HStack>

            <section className="staff-table">
                <TableContainer>
                    <Table variant='striped' colorScheme='teal'>
                        { error && <TableCaption>Error While Loading Data</TableCaption>}
                        <Thead>
                            <Tr>
                                <Th>S/N</Th>
                                <Th>Transaction ID</Th>
                                <Th>Booking Refrence</Th>
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
                                        <Td>
                                            <Skeleton/>
                                        </Td>
                                    </Tr>
                                ) :
                                transaction.map((transaction, index) => (
                                    transaction.tickets?.map((ticket) => (
                                        <Tr key={`${transaction.id}-${ticket.id}-${index}-${ticket.class}`}>
                                            <Td>{index}</Td>
                                            <Td>{transaction.id}</Td>
                                            <Td>{ticket.id}</Td>
                                            <Td isNumeric>{transaction.amount}</Td>
                                            <Td>{""}</Td>
                                        </Tr> 
                                    ))
                                ))
                            }
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>S/N</Th>
                                <Th>Transaction ID</Th>
                                <Th>Booking Reference</Th>
                                <Th isNumeric>Amount</Th>
                                <Th>Date</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </section>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent minWidth="75%">
                    <ModalHeader>Your Invoice</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody justifyContent={"center"}>
                        {
                            transactionFromBookingRef?.map((data) => (
                                <>
                                
                                <VStack>
                                    <Heading>{data.payment_id}</Heading>
                                    <section className="staff-table">
                                        <TableContainer maxWidth="100%">
                                            <Table variant='striped' colorScheme='teal'>
                                                <Thead position="sticky" top={0}>
                                                    <Tr>
                                                        <Th>S/N</Th>
                                                        <Th>Booking Reference</Th>
                                                        <Th>Allowed Baggage (KG)</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        data?.tickets.map((item, index) => (
                                                            <Tr key={item.id}>
                                                                <Td>{index}</Td>
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
                                        Amount to be Paid: &#8358; {data.amount}
                                    </Text>

                                </VStack>
                                </>
                            ))
                        }

                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            onClick={onClose} 
                            variant='ghost'
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default PaymentsPage;