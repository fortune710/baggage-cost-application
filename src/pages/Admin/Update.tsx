import { TableContainer, Table, Thead, Tr, Th, Button, Tbody, Td, Skeleton, Tfoot, useDisclosure, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, FormLabel, Input, Stack, useToast } from "@chakra-ui/react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
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
        onClose: updateOnClose} = useDisclosure();

    const [updateForm, setUpdateForm] = useState<any>(undefined)

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

    const addClass = async () => {
        try {
            const ref = doc(firestore, "allowed-weights", form.name.replaceAll(' ', '-'))
            await setDoc(ref, {
                allowed_weight: form.allowed_weight,
                cost_per_kg: form.cost_per_kg
            })

            toast({
                title: "Added Class",
                position: "top-right",
                status: "success",
                isClosable: true
            })
            onClose();
        } catch (err:any) {
            toast({
                title: err.code,
                position: "top-right",
                status: "success",
                isClosable: true
            })
        }
    }

    const updateClass = async () => {
        try {
            const ref = doc(firestore, "allowed-weights", updateForm.id.replaceAll(' ', '-'))
            await updateDoc(ref, {
                allowed_weight: form.allowed_weight,
                cost_per_kg: form.cost_per_kg
            })

            toast({
                title: "Updated Class",
                position: "top-right",
                status: "success",
                isClosable: true
            })
            updateOnClose();
        } catch (err:any) {
            toast({
                title: err.code,
                position: "top-right",
                status: "success",
                isClosable: true
            })
        }
    }
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
                                allowedWeights.map((data) => (
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
                            onClick={addClass} 
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
                                    onChange={(e:any) => setForm({ ...form, name: e.target.value }) } 
                                    required
                                />
                            </FormControl>

                            <FormControl id="allowed_weight">
                                <FormLabel>Allowed Weight</FormLabel>
                                <Input 
                                    defaultValue={updateForm?.allowed_weight}
                                    type="number" 
                                    onChange={(e:any) => setForm({ ...updateForm, allowed_weight: e.target.valueAsNumber })} 
                                    required
                                />
                            </FormControl>

                            <FormControl id="cost">
                                <FormLabel>Cost per kg</FormLabel>
                                <Input
                                    defaultValue={updateForm?.cost_per_kg} 
                                    type="number" 
                                    onChange={(e:any) => setForm({ ...updateForm, cost_per_kg: e.target.valueAsNumber })} 
                                    required
                                />
                            </FormControl>

                        </Stack>

                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            onClick={updateClass} 
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

        </>
    )
}

export default Update;