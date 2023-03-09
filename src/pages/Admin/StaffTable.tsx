import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Flex, Button, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiReset } from "react-icons/bi";

const StaffTable: React.FC = () => {
    const navigate = useNavigate();

    return(
        <section className="staff-table">
            <TableContainer>
                <Table colorScheme='teal'>
                    <Thead>
                        <Tr>
                            <Th colSpan={3}>All Users</Th>
                            <Th>
                                <Button onClick={() => navigate('/admin/add-user')}>Add User</Button>
                            </Th>
                        </Tr>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th></Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Staff 1</Td>
                            <Td>staff@gmail.com</Td>
                            <Td>
                                <Button leftIcon={<BiReset/>} variant="ghost">
                                    Reset Password
                                </Button>
                            </Td>
                            <Td>
                                <Button leftIcon={<MdDelete/>} colorScheme="red" variant="ghost">
                                    Delete Account
                                </Button>
                            </Td>
                        </Tr>

                        <Tr>
                            <Td>Staff 1</Td>
                            <Td>staff@gmail.com</Td>
                            <Td>
                                <Button leftIcon={<BiReset/>} variant="ghost">
                                    Reset Password
                                </Button>
                            </Td>
                            <Td>
                                <Button leftIcon={<MdDelete/>} colorScheme="red" variant="ghost">
                                    Delete Account
                                </Button>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Staff 1</Td>
                            <Td>staff@gmail.com</Td>
                            <Td>
                                <Button leftIcon={<BiReset/>} variant="ghost">
                                    Reset Password
                                </Button>
                            </Td>
                            <Td>
                                <Button leftIcon={<MdDelete/>} colorScheme="red" variant="ghost">
                                    Delete Account
                                </Button>
                            </Td>
                        </Tr>

                    </Tbody>
                </Table>
            </TableContainer>

        </section>
    )
}

export default StaffTable;