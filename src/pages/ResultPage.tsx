// src/pages/ResultsPage.tsx
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
  Image,
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
} from '@chakra-ui/react';
import {
  FaTrophy,
  FaUsers,
  FaVoteYea,
  FaCheckCircle,
  FaUserCircle,
  FaLink,
  FaExternalLinkAlt,
  FaChartBar,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
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
import { useToast } from "@chakra-ui/react";


// Mock data - in a real app, this would come from your API
const mockElectionResults = {
  election: {
    id: '3',
    title: 'Campus Facilities Referendum',
    description: 'Vote on the proposed changes to campus facilities and resource allocation.',
    startDate: '2025-02-25T08:00:00',
    endDate: '2025-02-28T20:00:00',
    status: 'completed',
    totalVoters: 567,
    totalVotesCast: 423,
    ipfsHash: 'QmT8JKnCocLG5ByYPHYEcmEyMCHYLLNdRwPWZGxR3QuW7P',
    transactionHash: '0x8f3a8bc5b6e9e4c2d7a2e1d0c9b8a7f6e5d4c3b2a1d0e9f8a7b6c5d4e3f2a1b0c9',
    blockNumber: 14567823,
  },
  results: [
    {
      id: '1',
      option: 'Yes - Approve Changes',
      votes: 289,
      percentage: 68.3,
      color: '#4299E1', // blue.400
      isWinner: true,
    },
    {
      id: '2',
      option: 'No - Reject Changes',
      votes: 134,
      percentage: 31.7,
      color: '#F56565', // red.400
      isWinner: false,
    },
  ],
  participationByDepartment: [
    { name: 'Information Technology', voters: 142, turnout: 86 },
    { name: 'Computer Science', voters: 124, turnout: 79 },
    { name: 'Business Administration', voters: 86, turnout: 62 },
    { name: 'Engineering', voters: 113, turnout: 71 },
    { name: 'Arts & Humanities', voters: 102, turnout: 58 },
  ],
  verificationInfo: {
    smartContractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    resultsHash: 'QmX9vNMBQjRCUjnzh6YYAo8jst3UUXvqXVhvjvJosGDzTx',
  },
};

// COLORS for pie chart
const COLORS = ['#4299E1', '#F56565', '#48BB78', '#ECC94B', '#9F7AEA', '#ED64A6'];

const ResultsPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [results, setResults] = useState<typeof mockElectionResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgLight = useColorModeValue("blue.50", "blue.900")
  const bgDark = useColorModeValue("blue.200", "blue.700")

  // Compute participation rate
  const participationRate = (results?.election?.totalVoters ?? 0) > 0
    ? Math.round(((results?.election?.totalVotesCast ?? 0) / (results?.election?.totalVoters ?? 1)) * 100)
    : 0;

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch election results
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setResults(mockElectionResults);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching election results:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [electionId]);

  // Prepare data for pie chart
  const pieChartData = results?.results.map(result => ({
    name: result.option,
    value: result.votes,
  }));

  // Prepare data for turnout chart
  const turnoutData = results?.participationByDepartment.map(dept => ({
    name: dept.name,
    turnout: Math.round((dept.turnout / dept.voters) * 100),
    voters: dept.voters,
    voted: dept.turnout,
  }));

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
                {results.election.title}
              </Heading>
              <Text color="gray.600" mb={4}>
                {results.election.description}
              </Text>
              <HStack spacing={4} wrap="wrap">
                <Text fontSize="sm" color="gray.600">
                  <strong>Duration:</strong> {formatDate(results.election.startDate)} to {formatDate(results.election.endDate)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Status:</strong> {results.election.status.charAt(0).toUpperCase() + results.election.status.slice(1)}
                </Text>
              </HStack>
            </Box>
          </Flex>

          {/* Winner Banner */}
          {results.results.some(r => r.isWinner) && (
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
                    {results.results.find(r => r.isWinner)?.option}
                  </Text>
                  <Text fontSize="sm">
                    Won with {results.results.find(r => r.isWinner)?.percentage}% of votes
                  </Text>
                </Box>
                <Spacer />
                <Stat textAlign={{ base: 'left', md: 'right' }} minW={{ base: '100%', md: 'auto' }} mt={{ base: 2, md: 0 }}>
                  <StatNumber>
                    {results.results.find(r => r.isWinner)?.votes} votes
                  </StatNumber>
                  <StatHelpText mb={0}>
                    out of {results.election.totalVotesCast} total votes
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
                      {pieChartData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartTooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <Divider my={4} />
              
              <VStack spacing={4} align="stretch">
                {results.results.map((result) => (
                  <Box key={result.id}>
                    <Flex align="center" mb={1}>
                      <HStack>
                        <Box w={3} h={3} borderRadius="full" bg={result.color} />
                        <Text fontWeight={result.isWinner ? "bold" : "medium"}>
                          {result.option}
                        </Text>
                      </HStack>
                      <Spacer />
                      <Text fontWeight={result.isWinner ? "bold" : "normal"}>
                        {result.votes} votes ({result.percentage}%)
                      </Text>
                    </Flex>
                    <Progress 
                      value={result.percentage} 
                      colorScheme={result.color.includes('4299E1') ? 'blue' : 
                                   result.color.includes('F56565') ? 'red' : 
                                   result.color.includes('48BB78') ? 'green' : 
                                   'purple'} 
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
                  <StatNumber>{results.election.totalVoters}</StatNumber>
                  <HStack>
                    <Icon as={FaUsers} color="gray.500" />
                    <StatHelpText mb={0}>Registered voters</StatHelpText>
                  </HStack>
                </Stat>
                
                <Stat>
                  <StatLabel>Votes Cast</StatLabel>
                  <StatNumber>{results.election.totalVotesCast}</StatNumber>
                  <HStack>
                    <Icon as={FaVoteYea} color="brand.500" />
                    <StatHelpText mb={0}>
                      {participationRate}% participation
                    </StatHelpText>
                  </HStack>
                </Stat>
              </SimpleGrid>
              
              <Box pt={2}>
                <Text fontWeight="medium" mb={3}>Turnout by Department</Text>
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
            
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Option</Th>
                    <Th isNumeric>Votes</Th>
                    <Th isNumeric>Percentage</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {results.results.map((result) => (
                    <Tr key={result.id}>
                      <Td fontWeight={result.isWinner ? "bold" : "normal"}>
                        {result.option}
                      </Td>
                      <Td isNumeric>{result.votes}</Td>
                      <Td isNumeric>{result.percentage}%</Td>
                      <Td>
                        {result.isWinner ? (
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
                      <Td>{dept.name}</Td>
                      <Td isNumeric>{dept.voters}</Td>
                      <Td isNumeric>{dept.turnout}</Td>
                      <Td isNumeric>{Math.round((dept.turnout / dept.voters) * 100)}%</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
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
                    <Text>{results.election.blockNumber}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Transaction Hash:</Text>
                    <Text isTruncated>{results.election.transactionHash.substring(0, 20)}...</Text>
                    <Link href={`https://etherscan.io/tx/${results.election.transactionHash}`} isExternal color="blue.500">
                      <Icon as={FaExternalLinkAlt} boxSize={3} />
                    </Link>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Smart Contract:</Text>
                    <Text isTruncated>{results.verificationInfo.smartContractAddress.substring(0, 20)}...</Text>
                    <Link href={`https://etherscan.io/address/${results.verificationInfo.smartContractAddress}`} isExternal color="blue.500">
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
                    <Text isTruncated>{results.election.ipfsHash}</Text>
                    <Link href={`https://ipfs.io/ipfs/${results.election.ipfsHash}`} isExternal color="blue.500">
                      <Icon as={FaExternalLinkAlt} boxSize={3} />
                    </Link>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Results Hash:</Text>
                    <Text isTruncated>{results.verificationInfo.resultsHash}</Text>
                    <Link href={`https://ipfs.io/ipfs/${results.verificationInfo.resultsHash}`} isExternal color="blue.500">
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
              navigator.clipboard.writeText(window.location.href);
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

// Add this import at the top

export default ResultsPage;