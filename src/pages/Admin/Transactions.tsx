import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Tfoot, Skeleton, TableCaption } from "@chakra-ui/react"
import { useStaff } from "../../hooks/useTransaction"

const PaymentsPage: React.FC = () => {
    const { transaction, isLoading, error } = useStaff();

    return (
        <section className="staff-table">
            <TableContainer>
                <Table variant='striped' colorScheme='teal'>
                    { error && <TableCaption>Error While Loading Data</TableCaption>}
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
                            transaction.map((transaction, index) => (
                                <Tr>
                                    <Td>{index}</Td>
                                    <Td>{transaction.id}</Td>
                                    <Td isNumeric>{transaction.amount}</Td>
                                    <Td>{""}</Td>
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
    )
}

export default PaymentsPage;