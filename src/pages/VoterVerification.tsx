// src/pages/VoterVerification.tsx
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
  IconButton,
  useToast,
} from '@chakra-ui/react';
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
  FaExternalLinkAlt,
  FaEye
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getVoteReceipt, verifyVote } from '../services/voteService';

interface Candidate {
  roleId: string;
  roleTitle: string;
  candidateId: string;
  candidateName: string;
}

interface BlockchainData {
  transactionHash: string;
  blockNumber: number;
}

interface IpfsData {
  receiptHash: string;
}

interface VoteData {
  receiptId: string;
  electionId: string;
  electionTitle: string;
  timestamp: string;
  blockchainData: BlockchainData;
  ipfsData: IpfsData;
  verificationStatus: string;
  selections: Candidate[];
}

const VoteVerification = () => {
  const { voteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const { hasCopied, onCopy } = useClipboard('');
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Fetch vote data from API
  useEffect(() => {
    const fetchVoteData = async () => {
      setIsLoading(true);
      try {
        if (!voteId) {
          toast({
            title: "Error",
            description: "Invalid vote receipt ID",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate('/elections');
          return;
        }
        
        // Get vote receipt
        const response = await getVoteReceipt(voteId);
        
        if (response.success) {
          setVoteData(response.data);
          
          // Set the text for clipboard copying
          if (response.data.blockchainData?.transactionHash) {
            onCopy.value = response.data.blockchainData.transactionHash;
          }
          
          // Start verification process
          setVerificationStatus('verifying');
          
          try {
            // Verify vote on blockchain
            const verificationResponse = await verifyVote(voteId);
            
            if (verificationResponse.success && verificationResponse.data.verified) {
              setVerificationStatus('verified');
            } else {
              setVerificationStatus('failed');
              toast({
                title: "Verification failed",
                description: verificationResponse.message || "Could not verify vote on blockchain",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            }
          } catch (verifyError) {
            console.error('Verification error:', verifyError);
            setVerificationStatus('failed');
            toast({
              title: "Verification error",
              description: "An error occurred while verifying the vote",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        } else {
          toast({
            title: "Error fetching vote data",
            description: response.message || "Failed to load vote information",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate('/elections');
        }
      } catch (error) {
        console.error('Error fetching vote data:', error);
        toast({
          title: "Error",
          description: "Failed to load vote information. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate('/elections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoteData();
  }, [voteId, toast, navigate, onCopy]);

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

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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
              colorScheme={
                verificationStatus === 'verified' ? 'green' : 
                verificationStatus === 'failed' ? 'red' : 'yellow'
              } 
              fontSize="md" 
              py={1} 
              px={3}
              borderRadius="full"
            >
              {verificationStatus === 'verified' ? 'Verified' : 
               verificationStatus === 'failed' ? 'Verification Failed' : 'Verifying...'}
            </Badge>
          </Flex>
          
          <Text fontSize="md" mb={4}>
            Your vote in <strong>{voteData.electionTitle}</strong> has been securely recorded on the blockchain.
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
                    as={
                      verificationStatus === 'verified' ? FaCheckCircle : 
                      verificationStatus === 'failed' ? FaInfoCircle : FaClock
                    } 
                    color={
                      verificationStatus === 'verified' ? 'green.500' : 
                      verificationStatus === 'failed' ? 'red.500' : 'yellow.500'
                    } 
                    boxSize={5} 
                  />
                  <Heading as="h3" size="md">
                    {verificationStatus === 'verified' ? 'Vote Successfully Verified' : 
                     verificationStatus === 'failed' ? 'Verification Failed' : 'Verification in Progress'}
                  </Heading>
                </HStack>
                <Spacer />
                {verificationStatus === 'verifying' && <Spinner size="sm" color="yellow.500" />}
              </Flex>
              
              <Text>
                {verificationStatus === 'verified' 
                  ? 'Your vote has been successfully verified on the blockchain. The vote integrity is confirmed.'
                  : verificationStatus === 'failed'
                  ? 'We encountered an issue verifying your vote on the blockchain. This does not necessarily mean your vote was not counted.'
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

              {verificationStatus === 'failed' && (
                <Alert status="warning" mt={2} borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    If you believe this is an error, please contact election administrators with your receipt ID.
                  </Text>
                </Alert>
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
                  <Text fontWeight="bold">{voteData.electionTitle}</Text>
                  <HStack fontSize="sm" color="gray.600" mt={1}>
                    <Text>
                      <Icon as={FaClock} mr={1} />
                      ID: {voteData.electionId}
                    </Text>
                  </HStack>
                </Box>
                
                <Divider />
                
                <Box>
                  <Text fontWeight="bold">Your vote for:</Text>
                  <VStack mt={2} spacing={3} align="stretch">
                    {voteData.selections.map((selection, index) => (
                      <Box key={index} p={3} bg={bgColor} borderRadius="md">
                        <Text fontSize="sm" color="gray.600">
                          {selection.roleTitle}:
                        </Text>
                        <Text fontWeight="medium">
                          {selection.candidateName}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                  <Text fontSize="xs" mt={2} color="gray.500">
                    <Icon as={FaInfoCircle} mr={1} />
                    Your actual vote is encrypted on the blockchain to maintain ballot secrecy
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
                  <StatNumber>{voteData.blockchainData.blockNumber}</StatNumber>
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
                      {voteData.blockchainData.transactionHash}
                    </Code>
                    <Tooltip label="Copy to clipboard">
                      <IconButton
                        aria-label="Copy to clipboard"
                        icon={<FaCopy />}
                        size="sm"
                        ml={2}
                        onClick={() => copyToClipboard(voteData.blockchainData.transactionHash)}
                        variant="ghost"
                      />
                    </Tooltip>
                  </Flex>
                </Box>
                
                <Button 
                  leftIcon={<FaLink />} 
                  size="sm" 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={() => window.open(`https://etherscan.io/tx/${voteData.blockchainData.transactionHash}`, '_blank')}
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
                        {voteData.ipfsData.receiptHash}
                      </Text>
                      <IconButton
                        aria-label="Copy IPFS hash"
                        icon={<FaCopy />}
                        size="xs"
                        variant="ghost"
                        onClick={() => copyToClipboard(voteData.ipfsData.receiptHash)}
                      />
                      <Link href={`https://ipfs.io/ipfs/${voteData.ipfsData.receiptHash}`} isExternal color="blue.500">
                        <Icon as={FaExternalLinkAlt} boxSize={3} />
                      </Link>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      The vote receipt is permanently stored on IPFS, a decentralized storage system.
                    </Text>
                  </VStack>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" mb={2}>Verification Process:</Text>
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm">
                      Your vote was verified using zero-knowledge proofs, ensuring that:
                    </Text>
                    <VStack align="stretch" spacing={1} pl={4}>
                      <Text fontSize="sm">• Your vote was included in the final tally</Text>
                      <Text fontSize="sm">• The vote belongs to your wallet address</Text>
                      <Text fontSize="sm">• The vote has not been tampered with</Text>
                    </VStack>
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
            onClick={() => {
              // In a real implementation, this would generate and download a receipt
              toast({
                title: "Receipt download",
                description: "Receipt download functionality will be available soon",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            Download Receipt
          </Button>
          
          <Button 
            leftIcon={<FaEye />} 
            colorScheme="brand"
            onClick={() => navigate(`/results/${voteData.electionId}`)}
          >
            View Election Results
          </Button>
        </Stack>
      </VStack>
    </Container>
  );
};

export default VoteVerification;