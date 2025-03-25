// src/pages/ElectionDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Divider,
  Flex,
  Spacer,
  SimpleGrid,
  Avatar,
  Card,
  CardBody,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  useToast
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaInfoCircle,
  FaCheckCircle,
  FaChartBar,
  FaVoteYea,
  FaShieldAlt,
  FaRegQuestionCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getElectionById } from "../services/electionService";

interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  manifesto: string;
  imageUrl: string;
}

interface Role {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
}

interface Department {
  name: string;
}

interface Level {
  name: string;
}

interface Eligibility {
  type: string;
  departments?: Department[];
  levels?: Level[];
  description: string;
}

interface Organizer {
  name: string;
  contact: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Election {
  id: string;
  title: string;
  description: string;
  instructions: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  eligibility: Eligibility;
  organizer: Organizer;
  totalEligibleVoters: number;
  totalVotesCast: number;
  roles: Role[];
  securityFeatures: string[];
  faqs: FAQ[];
}

const ElectionDetails = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [election, setElection] = useState<Election | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Fetch election data from API
  useEffect(() => {
    const fetchElection = async () => {
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
        
        const response = await getElectionById(electionId);
        
        if (response.success) {
          setElection(response.data);
        } else {
          toast({
            title: "Error fetching election",
            description: response.message || "Failed to load election details",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate('/elections');
        }
      } catch (error) {
        console.error('Error fetching election:', error);
        toast({
          title: "Error",
          description: "Failed to load election details. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate('/elections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchElection();
  }, [electionId, toast, navigate]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge colorScheme="green" py={1} px={2} fontSize="md">
            Active
          </Badge>
        );
      case "upcoming":
        return (
          <Badge colorScheme="blue" py={1} px={2} fontSize="md">
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge colorScheme="gray" py={1} px={2} fontSize="md">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Calculate time remaining or time elapsed
  const getTimeInfo = (
    election: Election
  ) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (election.status === "upcoming") {
      const diffTime = Math.abs(start.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Starts in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } else if (election.status === "active") {
      const diffTime = Math.abs(end.getTime() - now.getTime());
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} remaining`;
    } else {
      return `Ended on ${formatDate(election.endDate)}`;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Center h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text>Loading election details...</Text>
        </VStack>
      </Center>
    );
  }

  // No election found
  if (!election) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error" variant="solid" borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Election not found!</AlertTitle>
          <AlertDescription>
            The election you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
        <Button
          mt={4}
          colorScheme="brand"
          onClick={() => navigate("/elections")}
        >
          Back to Elections
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Election Header */}
        <Box
          bg={bgColor}
          p={6}
          borderRadius="md"
          borderWidth="1px"
          boxShadow="sm"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "start", md: "center" }}
            mb={4}
          >
            <Box flex="1">
              <HStack mb={2}>
                {election.type === "complex" && (
                  <Badge colorScheme="orange" variant="subtle" py={1} px={2}>
                    Multi-Position
                  </Badge>
                )}
                {getStatusBadge(election.status)}
              </HStack>
              <Heading as="h1" size="xl" mb={2}>
                {election.title}
              </Heading>
              <Text fontSize="md" mb={4}>
                {election.description}
              </Text>
            </Box>
            <Spacer />
            <Box>
              {election.status === "active" && (
                <Button
                  as={RouterLink}
                  to={`/vote/${election.id}`}
                  colorScheme="brand"
                  size="lg"
                  leftIcon={<FaVoteYea />}
                  mt={{ base: 4, md: 0 }}
                >
                  Vote Now
                </Button>
              )}
            </Box>
          </Flex>

          <Divider my={4} />

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <HStack>
              <Icon as={FaCalendarAlt} color="brand.500" boxSize={5} />
              <Box>
                <Text fontWeight="medium">Duration</Text>
                <Text fontSize="sm">
                  {formatDate(election.startDate)} -{" "}
                  {formatDate(election.endDate)}
                </Text>
              </Box>
            </HStack>

            <HStack>
              <Icon as={FaClock} color="brand.500" boxSize={5} />
              <Box>
                <Text fontWeight="medium">Status</Text>
                <Text fontSize="sm">{getTimeInfo(election)}</Text>
              </Box>
            </HStack>

            <HStack>
              <Icon as={FaUsers} color="brand.500" boxSize={5} />
              <Box>
                <Text fontWeight="medium">Participation</Text>
                <Text fontSize="sm">
                  {election.totalVotesCast} of {election.totalEligibleVoters}{" "}
                  eligible voters
                </Text>
              </Box>
            </HStack>
          </SimpleGrid>
        </Box>

        {/* Main Content */}
        <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={6}>
          {/* Left Sidebar */}
          <Box gridColumn={{ lg: "span 1" }}>
            <VStack spacing={6} align="stretch">
              {/* Organizer Info */}
              <Card borderWidth="1px" borderRadius="md" overflow="hidden">
                <CardBody>
                  <Heading size="sm" mb={3}>
                    Organizer
                  </Heading>
                  <Text fontWeight="medium">{election.organizer.name}</Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    Contact: {election.organizer.contact}
                  </Text>
                </CardBody>
              </Card>

              {/* Eligibility Info */}
              <Card borderWidth="1px" borderRadius="md" overflow="hidden">
                <CardBody>
                  <Heading size="sm" mb={3}>
                    Voter Eligibility
                  </Heading>
                  <Badge colorScheme="blue" mb={2}>
                    {election.eligibility.type === "department"
                      ? "Department Restricted"
                      : election.eligibility.type === "level"
                      ? "Level Restricted"
                      : "General"}
                  </Badge>
                  <Text fontSize="sm" mt={2}>
                    {election.eligibility.description}
                  </Text>

                  {election.eligibility.type === "department" &&
                    election.eligibility.departments && (
                      <Box mt={3}>
                        <Text fontSize="sm" fontWeight="medium">
                          Eligible Departments:
                        </Text>
                        <Flex wrap="wrap" gap={2} mt={1}>
                          {election.eligibility.departments.map(
                            (dept, index) => (
                              <Badge
                                key={index}
                                colorScheme="gray"
                                variant="subtle"
                              >
                                {dept.name}
                              </Badge>
                            )
                          )}
                        </Flex>
                      </Box>
                    )}

                  {election.eligibility.type === "level" &&
                    election.eligibility.levels && (
                      <Box mt={3}>
                        <Text fontSize="sm" fontWeight="medium">
                          Eligible Levels:
                        </Text>
                        <Flex wrap="wrap" gap={2} mt={1}>
                          {election.eligibility.levels.map((level, index) => (
                            <Badge
                              key={index}
                              colorScheme="gray"
                              variant="subtle"
                            >
                              {level.name}
                            </Badge>
                          ))}
                        </Flex>
                      </Box>
                    )}
                </CardBody>
              </Card>

              {/* Security Features */}
              <Card borderWidth="1px" borderRadius="md" overflow="hidden">
                <CardBody>
                  <Heading size="sm" mb={3}>
                    Security Features
                  </Heading>
                  <List spacing={2}>
                    {election.securityFeatures.map((feature, index) => (
                      <ListItem key={index} fontSize="sm">
                        <ListIcon as={FaShieldAlt} color="green.500" />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            </VStack>
          </Box>

          {/* Main Content Area */}
          <Box gridColumn={{ lg: "span 3" }}>
            <Tabs colorScheme="brand" isLazy>
              <TabList>
                <Tab fontWeight="semibold">Positions & Candidates</Tab>
                <Tab fontWeight="semibold">Election Rules</Tab>
                <Tab fontWeight="semibold">FAQ</Tab>
              </TabList>

              <TabPanels>
                {/* Positions & Candidates Tab */}
                <TabPanel px={0}>
                  <Box mb={4}>
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <AlertDescription>
                        {election.instructions}
                      </AlertDescription>
                    </Alert>
                  </Box>

                  <VStack spacing={6} align="stretch">
                    {election.roles.map((role) => (
                      <Box
                        key={role.id}
                        borderWidth="1px"
                        borderRadius="md"
                        overflow="hidden"
                        p={4}
                      >
                        <Heading size="md" mb={2}>
                          {role.title}
                        </Heading>
                        <Text color="gray.600" mb={4}>
                          {role.description}
                        </Text>

                        <Divider mb={4} />

                        <Heading size="sm" mb={3}>
                          Candidates ({role.candidates.length})
                        </Heading>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          {role.candidates.map((candidate) => (
                            <Box
                              key={candidate.id}
                              borderWidth="1px"
                              borderRadius="md"
                              p={4}
                              _hover={{ boxShadow: "md" }}
                              transition="all 0.2s"
                            >
                              <Flex>
                                <Avatar
                                  size="lg"
                                  name={candidate.name}
                                  src={candidate.imageUrl}
                                  mr={4}
                                />
                                <Box>
                                  <Heading size="sm" mb={1}>
                                    {candidate.name}
                                  </Heading>
                                  <Badge colorScheme="blue" mb={2}>
                                    {candidate.party}
                                  </Badge>
                                  <Text fontSize="sm" color="gray.600">
                                    {candidate.manifesto}
                                  </Text>
                                </Box>
                              </Flex>
                            </Box>
                          ))}
                        </SimpleGrid>
                      </Box>
                    ))}
                  </VStack>
                </TabPanel>

                {/* Election Rules Tab */}
                <TabPanel>
                  <Card borderWidth="1px" borderRadius="md" overflow="hidden">
                    <CardBody>
                      <VStack spacing={6} align="stretch">
                        <Box>
                          <Heading size="md" mb={3}>
                            Voting Rules
                          </Heading>
                          <List spacing={3}>
                            <ListItem>
                              <ListIcon as={FaInfoCircle} color="blue.500" />
                              Each eligible voter can vote exactly once in this
                              election.
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FaInfoCircle} color="blue.500" />
                              {election.type === "simple"
                                ? "Select one candidate for the position."
                                : "Select one candidate for each position."}
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FaInfoCircle} color="blue.500" />
                              Votes are final and cannot be changed once
                              submitted.
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FaInfoCircle} color="blue.500" />
                              Results will be published immediately after the
                              election ends.
                            </ListItem>
                          </List>
                        </Box>

                        <Divider />

                        <Box>
                          <Heading size="md" mb={3}>
                            Eligibility Rules
                          </Heading>
                          <Text mb={3}>This election is open to:</Text>
                          <Text fontWeight="medium">
                            {election.eligibility.description}
                          </Text>
                        </Box>

                        <Divider />

                        <Box>
                          <Heading size="md" mb={3}>
                            Vote Verification
                          </Heading>
                          <Text mb={3}>
                            After voting, you will receive a receipt with a
                            transaction ID that allows you to:
                          </Text>
                          <List spacing={3}>
                            <ListItem>
                              <ListIcon as={FaCheckCircle} color="green.500" />
                              Verify your vote was recorded on the blockchain
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FaCheckCircle} color="green.500" />
                              Check that your vote was included in the final
                              tally
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FaCheckCircle} color="green.500" />
                              Confirm your vote's integrity was maintained
                            </ListItem>
                          </List>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </TabPanel>

                {/* FAQ Tab */}
                <TabPanel>
                  <Card borderWidth="1px" borderRadius="md" overflow="hidden">
                    <CardBody>
                      <Heading size="md" mb={4}>
                        Frequently Asked Questions
                      </Heading>
                      <VStack spacing={4} align="stretch">
                        {election.faqs && election.faqs.length > 0 ? (
                          election.faqs.map((faq, index) => (
                            <Box
                              key={index}
                              p={4}
                              borderWidth="1px"
                              borderRadius="md"
                            >
                              <HStack align="flex-start" mb={2}>
                                <Icon
                                  as={FaRegQuestionCircle}
                                  color="brand.500"
                                  mt={1}
                                />
                                <Text fontWeight="bold">{faq.question}</Text>
                              </HStack>
                              <Box pl={7}>
                                <Text>{faq.answer}</Text>
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Text>No FAQs available for this election.</Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </SimpleGrid>

        {/* Action Buttons */}
        <Flex justify="center" mt={4}>
          <HStack spacing={4}>
            <Button
              leftIcon={<FaArrowLeft />}
              onClick={() => navigate("/elections")}
              variant="outline"
            >
              Back to Elections
            </Button>

            {election.status === "active" && (
              <Button
                leftIcon={<FaVoteYea />}
                colorScheme="brand"
                as={RouterLink}
                to={`/vote/${election.id}`}
              >
                Vote Now
              </Button>
            )}

            {election.status === "completed" && (
              <Button
                leftIcon={<FaChartBar />}
                colorScheme="blue"
                as={RouterLink}
                to={`/results/${election.id}`}
              >
                View Results
              </Button>
            )}
          </HStack>
        </Flex>
      </VStack>
    </Container>
  );
};

export default ElectionDetails;