import { 
    TableContainer, 
    Table, Thead, 
    Tr, Th, Tbody, 
    Td, 
    Spinner,
    Text, Tfoot, 
    Skeleton, 
    TableCaption, HStack, Button, Input, useDisclosure, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack, Flex } from "@chakra-ui/react"
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import Loading from "../../components/Loading";
import { useBookingRefernce } from "../../hooks/useBookingReference";
import { useTransaction } from "../../hooks/useTransaction"

const PaymentsPage: React.FC = () => {
    const { transaction, isLoading, error } = useTransaction();
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [bookingRefrenceQuery, setBookingRefrence] = useState<string>("")
    const [searchText, setSearchText] = useState<string>("")
    const { transaction: transactionFromBookingRef, isLoading: isLoadingBooking } = useBookingRefernce(bookingRefrenceQuery)

    const searchUsingBookingRefernce = (e:any) => {
        e.preventDefault();
        setBookingRefrence(searchText);
        onOpen()
    }

    return (
        <>
            <HStack onSubmit={searchUsingBookingRefernce} as={"form"} gap="20px" marginY="1rem">
                <Input
                    onChange={(e) => setSearchText(e.target.value)}
                    type="search"
                    placeholder="Enter booking reference"
                    minWidth="40%"
                    maxWidth="50%"
                />
                <Button 
                    color="white"
                    bgColor="blue.500" 
                >
                    Search
                </Button>
            </HStack>

            <section className="staff-table">
                <TableContainer maxHeight="400px" overflowY="auto">
                    <Table variant='striped' colorScheme='teal'>
                        { error ? <TableCaption>Error While Loading Data</TableCaption> : null}
                        <Thead>
                            <Tr>
                                <Th>S/N</Th>
                                <Th>Transaction ID</Th>
                                <Th>Booking Refrence</Th>
                                <Th>Destination</Th>
                                <Th>Arrival</Th>
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
                                        <Td>
                                            <Skeleton/>
                                        </Td>
                                        <Td>
                                            <Skeleton/>
                                        </Td>
                                    </Tr>
                                ) :
                                transaction?.map(({ id, amount, date, tickets, airports }, index) => (
                                    tickets?.map((ticket) => (
                                        <Tr key={`${id}-${ticket.id}-${index}-${ticket.class}`}>
                                            <Td>{index}</Td>
                                            <Td>{id}</Td>
                                            <Td>{ticket.id}</Td>
                                            <Td>{airports?.departure ?? "N/A"}</Td>
                                            <Td>{airports?.arrival ?? "N/A"}</Td>
                                            <Td isNumeric>{amount}</Td>
                                            <Td>{new Timestamp(date.seconds, date.nanoseconds).toDate().toDateString()}</Td>
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
                            isLoadingBooking ? 
                            <Flex height="100%" align="center" justify="center">
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.500'
                                    size='xl'
                                />
                            </Flex>
                            :
                            transactionFromBookingRef?.map((data) => (
                                <>
                                <VStack key={data.id}>
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