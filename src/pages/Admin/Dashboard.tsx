import React, { ReactNode, useEffect } from 'react';
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image
} from '@chakra-ui/react';

import {
  FiHome,
  FiTrendingUp,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import MobileNav from '../../components/MobileNav';
import { Outlet, Link as ReactRouterLink, useLocation, redirect } from 'react-router-dom';
import { MdOutlineAirplaneTicket } from 'react-icons/md';

import Logo from '../../assets/logo.png';
interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Users', icon: FiHome, route: '/admin/users' },
  { name: 'Payments', icon: FiTrendingUp, route: '/admin/payments' },
  { name: 'Ticket Classes', icon: MdOutlineAirplaneTicket, route: '/admin/update' },
];

const AdminDashboard: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  useEffect(() => {
    redirect("/admin/users")
  }, [])
  
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet/>
      </Box>
    </Box>
    )
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
        transition="3s ease"
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
    >
        <Flex h="20" alignItems="center" my="5" mx="8" justifyContent="space-between">
            <Image maxWidth={150} src={Logo} marginY="10%" />
            <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
            <NavItem route={link.route} key={link.name} icon={link.icon}>
            {link.name}
            </NavItem>
        ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  route: string;
}
const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
  const router = useLocation();
    return (
      <Link 
        as={ReactRouterLink} 
        to={route} 
        style={{ textDecoration: 'none' }} 
        _focus={{ boxShadow: 'none' }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          sx={{
            bg: router.pathname === route && 'blue.500',
            color: router.pathname === route && 'white',
            marginBottom: '5px'
          }}
          _hover={{
            bg: 'blue.500',
            color: 'white',
          }}
          {...rest}>
            {icon && (
            <Icon
                mr="4"
                fontSize="16"
                _groupHover={{
                color: 'white',
                }}
                as={icon}
            />
            )}
            {children}
        </Flex>
    </Link>
  );
};




export default AdminDashboard;