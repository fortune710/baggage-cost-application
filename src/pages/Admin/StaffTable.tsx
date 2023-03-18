import { 
    TableContainer, 
    Table, 
    TableCaption, 
    Thead, Tr, 
    Th, Tbody, 
    Td, Tfoot, 
    Flex, Button, 
    Spacer, 
    SkeletonText, 
    Skeleton, 
    useToast} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiReset } from "react-icons/bi";
import { useStaff } from "../../hooks/useStaff";
import { deleteUser, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../environments/firebase";
import { doc, updateDoc } from "firebase/firestore";




const StaffTable: React.FC = () => {
    const navigate = useNavigate();
    const { isLoading, staff } = useStaff();
    const toast = useToast();

    const deleteAccount = async (email: string, password: string) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            const ref = doc(firestore, 'users', user.uid)
            await deleteUser(user!)
            await updateDoc(ref, { deleted: true })
            toast({
                title: "Account Deleted",
                position: "top-right",
                status: "success",
                isClosable: true
            })

        } catch (err:any) {
            toast({
                title: err.code,
                position: "top-right",
                status: "error",
                isClosable: true
            })
        }
    
    }

    const resetPassword = async (email:string) => {
        try {
            await sendPasswordResetEmail(auth, email)
            toast({
                title: "Password Reset Link Sent",
                position: "top-right",
                status: "success",
                isClosable: true
            })
    
        } catch (err:any) {
            toast({
                title: err.code,
                position: "top-right",
                status: "error",
                isClosable: true
            })
        }
    }

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
                            staff?.map((data) => (
                                <Tr key={data.id}>
                                    <Td>{data.name}</Td>
                                    <Td>{data.email}</Td>
                                    <Td>
                                        <Button 
                                            onClick={() => resetPassword(data.email)} 
                                            leftIcon={<BiReset/>} 
                                            variant="ghost"
                                        >
                                            Reset Password
                                        </Button>
                                    </Td>
                                    <Td>
                                        <Button 
                                            leftIcon={<MdDelete/>} 
                                            colorScheme="red" 
                                            variant="ghost"
                                            onClick={() => deleteAccount(data.email, data.password)}
                                        >
                                            Delete Account
                                        </Button>
                                    </Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
            </TableContainer>

        </section>
    )
}

export default StaffTable;