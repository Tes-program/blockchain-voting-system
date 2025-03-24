// src/pages/AboutPage.tsx
import {
    Box,
    Container,
    Heading,
    Text,
    Stack,
    VStack,
    Divider,
    useColorModeValue,
  } from '@chakra-ui/react';
  
  const AboutPage = () => {
    return (
      <Container maxW={'4xl'} py={12}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            About BlockVote
          </Heading>
          
          <Text fontSize="lg" textAlign="center">
            A secure, transparent, and efficient blockchain-based electronic voting system
            designed to revolutionize the democratic process.
          </Text>
          
          <Divider my={6} />
          
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Our Mission
            </Heading>
            <Text fontSize="md">
              Our mission is to enhance the integrity of the electoral process using blockchain
              technology, ensuring that every vote is counted accurately and that the entire
              process is transparent and verifiable. We aim to increase voter participation
              by making voting more accessible while maintaining the highest standards of
              security and privacy.
            </Text>
          </Box>
          
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Technology Stack
            </Heading>
            <Text fontSize="md">
              BlockVote is built on cutting-edge technologies to ensure security,
              scalability, and usability:
            </Text>
            <Stack spacing={4} mt={4} pl={6}>
              <Text>
                <strong>Frontend:</strong> React with TypeScript for a type-safe, responsive user interface
              </Text>
              <Text>
                <strong>Blockchain:</strong> Ethereum smart contracts for secure, immutable vote recording
              </Text>
              <Text>
                <strong>Decentralized Storage:</strong> IPFS (InterPlanetary File System) for distributed data storage
              </Text>
              <Text>
                <strong>Security:</strong> Zero-knowledge proofs for privacy-preserving vote verification
              </Text>
            </Stack>
          </Box>
          
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              How It Works
            </Heading>
            <Stack spacing={4}>
              <Box
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                bg={useColorModeValue('white', 'gray.700')}
              >
                <Heading as="h3" size="md" mb={2}>
                  1. Voter Registration
                </Heading>
                <Text>
                  Users register with their identity documents. The system verifies eligibility
                  and issues a digital voter ID linked to their blockchain wallet address.
                </Text>
              </Box>
              
              <Box
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                bg={useColorModeValue('white', 'gray.700')}
              >
                <Heading as="h3" size="md" mb={2}>
                  2. Voting Process
                </Heading>
                <Text>
                  During an election, registered voters can securely cast their vote. The vote is
                  encrypted and recorded on the blockchain, ensuring it cannot be altered.
                </Text>
              </Box>
              
              <Box
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                bg={useColorModeValue('white', 'gray.700')}
              >
                <Heading as="h3" size="md" mb={2}>
                  3. Vote Verification
                </Heading>
                <Text>
                  After voting, users receive a unique receipt allowing them to verify their vote
                  was counted correctly without revealing who they voted for.
                </Text>
              </Box>
              
              <Box
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                bg={useColorModeValue('white', 'gray.700')}
              >
                <Heading as="h3" size="md" mb={2}>
                  4. Result Tabulation
                </Heading>
                <Text>
                  Votes are automatically tallied by smart contracts. Results are transparent,
                  verifiable, and can be independently audited by anyone.
                </Text>
              </Box>
            </Stack>
          </Box>
          
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              The Team
            </Heading>
            <Text fontSize="md" mb={4}>
              This project was developed by:
            </Text>
            <Stack spacing={2}>
              <Text>• ESEKA BIENIOLISEH PATRICK</Text>
              <Text>• ANYAECHE SABASTINE MADUABUCHUKWU</Text>
              <Text>• ONANUGA MUBARAK AFOLARIN</Text>
            </Stack>
            <Text mt={4}>
              As a final year project in partial fulfillment of the requirements for the award of
              Bachelor of Science (B.Sc.) in Information Technology.
            </Text>
          </Box>
        </VStack>
      </Container>
    );
  };
  
  export default AboutPage;