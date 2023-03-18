import { TableContainer, Table, Thead, Tr, Th, Button, Tbody, Td, Skeleton, Tfoot, useDisclosure, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, FormLabel, Input, Stack, useToast, AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useRef } from "react";
import { useState } from "react";
import { BiReset } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { QRCode } from "react-qrcode-logo";
import { firestore } from "../../environments/firebase";
import { useAllowedWeights } from "../../hooks/useAllowedWeights";

const Update: React.FC = () => {
    const { isLoading, allowedWeights } = useAllowedWeights();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { 
        isOpen: updateisOpen, 
        onOpen: updateOnOpen, 
        onClose: updateOnClose
    } = useDisclosure();

    const { 
        isOpen: alertIsOpen,
        onOpen: alertOnOpen,
        onClose: alertOnClose 
    } = useDisclosure();

    const queryClient = useQueryClient();
    
    const [selectedTicketClass, setSelected] = useState<string>("");
    const [updateForm, setUpdateForm] = useState<any>(undefined);

    const [form, setForm] = useState({
        name: '',
        allowed_weight: 0,
        cost_per_kg: 0
    })
    const toast = useToast();

    const handleUpdateClick = (data:any) => {
        updateOnOpen();
        setUpdateForm(data);
    }

    const handleDeleteClick = (id:string) => {
        alertOnOpen();
        setSelected(id)
    }

    const addClass = async () => {
        const ref = doc(firestore, "allowed-weights", form.name.replaceAll(' ', '-'))
        await setDoc(ref, {
            allowed_weight: form.allowed_weight,
            cost_per_kg: form.cost_per_kg
        })
    }

    const addClassMutation = useMutation(["add-ticket-class"], addClass, {
        onSuccess: () => {
            queryClient.invalidateQueries(["ticket-classes"]);
            toast({
                title: "Added Class",
                position: "top-right",
                status: "success",
                isClosable: true
            })
            onClose();
        },
        onError: (err: any) => {
            toast({
                title: err.code,
                position: "top-right",
                status: "success",
                isClosable: true
            })
        }
    })

    const updateClass = async () => {
        const ref = doc(firestore, "allowed-weights", updateForm.id.replaceAll(' ', '-'))
        await updateDoc(ref, {
            allowed_weight: form.allowed_weight,
            cost_per_kg: form.cost_per_kg
        })
    }

    const { mutate } = useMutation(["ticket-class-mutation"], updateClass, {
        onSuccess: () => {
            queryClient.invalidateQueries(["ticket-classes"]);
            toast({
                title: "Updated Class",
                position: "top-right",
                status: "success",
                isClosable: true
            })
            updateOnClose();
        },
        onError: (err: any) => {
            toast({
                title: err.code,
                position: "top-right",
                status: "success",
                isClosable: true
            })
        }
    })

    const deleteTicketClass = async (id:string) => {
        const ref = doc(firestore, "allowed-weights", id);
        await deleteDoc(ref)
    }

    const deleteTicketMutation = useMutation(["delete-ticket-class"], (id:string) => deleteTicketClass(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["ticket-classes"]);
            toast({
                title: "Updated Class",
                position: "top-right",
                status: "success",
                isClosable: true
            })
            setSelected("")
            return alertOnClose();
        },
        onError: (err: any) => {
            toast({
                title: err.code,
                position: "top-right",
                status: "success",
                isClosable: true
            })
        }
    })

    const cancelRef = useRef<any>();
    
    return(
        <>
        
            <section className="staff-table">
                <TableContainer>
                    <Table colorScheme='teal'>
                        <Thead>
                            <Tr>
                                <Th>Ticket Class</Th>
                                <Th isNumeric>Allowed Baggage Weight</Th>
                                <Th isNumeric>Cost Per Kg</Th>
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
                                allowedWeights?.map((data) => (
                                    <Tr key={data.id}>
                                        <Td>{data.id}</Td>
                                        <Td isNumeric>{data.allowed_weight}</Td>
                                        <Td isNumeric>{data.cost_per_kg}</Td>

                                        <Td>
                                            <Button
                                                onClick={() => handleUpdateClick(data)} 
                                                colorScheme="yellow">
                                                Update
                                            </Button>
                                        </Td>

                                        <Td>
                                            <Button
                                                colorScheme="red"
                                                onClick={() => handleDeleteClick(data.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Td>
                                    <Button onClick={onOpen}>
                                        Add Ticket Class
                                    </Button>
                                </Td>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </section>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody justifyContent={"center"}>
                        
                        <Stack spacing={4}>
                            <FormControl id="name">
                                <FormLabel>Ticket Class Name</FormLabel>
                                <Input  
                                    placeholder="eg. First Class" 
                                    onChange={(e:any) => setForm({ ...form, name: e.target.value }) } 
                                    required
                                />
                            </FormControl>

                            <FormControl id="allowed_weight">
                                <FormLabel>Allowed Weight</FormLabel>
                                <Input 
                                    type="number" 
                                    onChange={(e:any) => setForm({ ...form, allowed_weight: e.target.valueAsNumber })} 
                                    required
                                />
                            </FormControl>

                            <FormControl id="cost">
                                <FormLabel>Cost per kg</FormLabel>
                                <Input 
                                    type="number" 
                                    onChange={(e:any) => setForm({ ...form, cost_per_kg: e.target.valueAsNumber })} 
                                    required
                                />
                            </FormControl>

                        </Stack>

                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            onClick={() =>  addClassMutation.mutate()} 
                            colorScheme='blue' 
                            mr={3} 
                        >
                            Add Class
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



            <Modal isOpen={updateisOpen} onClose={updateOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody justifyContent={"center"}>
                        
                        <Stack spacing={4}>
                            <FormControl id="name">
                                <FormLabel>Ticket Class Name</FormLabel>
                                <Input 
                                    value={updateForm?.id} 
                                    disabled
                                    placeholder="eg. First Class" 
                                    required
                                />
                            </FormControl>

                            <FormControl id="allowed_weight">
                                <FormLabel>Allowed Weight</FormLabel>
                                <Input 
                                    defaultValue={updateForm?.allowed_weight}
                                    type="number" 
                                    onChange={(e:any) => setForm({ ...form, allowed_weight: e.target.valueAsNumber })} 
                                    required
                                />
                            </FormControl>

                            <FormControl id="cost">
                                <FormLabel>Cost per kg</FormLabel>
                                <Input
                                    defaultValue={updateForm?.cost_per_kg} 
                                    type="number" 
                                    onChange={(e:any) => setForm({ ...form, cost_per_kg: e.target.valueAsNumber })} 
                                    required
                                />
                            </FormControl>

                        </Stack>

                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            onClick={() => mutate()} 
                            colorScheme='blue' 
                            mr={3} 
                        >
                            Update
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
            
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={alertOnClose}
                isOpen={alertIsOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                <AlertDialogHeader>Delete Ticket Class?</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    Are you sure you want to delete this ticket class?
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={alertOnClose}>
                        No
                    </Button>
                    <Button 
                        onClick={() => deleteTicketMutation.mutate(selectedTicketClass)}
                        colorScheme='red' 
                        ml={3}>
                        Yes
                    </Button>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default Update;