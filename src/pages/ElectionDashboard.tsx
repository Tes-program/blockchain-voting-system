// src/pages/ElectionsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  VStack,
  Flex,
  Icon,
  useColorModeValue,
  Divider,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaUsers, FaCheckCircle, FaHourglassHalf, FaBriefcase } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getAllElections } from '../services/electionService';

// Mock data - in a real app, this would come from your API

const ElectionsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [elections, setElections] = useState<ElectionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bgSecColor = useColorModeValue('gray.50', 'gray.700');

  // Fetch elections data from API
  useEffect(() => {
    const fetchElections = async () => {
      setIsLoading(true);
      try {
        const response = await getAllElections();
        
        // Check if response is successful and data is an array
        if (response.success && Array.isArray(response.data)) {
          setElections(response.data);
        } else if (response.success && typeof response.data === 'object' && !Array.isArray(response.data)) {
          // If data is an object but not an array, it might have a different structure
          // Check if there's a property that contains the elections array
          if (response.data.elections && Array.isArray(response.data.elections)) {
            setElections(response.data.elections);
          } else {
            // If we can't find an array, log error and set empty array
            console.error("Unexpected data format:", response.data);
            setElections([]);
            toast({
              title: "Data format error",
              description: "Unable to process elections data. Please try again later.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        } else {
          // Handle unsuccessful response
          console.error("Failed to fetch elections:", response.message || "Unknown error");
          setElections([]);
          toast({
            title: "Error fetching elections",
            description: response.message || "Failed to load elections",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching elections:', error);
        setElections([]);
        toast({
          title: "Error",
          description: "Failed to load elections. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchElections();
  }, [toast]);

  // Filter elections by status - with safety checks
  const activeElections = Array.isArray(elections) ? elections.filter(election => election.status === 'active') : [];
  const upcomingElections = Array.isArray(elections) ? elections.filter(election => election.status === 'upcoming') : [];
  const completedElections = Array.isArray(elections) ? elections.filter(election => election.status === 'completed') : [];



  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge
  const getStatusBadge = (status: string, hasVoted: boolean) => {
    switch (status) {
      case 'active':
        return hasVoted ? (
          <Badge colorScheme="green">Voted</Badge>
        ) : (
          <Badge colorScheme="blue">Active</Badge>
        );
      case 'upcoming':
        return <Badge colorScheme="purple">Upcoming</Badge>;
      case 'completed':
        return <Badge colorScheme="gray">Completed</Badge>;
      default:
        return null;
    }
  };

  // Calculate time remaining or time elapsed
  const getTimeInfo = (election: { status: string; startDate: string; endDate: string }) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (election.status === 'upcoming') {
      const diffTime = Math.abs(start.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Starts in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (election.status === 'active') {
      const diffTime = Math.abs(end.getTime() - now.getTime());
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} remaining`;
    } else {
      return `Ended on ${formatDate(election.endDate)}`;
    }
  };

  // Election card component
  type ElectionType = {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    type: string;
    totalCandidates: number;
    totalEligibleVoters: number;
    hasVoted: boolean;
    numberOfPositions: number;
  };

  const ElectionCard = ({ election }: { election: ElectionType }) => {
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    
    return (
      <Card 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden"
        bg={cardBg}
        borderColor={borderColor}
        boxShadow="sm"
        transition="all 0.3s"
        _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
      >
        <CardHeader pb={0}>
          <Flex justify="space-between" align="flex-start">
            <Heading size="md" fontWeight="semibold" noOfLines={2}>
              {election.title}
            </Heading>
            <HStack>
              {election.type === 'complex' && (
                <Badge colorScheme="orange" variant="subtle">
                  Multi-Position
                </Badge>
              )}
              {getStatusBadge(election.status, election.hasVoted)}
            </HStack>
          </Flex>
        </CardHeader>

        <CardBody>
          <Text noOfLines={2} mb={4}>
            {election.description}
          </Text>
          
          <VStack spacing={3} align="stretch">
            <HStack spacing={2}>
              <Icon as={FaCalendarAlt} color="brand.500" />
              <Text fontSize="sm">
                {formatDate(election.startDate)} - {formatDate(election.endDate)}
              </Text>
            </HStack>
            
            <HStack spacing={2}>
              <Icon as={FaHourglassHalf} color="brand.500" />
              <Text fontSize="sm" fontWeight="medium">
                {getTimeInfo(election)}
              </Text>
            </HStack>
            
            <HStack spacing={2}>
              <Icon as={FaUsers} color="brand.500" />
              <Text fontSize="sm">
                {election.type === 'simple' 
                  ? `${election.totalCandidates} candidate${election.totalCandidates !== 1 ? 's' : ''} • ${election.totalEligibleVoters} voter${election.totalEligibleVoters !== 1 ? 's' : ''}`
                  : `${election.totalEligibleVoters} voter${election.totalEligibleVoters !== 1 ? 's' : ''}`
                }
              </Text>
            </HStack>
            
            {election.type === 'complex' && (
              <HStack spacing={2}>
                <Icon as={FaBriefcase} color="brand.500" />
                <Text fontSize="sm">
                  {election.numberOfPositions} position{election.numberOfPositions !== 1 ? 's' : ''} • {election.totalCandidates} candidate{election.totalCandidates !== 1 ? 's' : ''}
                </Text>
              </HStack>
            )}
            
            {election.hasVoted && (
              <HStack spacing={2}>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontSize="sm" color="green.500" fontWeight="medium">
                  You have voted in this election
                </Text>
              </HStack>
            )}
          </VStack>
        </CardBody>

        <Divider />

        <CardFooter pt={3}>
          {election.status === 'active' && !election.hasVoted && (
            <Button 
              as={RouterLink} 
              to={`/vote/${election._id}`}
              colorScheme="brand" 
              size="md" 
              width="full"
            >
              Vote Now
            </Button>
          )}
          
          {election.status === 'active' && election.hasVoted && (
            <Button 
              as={RouterLink} 
              to={`/verify/${election._id}`}
              variant="outline" 
              colorScheme="brand" 
              size="md" 
              width="full"
            >
              View My Vote
            </Button>
          )}
          
          {election.status === 'upcoming' && (
            <Button 
              as={RouterLink} 
              to={`/elections/${election._id}`}
              variant="outline" 
              colorScheme="brand" 
              size="md" 
              width="full"
            >
              View Details
            </Button>
          )}
          
          {election.status === 'completed' && (
            <Button 
              as={RouterLink} 
              to={`/results/${election._id}`}
              variant="solid" 
              colorScheme="blue" 
              size="md" 
              width="full"
            >
              View Results
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  // Loading skeleton component
  const ElectionCardSkeleton = () => (
    <Card borderWidth="1px" borderRadius="lg" overflow="hidden">
      <CardHeader>
        <Skeleton height="24px" width="80%" />
      </CardHeader>
      <CardBody>
        <Skeleton height="40px" mb={4} />
        <VStack spacing={3} align="stretch">
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </VStack>
      </CardBody>
      <CardFooter>
        <Skeleton height="36px" width="100%" />
      </CardFooter>
    </Card>
  );

  // Render the skeletons while loading
  const renderSkeletons = () => (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {[...Array(6)].map((_, i) => (
        <ElectionCardSkeleton key={i} />
      ))}
    </SimpleGrid>
  );

  return (
    <Container maxW="6xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          Elections Dashboard
        </Heading>
        <Text color="gray.600">
          View and participate in elections. Your vote is secure and verifiable with blockchain technology.
        </Text>
      </Box>

      <Tabs colorScheme="brand" isLazy>
        <TabList>
          <Tab fontWeight="semibold">Active Elections</Tab>
          <Tab fontWeight="semibold">Upcoming</Tab>
          <Tab fontWeight="semibold">Past Elections</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {isLoading ? (
              renderSkeletons()
            ) : activeElections.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {activeElections.map((election) => (
                  <ElectionCard key={election._id} election={election} />
                ))}
              </SimpleGrid>
            ) : (
              <Box 
                p={8} 
                textAlign="center" 
                borderWidth="1px" 
                borderRadius="lg"
                bg={bgSecColor}
              >
                <Heading size="md" mb={2}>No Active Elections</Heading>
                <Text>There are no active elections at the moment. Check the upcoming elections tab.</Text>
              </Box>
            )}
          </TabPanel>

          <TabPanel>
            {isLoading ? (
              renderSkeletons()
            ) : upcomingElections.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {upcomingElections.map((election) => (
                  <ElectionCard key={election._id} election={election} />
                ))}
              </SimpleGrid>
            ) : (
              <Box 
                p={8} 
                textAlign="center" 
                borderWidth="1px" 
                borderRadius="lg"
                bg={bgSecColor}
              >
                <Heading size="md" mb={2}>No Upcoming Elections</Heading>
                <Text>There are no upcoming elections scheduled at this time.</Text>
              </Box>
            )}
          </TabPanel>

          <TabPanel>
            {isLoading ? (
              renderSkeletons()
            ) : completedElections.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {completedElections.map((election) => (
                  <ElectionCard key={election._id} election={election} />
                ))}
              </SimpleGrid>
            ) : (
              <Box 
                p={8} 
                textAlign="center" 
                borderWidth="1px" 
                borderRadius="lg"
                bg={bgSecColor}
              >
                <Heading size="md" mb={2}>No Past Elections</Heading>
                <Text>There are no completed elections in your history yet.</Text>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ElectionsDashboard;