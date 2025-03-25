import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Link,
  useDisclosure,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Elections',
    href: '/elections',
  },
  {
    label: 'Results',
    href: '/results',
  },
  {
    label: 'About',
    href: '/about',
  },
];

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { isAuthenticated, user, login, logout, isLoading, needsRegistration, userRole } = useAuth();
  const navigate = useNavigate();


  const handleLoginClick = async () => {
    try {
      const result = await login();
      
      if (result.success) {
        if (result.userExists) {
          // User exists, redirect based on role
          if (result.role === 'institution') {
            navigate('/admin');
          } else {
            navigate('/elections');
          }
        } else if (result.needsRegistration) {
          // User needs to register, redirect to registration
          navigate('/register');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Box
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
        justify="space-between"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={{ base: 'center', md: 'left' }}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            fontWeight="bold"
            fontSize="xl"
            as={RouterLink}
            to="/"
          >
            BlockVote
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {isLoading ? (
            <Button isLoading variant="ghost">
              Loading...
            </Button>
          ) : isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  // src={user?.profileImage}
                  name={user?.name || 'User'}
                />
              </MenuButton>
              <MenuList zIndex={2}>
                {userRole === 'institution' ? (
                  <MenuItem as={RouterLink} to="/admin">
                    Admin Dashboard
                  </MenuItem>
                ) : (
                  <MenuItem as={RouterLink} to="/elections">
                    Elections Dashboard
                  </MenuItem>
                )}
                <MenuItem as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={logout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          ) : needsRegistration ? (
            <>
              <Button
                as={RouterLink}
                to="/register"
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'brand.500'}
                _hover={{
                  bg: 'brand.600',
                }}
              >
                Complete Registration
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleLoginClick}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'brand.500'}
                _hover={{
                  bg: 'brand.600',
                }}
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to={'/register'}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                variant={'outline'}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Link
            as={RouterLink}
            p={2}
            to={navItem.href}
            fontSize={'sm'}
            fontWeight={500}
            color="gray.600"
            _hover={{
              textDecoration: 'none',
              color: 'gray.800',
            }}
          >
            {navItem.label}
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={RouterLink}
        to={href}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
      </Flex>
    </Stack>
  );
};

export default Header;