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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  Card,
  CardBody,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
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
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaUserCheck,
  FaInfoCircle,
  FaCheckCircle,
  FaBriefcase,
  FaChartBar,
  FaVoteYea,
  FaRegClock,
  FaShieldAlt,
  FaRegQuestionCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

// Mock election data
const mockElections = {
  // Simple election
  "2": {
    id: "2",
    title: "Department Representative Election",
    description:
      "Choose your department representatives for various committees.",
    instructions:
      "Select ONE candidate from the list below. Your vote is confidential and secure. Once submitted, your vote cannot be changed.",
    startDate: "2025-03-05T10:00:00",
    endDate: "2025-03-07T16:00:00",
    status: "active",
    type: "simple",
    eligibility: {
      type: "department",
      departments: ["Computer Science", "Information Technology"],
      description:
        "Open to students in the Computer Science and Information Technology departments",
    },
    organizer: {
      name: "Faculty of Computing and Information Technology",
      contact: "elections@cit.edu",
    },
    totalEligibleVoters: 156,
    totalVotesCast: 89,
    roles: [
      {
        id: "role-1",
        title: "Department Representative",
        description:
          "Represents the department in faculty meetings and committees.",
        candidates: [
          {
            id: "1",
            name: "Sarah Johnson",
            party: "Progressive Student Alliance",
            position: "Department Representative",
            manifesto:
              "I will work to improve student facilities and ensure that student voices are heard in all department decisions.",
            imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
          },
          {
            id: "2",
            name: "Michael Chen",
            party: "Student Action Committee",
            position: "Department Representative",
            manifesto:
              "My goal is to create more research opportunities for students and facilitate better communication between faculty and students.",
            imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
          },
          {
            id: "3",
            name: "Aisha Patel",
            party: "Independent",
            position: "Department Representative",
            manifesto:
              "I believe in inclusive education and will work towards ensuring equal opportunities for all students regardless of their background.",
            imageUrl: "https://randomuser.me/api/portraits/women/28.jpg",
          },
          {
            id: "4",
            name: "James Wilson",
            party: "Tech Innovation Group",
            position: "Department Representative",
            manifesto:
              "I will push for curriculum modernization and more practical, hands-on learning experiences.",
            imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
        ],
      },
    ],
    securityFeatures: [
      "Blockchain-based vote recording",
      "End-to-end encryption",
      "Zero-knowledge proofs for privacy",
      "Immutable audit trail",
    ],
    faqs: [
      {
        question: "When will results be announced?",
        answer:
          "Results will be published immediately after the election ends on March 7, 2025, at 4:00 PM.",
      },
      {
        question: "Can I change my vote after submitting?",
        answer:
          "No, once your vote is submitted and recorded on the blockchain, it cannot be changed.",
      },
      {
        question: "How can I verify my vote was counted?",
        answer:
          "After voting, you will receive a receipt with a transaction ID that you can use to verify your vote was recorded.",
      },
    ],
  },

  // Complex election
  "5": {
    id: "5",
    title: "Faculty Council Election",
    description:
      "Vote for representatives to serve on the Faculty Council for the 2025-2026 academic year.",
    instructions:
      "Select ONE candidate for each position. You must vote for all positions to complete your ballot.",
    startDate: "2025-03-15T08:00:00",
    endDate: "2025-03-20T18:00:00",
    status: "upcoming",
    type: "complex",
    eligibility: {
      type: "level",
      levels: ["300 Level", "400 Level", "500 Level", "Postgraduate"],
      description:
        "Open to students in 300 Level and above across all departments",
    },
    organizer: {
      name: "University Electoral Commission",
      contact: "electoral.commission@university.edu",
    },
    totalEligibleVoters: 1250,
    totalVotesCast: 0,
    roles: [
      {
        id: "role-1",
        title: "Faculty President",
        description:
          "Leads the faculty council and represents student interests to the administration.",
        candidates: [
          {
            id: "c1-1",
            name: "Dr. James Wilson",
            party: "Academic Excellence",
            position: "Faculty President",
            manifesto:
              "I will work to improve student facilities and ensure faculty development opportunities.",
            imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            id: "c1-2",
            name: "Dr. Sarah Miller",
            party: "Progressive Faculty",
            position: "Faculty President",
            manifesto:
              "My goal is to foster interdisciplinary collaboration and innovative teaching methods.",
            imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
          },
          {
            id: "c1-3",
            name: "Dr. Robert Chen",
            party: "Independent",
            position: "Faculty President",
            manifesto:
              "I believe in transparent governance and will prioritize student-faculty engagement.",
            imageUrl: "https://randomuser.me/api/portraits/men/76.jpg",
          },
        ],
      },
      {
        id: "role-2",
        title: "Vice President for Academic Affairs",
        description:
          "Oversees all academic matters and curriculum development.",
        candidates: [
          {
            id: "c2-1",
            name: "Dr. Emily Johnson",
            party: "Academic Excellence",
            position: "VP Academic Affairs",
            manifesto:
              "I will focus on curriculum innovation and improving academic resources.",
            imageUrl: "https://randomuser.me/api/portraits/women/22.jpg",
          },
          {
            id: "c2-2",
            name: "Dr. Michael Williams",
            party: "Progressive Faculty",
            position: "VP Academic Affairs",
            manifesto:
              "I will champion student-centered learning and faculty development initiatives.",
            imageUrl: "https://randomuser.me/api/portraits/men/52.jpg",
          },
        ],
      },
      {
        id: "role-3",
        title: "Treasurer",
        description:
          "Manages the faculty budget and oversees financial planning.",
        candidates: [
          {
            id: "c3-1",
            name: "Dr. Aisha Patel",
            party: "Academic Excellence",
            position: "Treasurer",
            manifesto:
              "I will ensure transparent financial management and equitable resource allocation.",
            imageUrl: "https://randomuser.me/api/portraits/women/28.jpg",
          },
          {
            id: "c3-2",
            name: "Dr. David Kim",
            party: "Independent",
            position: "Treasurer",
            manifesto:
              "I will implement efficient budgeting practices and seek additional funding sources.",
            imageUrl: "https://randomuser.me/api/portraits/men/42.jpg",
          },
        ],
      },
      {
        id: "role-4",
        title: "Secretary",
        description:
          "Maintains records and facilitates communication within the faculty.",
        candidates: [
          {
            id: "c4-1",
            name: "Dr. Lisa Martinez",
            party: "Progressive Faculty",
            position: "Secretary",
            manifesto:
              "I will improve communication channels and maintain accurate documentation.",
            imageUrl: "https://randomuser.me/api/portraits/women/67.jpg",
          },
          {
            id: "c4-2",
            name: "Dr. John Thompson",
            party: "Academic Excellence",
            position: "Secretary",
            manifesto:
              "I will modernize our record-keeping systems and ensure timely information sharing.",
            imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
          },
          {
            id: "c4-3",
            name: "Dr. Grace Lee",
            party: "Independent",
            position: "Secretary",
            manifesto:
              "I will focus on transparency and accessibility of faculty information.",
            imageUrl: "https://randomuser.me/api/portraits/women/33.jpg",
          },
        ],
      },
    ],
    securityFeatures: [
      "Blockchain-based vote recording",
      "End-to-end encryption",
      "Zero-knowledge proofs for privacy",
      "Immutable audit trail",
      "Multi-step verification process",
    ],
    faqs: [
      {
        question: "When will results be announced?",
        answer:
          "Results will be published immediately after the election ends on March 20, 2025, at 6:00 PM.",
      },
      {
        question: "Do I need to vote for all positions?",
        answer: "Yes, you must vote for all positions to complete your ballot.",
      },
      {
        question: "Can I change my vote after submitting?",
        answer:
          "No, once your vote is submitted and recorded on the blockchain, it cannot be changed.",
      },
      {
        question: "How can I verify my vote was counted?",
        answer:
          "After voting, you will receive a receipt with a transaction ID that you can use to verify your vote was recorded.",
      },
    ],
  },
};

const ElectionDetails = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [election, setElection] = useState<
    (typeof mockElections)[keyof typeof mockElections] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Fetch election data
  useEffect(() => {
    const fetchElection = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          if (electionId) {
            const electionData =
              mockElections[electionId as keyof typeof mockElections];
            setElection(electionData);
          }
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching election:", error);
        setIsLoading(false);
      }
    };

    fetchElection();
  }, [electionId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
      hour: "2-digit" as const,
      minute: "2-digit" as const,
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
    election: (typeof mockElections)[keyof typeof mockElections]
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
                    "departments" in election.eligibility && (
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
                                {dept}
                              </Badge>
                            )
                          )}
                        </Flex>
                      </Box>
                    )}

                  {election.eligibility.type === "level" &&
                    "levels" in election.eligibility && (
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
                              {level}
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
                        {election.faqs.map((faq, index) => (
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
                        ))}
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
