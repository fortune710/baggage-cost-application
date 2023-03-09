import { Stack, useColorModeValue, Heading, FormControl, Input, Button, Text } from "@chakra-ui/react"

interface BaggageCardProps {
    setWeight: any;
};

const BaggageCard = ({}) => {
    return (
        <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
            my={12}>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                Calculate Excess Baggage Payment
            </Heading>
            <Text
                fontSize={{ base: 'sm', sm: 'md' }}
                color={useColorModeValue('gray.800', 'gray.400')}>
                Ensure the weight is correct
            </Text>
            <FormControl onChange={(e:any) => console.log(e.target.valueAsNumber)} id="email">
                <Input
                    placeholder="Enter the weight of the bag eg. 20kg"
                    _placeholder={{ color: 'gray.500' }}
                    type="number"
                />
            </FormControl>
            <Stack spacing={6}>
                <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                        bg: 'blue.500',
                    }}>
                    Calculate
                </Button>
            </Stack>
        </Stack>
    )
}

export default BaggageCard