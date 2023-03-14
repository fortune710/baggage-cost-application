import { Button, Flex, HStack, Input, useColorModeValue } from "@chakra-ui/react";

const UpdatePaymentStatus: React.FC = () => {
    return(
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            direction="column"
            padding={2}
            gap={30}
            bg={useColorModeValue('gray.50', 'gray.800')}>
                <form>
                    <HStack>
                        <Input
                            type="search"
                            placeholder="Enter 4 character code eg.D001"
                        />
                        <Button>
                            Search
                        </Button>
                    </HStack>
                </form>


            <Button>
                Confirm Payment
            </Button>
        </Flex>



    )
}

export default UpdatePaymentStatus;