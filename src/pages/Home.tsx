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
    Skeleton
} from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../environments/firebase';
import { useStaff } from '../hooks/useStaffTransaction';



export default function UserHome(): JSX.Element {
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();
    const  { transaction: data, isLoading } = useStaff(auth.currentUser?.uid!);

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

        <section className="staff-table">
            <TableContainer>
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
                                <Tr>
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

    </Flex>
    );
}