import { 
    Box,
    Text,
    FlexProps, 
    Flex, 
    useColorModeValue, 
    IconButton, 
    HStack, Menu, MenuButton, Avatar, VStack, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import Logo from '../assets/logo.png';
interface MobileProps extends FlexProps {
    onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
    <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
        {...rest}
    >
        <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
        />

        <Box display={{ lg: 'none' }}>
            <img src={Logo} width="80px" alt="Adman-Logo"/>
        </Box>

        <Flex alignItems={'center'}>
            <Menu>
                <MenuButton
                    py={2}
                    transition="all 0.3s"
                    _focus={{ boxShadow: 'none' }}>
                    <HStack>
                        <Avatar
                            size={'sm'}
                            src={Logo}
                        />
                        <VStack
                            display={{ base: 'none', md: 'flex' }}
                            alignItems="flex-start"
                            spacing="1px"
                            ml="2">
                            <Text fontSize="sm">Adman</Text>
                            <Text fontSize="xs" color="gray.600">
                                Admin
                            </Text>
                        </VStack>
                        <Box display={{ base: 'none', md: 'flex' }}>
                            <FiChevronDown />
                        </Box>
                    </HStack>
                </MenuButton>
                <MenuList
                    bg={useColorModeValue('white', 'gray.900')}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>Settings</MenuItem>
                    <MenuDivider />
                    <MenuItem>Sign out</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    </Flex>
    );
};

export default MobileNav;