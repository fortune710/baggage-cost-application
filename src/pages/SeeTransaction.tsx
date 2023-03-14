import { Flex, Heading, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useColorModeValue } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import { usePayment } from "../hooks/usePayment";

const ViewTransaction: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { transaction } = usePayment(id!);
    const data = transaction[0];

    return(
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            direction="column"
            padding={2}
            gap={30}
            bg={useColorModeValue('gray.50', 'gray.800')}>
                
            <Heading>{data.payment_id}</Heading>

            <section className="staff-table">
                <TableContainer>
                    <Table variant='striped' colorScheme='teal'>
                        <Thead>
                            <Tr>
                                <Th>S/N</Th>
                                <Th>Ticket ID</Th>
                                <Th isNumeric>Class</Th>
                                <Th>Allowed Baggage (KG)</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                data.tickets.map((item, index) => (
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
            
            <Text>Amount: {data.amount}</Text>
            
        
        </Flex>

    )
}

export default ViewTransaction;