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
    Spacer
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { transactions } from '../mock/transactions';


export default function UserHome(): JSX.Element {
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();

    return (
    <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        direction="column"
        padding={2}
        gap={30}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        
        <Button onClick={() => navigate('/admin/users')}>
            New Transaction
        </Button>

        <section className="staff-table">
            <TableContainer>
                <Table variant='striped' colorScheme='teal'>
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
                            transactions.map(transaction => (
                                <Tr>
                                    <Td>{transaction.serial_number}</Td>
                                    <Td>{transaction.transaction_id}</Td>
                                    <Td isNumeric>{transaction.amount}</Td>
                                    <Td>{transaction.date}</Td>
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

    </Flex>
    );
}