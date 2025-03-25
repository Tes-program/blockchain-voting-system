// src/pages/ResultPage.tsx
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
  Flex,
  Spacer,
  Spinner,
  Center,
  Icon,
  Badge,
  useColorModeValue,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tooltip,
  Link,
  Alert,
  AlertIcon,
  Stack,
  useToast,
  IconButton
} from '@chakra-ui/react';
import {
  FaTrophy,
  FaUsers,
  FaVoteYea,
  FaLink,
  FaExternalLinkAlt,
  FaChartBar,
  FaCopy
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getElectionResults } from '../services/electionService';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
} from 'recharts';

// COLORS for pie chart
const COLORS = ['#4299E1', '#F56565', '#48BB78', '#ECC94B', '#9F7AEA', '#ED64A6'];

interface Candidate {
  candidateId: string;
  candidateName: string;
  party: string;
  votes: number;
  percentage: number;
  isWinner: boolean;
}

interface RoleResult {
  roleId: string;
  roleTitle: string;
  candidates: Candidate[];
}

interface DepartmentParticipation {
  department: string;
  eligibleVoters: number;
  votesCast: number;
  turnoutPercentage: number;
}

interface BlockchainData {
  transactionHash: string;
  blockNumber: number;
  smartContractAddress: string;
  ipfsResultsHash: string;
}

interface VerificationInfo {
  smartContractAddress: string;
  resultsHash: string;
  transactionHash: string;
  blockNumber: number;
}

interface ElectionResult {
  electionId: string;
  electionTitle: string;
  status: string;
  startDate: string;
  endDate: string;
  totalEligibleVoters: number;
  totalVotesCast: number;
  participationRate: number;
  roleResults: RoleResult[];
  participationByDepartment: DepartmentParticipation[];
  timestamp: string;
  blockchainData: BlockchainData;
  verificationInfo: VerificationInfo;
  ipfsHash: string;
}

const ResultsPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [results, setResults] = useState<ElectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clipboardCopied, setClipboardCopied] = useState(false);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgLight = useColorModeValue("blue.50", "blue.900");
  const bgDark = useColorModeValue("blue.200", "blue.700");

  // Fetch election results from API
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        if (!electionId) {
          toast({
            title: "Error",
            description: "Invalid election ID",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate('/elections');
          return;
        }
        
        const response = await getElectionResults(electionId);
        
        if (response.success) {
          setResults(response.data);
        } else {
          toast({
            title: "Error fetching results",
            description: response.message || "Failed to load election results",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate('/elections');
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        toast({
          title: "Error",
          description: "Failed to load election results. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [electionId, toast, navigate]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setClipboardCopied(true);
    
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    
    setTimeout(() => setClipboardCopied(false), 3000);
  };

  // Prepare data for pie chart based on real results
  const preparePieChartData = () => {
    if (!results || !results.roleResults || results.roleResults.length === 0) {
      return [];
    }
    
    // Use the first role for pie chart (typically in simple elections)
    // For complex elections, this will need to be adjusted
    return results.roleResults[0].candidates.map(candidate => ({
      name: candidate.candidateName,
      value: candidate.votes,
    }));
  };

  // Prepare data for turnout chart based on real results
  const prepareTurnoutData = () => {
    if (!results || !results.participationByDepartment) {
      return [];
    }
    
    return results.participationByDepartment.map(dept => ({
      name: dept.department,
      turnout: dept.turnoutPercentage,
      voters: dept.eligibleVoters,
      voted: dept.votesCast,
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <Center h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text>Loading election results...</Text>
        </VStack>
      </Center>
    );
  }

  // No results found
  if (!results) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error" variant="solid" borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <Heading size="md" mb={2}>Results Not Found</Heading>
            <Text>We couldn't find results for the specified election. It may not exist or results haven't been published yet.</Text>
          </Box>
        </Alert>
        <Button mt={4} colorScheme="brand" onClick={() => navigate('/elections')}>
          Back to Elections
        </Button>
      </Container>
    );
  }

  // Prepare chart data
  const pieChartData = preparePieChartData();
  const turnoutData = prepareTurnoutData();

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Results Header */}
        <Box bg={bgColor} p={6} borderRadius="md" borderWidth="1px" boxShadow="sm">
          <Flex align="flex-start" direction={{ base: 'column', md: 'row' }} mb={4}>
            <Box flex="1">
              <HStack mb={2}>
                <Badge colorScheme="gray" px={2} py={1}>RESULTS</Badge>
                <Badge colorScheme="blue" px={2} py={1}>FINAL</Badge>
              </HStack>
              <Heading as="h1" size="xl" mb={2}>
                {results.electionTitle}
              </Heading>
              <HStack spacing={4} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  <strong>Duration:</strong> {formatDate(results.startDate)} to {formatDate(results.endDate)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Status:</strong> {results.status.charAt(0).toUpperCase() + results.status.slice(1)}
                </Text>
              </HStack>
            </Box>
          </Flex>

          {/* Winner Banner - Show for the first role winner */}
          {results.roleResults && 
           results.roleResults.length > 0 && 
           results.roleResults[0].candidates.some(c => c.isWinner) && (
            <Box 
              mt={4} 
              p={4} 
              bg={bgLight} 
              borderRadius="md"
              borderWidth="1px"
              borderColor={bgDark}
            >
              <Flex align="center" wrap="wrap">
                <Icon as={FaTrophy} color="yellow.500" boxSize={6} mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="lg">
                    {results.roleResults[0].candidates.find(c => c.isWinner)?.candidateName}
                  </Text>
                  <Text fontSize="sm">
                    Won with {results.roleResults[0].candidates.find(c => c.isWinner)?.percentage}% of votes
                  </Text>
                </Box>
                <Spacer />
                <Stat textAlign={{ base: 'left', md: 'right' }} minW={{ base: '100%', md: 'auto' }} mt={{ base: 2, md: 0 }}>
                  <StatNumber>
                    {results.roleResults[0].candidates.find(c => c.isWinner)?.votes} votes
                  </StatNumber>
                  <StatHelpText mb={0}>
                    out of {results.totalVotesCast} total votes
                  </StatHelpText>
                </Stat>
              </Flex>
            </Box>
          )}
        </Box>

        {/* Results Overview */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Voting Results */}
          <Card>
            <CardBody>
              <Heading as="h2" size="md" mb={4}>
                Vote Distribution
              </Heading>
              
              {pieChartData.length > 0 ? (
                <Box height="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartTooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box height="300px" display="flex" alignItems="center" justifyContent="center">
                  <Text>No vote distribution data available</Text>
                </Box>
              )}
              
              <Divider my={4} />
              
              <VStack spacing={4} align="stretch">
                {results.roleResults && results.roleResults.length > 0 && 
                  results.roleResults[0].candidates.map((candidate, idx) => (
                  <Box key={candidate.candidateId}>
                    <Flex align="center" mb={1}>
                      <HStack>
                        <Box w={3} h={3} borderRadius="full" bg={COLORS[idx % COLORS.length]} />
                        <Text fontWeight={candidate.isWinner ? "bold" : "medium"}>
                          {candidate.candidateName}
                        </Text>
                      </HStack>
                      <Spacer />
                      <Text fontWeight={candidate.isWinner ? "bold" : "normal"}>
                        {candidate.votes} votes ({candidate.percentage}%)
                      </Text>
                    </Flex>
                    <Progress 
                      value={candidate.percentage} 
                      colorScheme={idx === 0 ? "blue" : 
                                 idx === 1 ? "red" : 
                                 idx === 2 ? "green" : 
                                 "purple"} 
                      size="sm" 
                      borderRadius="full" 
                    />
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Participation Statistics */}
          <Card>
            <CardBody>
              <Heading as="h2" size="md" mb={4}>
                Voter Participation
              </Heading>
              
              <SimpleGrid columns={2} spacing={6} mb={6}>
                <Stat>
                  <StatLabel>Total Eligible Voters</StatLabel>
                  <StatNumber>{results.totalEligibleVoters}</StatNumber>
                  <HStack>
                    <Icon as={FaUsers} color="gray.500" />
                    <StatHelpText mb={0}>Registered voters</StatHelpText>
                  </HStack>
                </Stat>
                
                <Stat>
                  <StatLabel>Votes Cast</StatLabel>
                  <StatNumber>{results.totalVotesCast}</StatNumber>
                  <HStack>
                    <Icon as={FaVoteYea} color="brand.500" />
                    <StatHelpText mb={0}>
                      {results.participationRate}% participation
                    </StatHelpText>
                  </HStack>
                </Stat>
              </SimpleGrid>
              
              <Box pt={2}>
                <Text fontWeight="medium" mb={3}>Turnout by Department</Text>
                {turnoutData.length > 0 ? (
                  <Box height="200px">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={turnoutData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis unit="%" />
                        <RechartTooltip 
                          formatter={(value, name) => [`${value}%`, 'Turnout']}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Bar dataKey="turnout" fill="#4299E1" name="Turnout %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Box height="200px" display="flex" alignItems="center" justifyContent="center">
                    <Text>No department data available</Text>
                  </Box>
                )}
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Detailed Results */}
        <Card>
          <CardBody>
            <Heading as="h2" size="md" mb={4}>
              Detailed Results
            </Heading>
            
            {results.roleResults && results.roleResults.length > 0 ? (
              <VStack spacing={6} align="stretch">
                {results.roleResults.map((roleResult, roleIndex) => (
                  <Box key={roleResult.roleId}>
                    <Heading size="sm" mb={3}>
                      {roleResult.roleTitle}
                    </Heading>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Candidate</Th>
                            <Th>Party</Th>
                            <Th isNumeric>Votes</Th>
                            <Th isNumeric>Percentage</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {roleResult.candidates.map((candidate) => (
                            <Tr key={candidate.candidateId}>
                              <Td fontWeight={candidate.isWinner ? "bold" : "normal"}>
                                {candidate.candidateName}
                              </Td>
                              <Td>{candidate.party}</Td>
                              <Td isNumeric>{candidate.votes}</Td>
                              <Td isNumeric>{candidate.percentage}%</Td>
                              <Td>
                                {candidate.isWinner ? (
                                  <Badge colorScheme="green">Winner</Badge>
                                ) : (
                                  <Badge colorScheme="gray">-</Badge>
                                )}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                    {roleIndex < results.roleResults.length - 1 && <Divider my={4} />}
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No detailed results available</Text>
            )}
            
            {results.participationByDepartment && results.participationByDepartment.length > 0 && (
              <>
                <Divider my={4} />
                
                <Text fontWeight="medium" mb={3}>Participation by Department</Text>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Department</Th>
                        <Th isNumeric>Eligible Voters</Th>
                        <Th isNumeric>Votes Cast</Th>
                        <Th isNumeric>Turnout %</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {results.participationByDepartment.map((dept, index) => (
                        <Tr key={index}>
                          <Td>{dept.department}</Td>
                          <Td isNumeric>{dept.eligibleVoters}</Td>
                          <Td isNumeric>{dept.votesCast}</Td>
                          <Td isNumeric>{dept.turnoutPercentage}%</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardBody>
        </Card>

        {/* Blockchain Verification */}
        <Card>
          <CardBody>
            <Heading as="h2" size="md" mb={4}>
              Blockchain Verification
            </Heading>
            
            <Text mb={4}>
              These election results are permanently recorded on the blockchain, ensuring transparency and immutability.
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>Transaction Information:</Text>
                <VStack align="stretch" spacing={1} fontSize="sm">
                  <HStack>
                    <Text fontWeight="medium">Block Number:</Text>
                    <Text>{results.blockchainData.blockNumber}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Transaction Hash:</Text>
                    <Text isTruncated maxWidth="200px">{results.blockchainData.transactionHash}</Text>
                    <Tooltip label={clipboardCopied ? "Copied!" : "Copy to clipboard"}>
                      <IconButton
                        aria-label="Copy hash"
                        icon={<FaCopy />}
                        size="xs"
                        variant="ghost"
                        onClick={() => copyToClipboard(results.blockchainData.transactionHash)}
                      />
                    </Tooltip>
                    <Link href={`https://sepolia.etherscan.io/tx/${results.blockchainData.transactionHash}`} isExternal color="blue.500">
                      <Icon as={FaExternalLinkAlt} boxSize={3} />
                    </Link>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Smart Contract:</Text>
                    <Text isTruncated maxWidth="200px">{results.blockchainData.smartContractAddress}</Text>
                    <Tooltip label="Copy to clipboard">
                      <IconButton
                        aria-label="Copy address"
                        icon={<FaCopy />}
                        size="xs"
                        variant="ghost"
                        onClick={() => copyToClipboard(results.blockchainData.smartContractAddress)}
                      />
                    </Tooltip>
                    <Link href={`https://sepolia.etherscan.io/address/${results.blockchainData.smartContractAddress}`} isExternal color="blue.500">
                      <Icon as={FaExternalLinkAlt} boxSize={3} />
                    </Link>
                  </HStack>
                </VStack>
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={2}>IPFS Information:</Text>
                <VStack align="stretch" spacing={1} fontSize="sm">
                  <HStack>
                    <Text fontWeight="medium">Election Data:</Text>
                    <Text isTruncated maxWidth="200px">{results.ipfsHash}</Text>
                    <Tooltip label="Copy to clipboard">
                      <IconButton
                        aria-label="Copy IPFS hash"
                        icon={<FaCopy />}
                        size="xs"
                        variant="ghost"
                        onClick={() => copyToClipboard(results.ipfsHash)}
                      />
                    </Tooltip>
                    <Link href={`https://ipfs.io/ipfs/${results.ipfsHash}`} isExternal color="blue.500">
                      <Icon as={FaExternalLinkAlt} boxSize={3} />
                    </Link>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Results Hash:</Text>
                    <Text isTruncated maxWidth="200px">{results.blockchainData.ipfsResultsHash}</Text>
                    <Tooltip label="Copy to clipboard">
                      <IconButton
                        aria-label="Copy results hash"
                        icon={<FaCopy />}
                        size="xs"
                        variant="ghost"
                        onClick={() => copyToClipboard(results.blockchainData.ipfsResultsHash)}
                      />
                    </Tooltip>
                    <Link href={`https://ipfs.io/ipfs/${results.blockchainData.ipfsResultsHash}`} isExternal color="blue.500">
                      <Icon as={FaExternalLinkAlt} boxSize={3} />
                    </Link>
                  </HStack>
                </VStack>
              </Box>
            </SimpleGrid>
            
            <Alert status="info" mt={4} borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="medium">Verify These Results</Text>
                <Text fontSize="sm">
                  Anyone can independently verify these results by checking the transaction on Etherscan
                  and the related data on IPFS using the links above.
                </Text>
              </Box>
            </Alert>
          </CardBody>
        </Card>

        {/* Actions */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="center">
          <Button 
            leftIcon={<FaChartBar />} 
            variant="outline" 
            colorScheme="brand"
            onClick={() => window.print()}
          >
            Export Results
          </Button>
          
          <Button 
            leftIcon={<FaLink />} 
            colorScheme="brand"
            onClick={() => {
              copyToClipboard(window.location.href);
              toast({
                title: "Link copied",
                description: "Results link has been copied to clipboard",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            Share Results
          </Button>
        </Stack>
      </VStack>
    </Container>
  );
};

export default ResultsPage;