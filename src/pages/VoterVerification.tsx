// src/pages/VoteVerification.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Divider,
  Badge,
  Flex,
  Spacer,
  Spinner,
  Center,
  Icon,
  useColorModeValue,
  Code,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Link,
  Alert,
  AlertIcon,
  Tooltip,
  Stack,
  useClipboard,
} from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import { 
  FaCheckCircle, 
  FaClock, 
  FaFileAlt, 
  FaLock, 
  FaShieldAlt, 
  FaLink, 
  FaCopy, 
  FaEthereum,
  FaInfoCircle,
  FaQrcode,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// Mock data - in a real app, this would come from your API
const mockVoteData = {
  transactionHash: '0x7f9e8f7e6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8',
  blockNumber: 12345678,
  timestamp: '2025-03-05T13:24:36',
  election: {
    id: '2',
    title: 'Department Representative Election',
    status: 'active',
    startDate: '2025-03-05T10:00:00',
    endDate: '2025-03-07T16:00:00',
  },
  candidate: {
    id: '2',
    name: 'Michael Chen',
    party: 'Student Action Committee',
  },
  encryptedVoteData: 'QmZ9vNMBQjRCUjnzh6YYAo8jst3UUXvqXVhvjvJosGDzTx',
  receiptId: 'V2025030513242',
  ipfsHash: 'QmT8JKnCocLG5ByYPHYEcmEyMCHYLLNdRwPWZGxR3QuW7P',
  verificationProof: 'QmX6zfZ3QYB9JtQfAJ6ZnPhj8FD6uYrV7vUzFcdK4GvwGN',
};

const VoteVerification = () => {
  const { voteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [voteData, setVoteData] = useState<typeof mockVoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const { hasCopied, onCopy } = useClipboard(mockVoteData.transactionHash);
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Fetch vote data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call to get vote verification data
        setTimeout(() => {
          setVoteData(mockVoteData);
          setIsLoading(false);
          
          // Simulate verification process
          setTimeout(() => {
            setVerificationStatus('verified');
          }, 2000);
        }, 1500);
      } catch (error) {
        console.error('Error fetching vote data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [voteId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Loading state
  if (isLoading) {
    return (
      <Center h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text>Retrieving your vote information...</Text>
        </VStack>
      </Center>
    );
  }

  // No vote data found
  if (!voteData) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error" variant="solid" borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <Heading size="md" mb={2}>Vote Not Found</Heading>
            <Text>We couldn't find any vote with the provided ID. Please check and try again.</Text>
          </Box>
        </Alert>
        <Button mt={4} colorScheme="brand" onClick={() => navigate('/elections')}>
          Back to Elections
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Vote Receipt Header */}
        <Box bg={bgColor} p={6} borderRadius="md" borderWidth="1px" boxShadow="sm">
          <Flex align="center" mb={4}>
            <HStack>
              <Icon as={FaFileAlt} boxSize={6} color="brand.500" />
              <Heading as="h1" size="xl">
                Vote Receipt
              </Heading>
            </HStack>
            <Spacer />
            <Badge 
              colorScheme={verificationStatus === 'verified' ? 'green' : 'yellow'} 
              fontSize="md" 
              py={1} 
              px={3}
              borderRadius="full"
            >
              {verificationStatus === 'verified' ? 'Verified' : 'Verifying...'}
            </Badge>
          </Flex>
          
          <Text fontSize="md" mb={4}>
            Your vote in <strong>{voteData.election.title}</strong> has been securely recorded on the blockchain.
          </Text>
          
          <HStack fontSize="sm" color="gray.600">
            <Text>
              <strong>Receipt ID:</strong> {voteData.receiptId}
            </Text>
            <Text>•</Text>
            <Text>
              <strong>Cast on:</strong> {formatDate(voteData.timestamp)}
            </Text>
          </HStack>
        </Box>

        {/* Verification Status */}
        <Card borderWidth="1px" borderRadius="md" boxShadow="sm">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Flex align="center">
                <HStack>
                  <Icon 
                    as={verificationStatus === 'verified' ? FaCheckCircle : FaClock} 
                    color={verificationStatus === 'verified' ? 'green.500' : 'yellow.500'} 
                    boxSize={5} 
                  />
                  <Heading as="h3" size="md">
                    {verificationStatus === 'verified' ? 'Vote Successfully Verified' : 'Verification in Progress'}
                  </Heading>
                </HStack>
                <Spacer />
                {verificationStatus !== 'verified' && <Spinner size="sm" color="yellow.500" />}
              </Flex>
              
              <Text>
                {verificationStatus === 'verified' 
                  ? 'Your vote has been successfully verified on the blockchain. The vote integrity is confirmed.'
                  : 'We are currently verifying your vote on the blockchain. This process ensures the integrity of your vote.'}
              </Text>
              
              {verificationStatus === 'verified' && (
                <HStack spacing={4} pt={2}>
                  <Icon as={FaLock} color="green.500" />
                  <Text fontSize="sm" color="green.600" fontWeight="medium">
                    Vote integrity confirmed
                  </Text>
                  
                  <Icon as={FaShieldAlt} color="green.500" />
                  <Text fontSize="sm" color="green.600" fontWeight="medium">
                    Tamper-proof verification complete
                  </Text>
                </HStack>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Vote Details */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card borderWidth="1px" borderRadius="md" boxShadow="sm">
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading as="h3" size="md">
                  Election Details
                </Heading>
                
                <Box>
                  <Text fontWeight="bold">{voteData.election.title}</Text>
                  <HStack fontSize="sm" color="gray.600" mt={1}>
                    <Text>
                      <Icon as={FaClock} mr={1} />
                      {formatDate(voteData.election.startDate).split(',')[0]} - {formatDate(voteData.election.endDate).split(',')[0]}
                    </Text>
                  </HStack>
                </Box>
                
                <Divider />
                
                <Box>
                  <Text fontWeight="bold">Your vote for:</Text>
                  <Box mt={2} p={3} bg={bgColor} borderRadius="md">
                    <Flex align="center">
                      <Text fontWeight="medium">{voteData.candidate.name}</Text>
                      <Spacer />
                      <Badge colorScheme="blue">{voteData.candidate.party}</Badge>
                    </Flex>
                  </Box>
                  <Text fontSize="xs" mt={2} color="gray.500">
                    <Icon as={FaInfoCircle} mr={1} />
                    Your actual vote is encrypted to maintain ballot secrecy
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card borderWidth="1px" borderRadius="md" boxShadow="sm">
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading as="h3" size="md">
                  Blockchain Record
                </Heading>
                
                <Stat>
                  <StatLabel>Block Number</StatLabel>
                  <StatNumber>{voteData.blockNumber}</StatNumber>
                  <StatHelpText>
                    <Icon as={FaEthereum} mr={1} />
                    Ethereum Blockchain
                  </StatHelpText>
                </Stat>
                
                <Divider />
                
                <Box>
                  <Text fontWeight="bold" mb={1}>Transaction Hash:</Text>
                  <Flex align="center">
                    <Code p={2} borderRadius="md" fontSize="xs" maxW="100%" overflow="hidden" isTruncated>
                      {voteData.transactionHash}
                    </Code>
                    <Tooltip label={hasCopied ? "Copied!" : "Copy to clipboard"}>
                      <Button size="sm" ml={2} onClick={onCopy} variant="ghost">
                        <Icon as={FaCopy} />
                      </Button>
                    </Tooltip>
                  </Flex>
                </Box>
                
                <Button 
                  leftIcon={<FaLink />} 
                  size="sm" 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={() => window.open(`https://etherscan.io/tx/${voteData.transactionHash}`, '_blank')}
                >
                  View on Etherscan
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Technical Details (Collapsible) */}
        <Accordion allowToggle borderWidth="1px" borderRadius="md">
          <AccordionItem border="none">
            <AccordionButton py={4}>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Technical Details
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold" mb={2}>IPFS Data:</Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Text fontWeight="medium">Vote IPFS Hash:</Text>
                      <Text fontFamily="monospace" fontSize="sm" isTruncated>
                        {voteData.ipfsHash}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="medium">Encrypted Vote Data:</Text>
                      <Text fontFamily="monospace" fontSize="sm" isTruncated>
                        {voteData.encryptedVoteData}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={2}>Zero-Knowledge Proof:</Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Text fontWeight="medium">Verification Proof:</Text>
                      <Text fontFamily="monospace" fontSize="sm" isTruncated>
                        {voteData.verificationProof}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      The zero-knowledge proof verifies your vote was included in the tally without revealing your actual vote.
                    </Text>
                  </VStack>
                </Box>
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* Actions */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="center" pt={4}>
          <Button 
            leftIcon={<FaQrcode />} 
            variant="outline" 
            colorScheme="brand"
          >
            Download Receipt
          </Button>
          
          <Button 
            leftIcon={<FaEye />} 
            colorScheme="brand"
            onClick={() => navigate(`/results/${voteData.election.id}`)}
          >
            View Election Results
          </Button>
        </Stack>
      </VStack>
    </Container>
  );
};

// Add this at the top of your import statements

export default VoteVerification;