// src/components/layout/Footer.tsx
import {
    Box,
    Container,
    Stack,
    Text,
    Link,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { FaGithub } from 'react-icons/fa';
  
  const Footer = () => {
    return (
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
        mt="auto"
      >
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text>
            © {new Date().getFullYear()} BlockVote. All rights reserved
          </Text>
          <Stack direction={'row'} spacing={6}>
            <Link href={'#'} isExternal>
              <FaGithub />
            </Link>
          </Stack>
        </Container>
      </Box>
    );
  };
  
  export default Footer;