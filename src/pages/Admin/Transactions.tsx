import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Tfoot } from "@chakra-ui/react"
import { transactions } from "../../mock/transactions"

const PaymentsPage: React.FC = () => {
    return (
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
    )
}

export default PaymentsPage;