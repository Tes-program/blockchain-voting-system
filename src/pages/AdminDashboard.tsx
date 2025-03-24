/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Card,
  CardBody,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Stack,
  useToast,
  IconButton,
  useColorModeValue,
  VStack,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Divider,
} from "@chakra-ui/react";
import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Radio,
  RadioGroup,
  FormHelperText,
  Switch,
  Checkbox,
  Grid,
  GridItem,
  ButtonGroup,
  useDisclosure as useModalDisclosure,
  ModalContent as ChakraModalContent,
  Avatar,
} from "@chakra-ui/react";
import { FaPlus, FaTimes, FaTrash, FaUserPlus, FaUsers } from "react-icons/fa";
import {
  FaEllipsisV,
  FaVoteYea,
  FaCalendarAlt,
  FaCheck,
  FaEdit,
  FaEye,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

// Mock data - in a real app, this would come from your API
const mockElections = [
  {
    id: "1",
    title: "Student Union Presidential Election",
    description:
      "Vote for the next Student Union President for the academic year 2024/2025.",
    startDate: "2025-03-10T09:00:00",
    endDate: "2025-03-12T17:00:00",
    status: "upcoming",
    candidates: 5,
    votersCount: 324,
    totalVotesCast: 0,
  },
  {
    id: "2",
    title: "Department Representative Election",
    description:
      "Choose your department representatives for various committees.",
    startDate: "2025-03-05T10:00:00",
    endDate: "2025-03-07T16:00:00",
    status: "active",
    candidates: 12,
    votersCount: 156,
    totalVotesCast: 89,
  },
  {
    id: "3",
    title: "Campus Facilities Referendum",
    description:
      "Vote on the proposed changes to campus facilities and resource allocation.",
    startDate: "2025-02-25T08:00:00",
    endDate: "2025-02-28T20:00:00",
    status: "completed",
    candidates: 2,
    votersCount: 567,
    totalVotesCast: 423,
  },
  {
    id: "4",
    title: "Student Council Election",
    description:
      "Elect members of the student council for the next academic year.",
    startDate: "2025-02-15T09:00:00",
    endDate: "2025-02-18T17:00:00",
    status: "completed",
    candidates: 8,
    votersCount: 412,
    totalVotesCast: 387,
  },
];

const steps = [
  { title: "Basic Info", description: "Election details" },
  { title: "Roles & Positions", description: "Define election structure" },
  { title: "Candidates", description: "Add candidates" },
  { title: "Settings", description: "Additional options" },
  { title: "Review", description: "Finalize election" },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  interface Election {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    candidates: number;
    votersCount: number;
    totalVotesCast: number;
  }

  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    eligibilityType: "all",
  });
  const [activeStep, setActiveStep] = useState(0);
  const { activeStep: stepperIndex, setActiveStep: setStepperIndex } = useSteps(
    {
      index: 0,
      count: steps.length,
    }
  );
  const [electionType, setElectionType] = useState("simple");
  interface Candidate {
    id: string;
    name: string;
    party: string;
    manifesto: string;
    imageUrl: string;
  }

  interface Role {
    id: string;
    title: string;
    description: string;
    candidates: Candidate[];
  }

  const [roles, setRoles] = useState<Role[]>([
    { id: "1", title: "Position", description: "", candidates: [] },
  ]);
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const candidateModal = useModalDisclosure();
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    party: "",
    manifesto: "",
    imageUrl: "",
  });

  const bgSecColor = useColorModeValue("gray.50", "gray.700");

  // Fetch elections data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setElections(mockElections);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching elections:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dashboard stats
  const totalElections = elections.length;
  const activeElections = elections.filter((e) => e.status === "active").length;
  const completedElections = elections.filter(
    (e) => e.status === "completed"
  ).length;
  const totalVoters = elections.reduce(
    (sum, election) => sum + election.votersCount,
    0
  );
  const totalVotes = elections.reduce(
    (sum, election) => sum + election.totalVotesCast,
    0
  );
  const participationRate =
    totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0;

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

  // Format date for input fields
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge colorScheme="green">Active</Badge>;
      case "upcoming":
        return <Badge colorScheme="blue">Upcoming</Badge>;
      case "completed":
        return <Badge colorScheme="gray">Completed</Badge>;
      default:
        return null;
    }
  };

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setStepperIndex(activeStep + 1);
    }
  };

  // Function to handle previous step
  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setStepperIndex(activeStep - 1);
    }
  };

  // Function to add a new role
  const handleAddRole = () => {
    if (newRoleTitle.trim() === "") return;

    const newRole = {
      id: `role-${Date.now()}`,
      title: newRoleTitle,
      description: newRoleDescription,
      candidates: [],
    };

    setRoles([...roles, newRole]);
    setNewRoleTitle("");
    setNewRoleDescription("");
  };

  // Function to remove a role
  const handleRemoveRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  // Function to open candidate modal for a specific role
  const handleAddCandidate = (role: Role) => {
    setCurrentRole(role);
    setCandidateForm({
      name: "",
      party: "",
      manifesto: "",
      imageUrl: "",
    });
    candidateModal.onOpen();
  };

  // Function to save a new candidate
  const handleSaveCandidate = () => {
    if (candidateForm.name.trim() === "") return;

    const newCandidate = {
      id: `candidate-${Date.now()}`,
      ...candidateForm,
    };

    if (!currentRole) return;
    const updatedRoles = roles.map((role) => {
      if (role.id === currentRole.id) {
        return {
          ...role,
          candidates: [...role.candidates, newCandidate],
        };
      }
      return role;
    });

    setRoles(updatedRoles);
    candidateModal.onClose();
  };

  // Function to remove a candidate
  const handleRemoveCandidate = (roleId: string, candidateId: string) => {
    const updatedRoles = roles.map((role) => {
      if (role.id === roleId) {
        return {
          ...role,
          candidates: role.candidates.filter(
            (candidate) => candidate.id !== candidateId
          ),
        };
      }
      return role;
    });

    setRoles(updatedRoles);
  };

  // Function to handle form input changes for candidates
  const handleCandidateInputChange = (e) => {
    const { name, value } = e.target;
    setCandidateForm({
      ...candidateForm,
      [name]: value,
    });
  };

  // Function to create the election (final step)
  const handleCreateElectionFinal = () => {
    // Validate that each role has at least one candidate
    const invalidRoles = roles.filter((role) => role.candidates.length === 0);

    if (invalidRoles.length > 0) {
      toast({
        title: "Missing candidates",
        description: `Please add at least one candidate for each role`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Create the election with all the collected data
    const election = {
      ...formData,
      type: electionType,
      roles: roles,
      // Other settings from the form
    };

    // In a real app, this would be an API call to create the election
    console.log("Creating election:", election);

    toast({
      title: "Election created",
      description: `${formData.title} has been created successfully`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Reset form and close modal
    resetForm();
    onClose();
  };

  // Function to reset the form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      eligibilityType: "all",
    });
    setElectionType("simple");
    setRoles([{ id: "1", title: "Position", description: "", candidates: [] }]);
    setActiveStep(0);
    setStepperIndex(0);
  };

  // Handle form input changes
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle election creation
  const handleCreateElection = () => {
    // Reset form data
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      eligibilityType: "all",
    });
    setSelectedElection(null);
    onOpen();
  };

  // Handle election edit
  const handleEditElection = (election: Election) => {
    setSelectedElection(election);
    setFormData({
      title: election.title,
      description: election.description,
      startDate: formatDateForInput(election.startDate),
      endDate: formatDateForInput(election.endDate),
      eligibilityType: "all", // Assuming default
    });
    onOpen();
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form data
    if (
      !formData.title ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Check dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate >= endDate) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (selectedElection) {
      // Update existing election
      toast({
        title: "Election updated",
        description: `${formData.title} has been updated successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // Create new election
      toast({
        title: "Election created",
        description: `${formData.title} has been created successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }

    // Close modal
    onClose();
  };

  // Handle election deletion
  const handleDeleteElection = (id: string) => {
    // In a real app, this would call your API to delete the election
    toast({
      title: "Election deleted",
      description: "The election has been deleted successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Update local state
    setElections(elections.filter((election) => election.id !== id));
  };

  // Calculate time remaining
  const getTimeInfo = (election: Election) => {
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

  return (
    <Container maxW="6xl" py={8}>
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="xl">
            Admin Dashboard
          </Heading>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="brand"
            onClick={handleCreateElection}
          >
            Create Election
          </Button>
        </Flex>
        <Text color="gray.600">
          Manage your institution's elections and monitor voting activity.
        </Text>
      </Box>

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Elections</StatLabel>
              <StatNumber>{totalElections}</StatNumber>
              <HStack>
                <Icon as={FaCalendarAlt} color="brand.500" />
                <StatHelpText mb="0">{activeElections} active</StatHelpText>
              </HStack>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Registered Voters</StatLabel>
              <StatNumber>{totalVoters}</StatNumber>
              <HStack>
                <Icon as={FaUsers} color="brand.500" />
                <StatHelpText mb="0">Across all elections</StatHelpText>
              </HStack>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Votes Cast</StatLabel>
              <StatNumber>{totalVotes}</StatNumber>
              <HStack>
                <Icon as={FaVoteYea} color="brand.500" />
                <StatHelpText mb="0">In all elections</StatHelpText>
              </HStack>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Participation Rate</StatLabel>
              <StatNumber>{participationRate}%</StatNumber>
              <HStack>
                <Icon as={FaCheck} color="brand.500" />
                <StatHelpText mb="0">Overall voter turnout</StatHelpText>
              </HStack>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Elections Management */}
      <Box mb={8}>
        <Tabs colorScheme="brand" isLazy>
          <TabList>
            <Tab fontWeight="semibold">All Elections</Tab>
            <Tab fontWeight="semibold">Active</Tab>
            <Tab fontWeight="semibold">Upcoming</Tab>
            <Tab fontWeight="semibold">Completed</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Status</Th>
                      <Th>Timeline</Th>
                      <Th>Participation</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {elections.map((election) => (
                      <Tr key={election.id}>
                        <Td>
                          <Text fontWeight="semibold">{election.title}</Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {election.description}
                          </Text>
                        </Td>
                        <Td>{getStatusBadge(election.status)}</Td>
                        <Td>
                          <Text fontSize="sm">
                            {formatDate(election.startDate).split(",")[0]}
                            {" - "}
                            {formatDate(election.endDate).split(",")[0]}
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="brand.600"
                          >
                            {getTimeInfo(election)}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm">
                            {election.totalVotesCast} / {election.votersCount}{" "}
                            votes
                          </Text>
                          <Text fontSize="sm">
                            {election.votersCount > 0
                              ? `${Math.round(
                                  (election.totalVotesCast /
                                    election.votersCount) *
                                    100
                                )}% participation`
                              : "0% participation"}
                          </Text>
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FaEllipsisV />}
                              variant="ghost"
                              aria-label="Options"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<FaEye />}
                                as={RouterLink}
                                to={`/elections/${election.id}`}
                              >
                                View Details
                              </MenuItem>

                              {election.status === "completed" && (
                                <MenuItem
                                  icon={<FaEye />}
                                  as={RouterLink}
                                  to={`/results/${election.id}`}
                                >
                                  View Results
                                </MenuItem>
                              )}

                              {election.status === "upcoming" && (
                                <MenuItem
                                  icon={<FaEdit />}
                                  onClick={() => handleEditElection(election)}
                                >
                                  Edit Election
                                </MenuItem>
                              )}

                              {election.status === "upcoming" && (
                                <MenuItem
                                  icon={<FaTrash />}
                                  color="red.500"
                                  onClick={() =>
                                    handleDeleteElection(election.id)
                                  }
                                >
                                  Delete Election
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel px={0}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Timeline</Th>
                      <Th>Participation</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {elections
                      .filter((e) => e.status === "active")
                      .map((election) => (
                        <Tr key={election.id}>
                          <Td>
                            <Text fontWeight="semibold">{election.title}</Text>
                            <Text fontSize="sm" color="gray.600" noOfLines={1}>
                              {election.description}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(election.startDate).split(",")[0]}
                              {" - "}
                              {formatDate(election.endDate).split(",")[0]}
                            </Text>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="brand.600"
                            >
                              {getTimeInfo(election)}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {election.totalVotesCast} / {election.votersCount}{" "}
                              votes
                            </Text>
                            <Text fontSize="sm">
                              {election.votersCount > 0
                                ? `${Math.round(
                                    (election.totalVotesCast /
                                      election.votersCount) *
                                      100
                                  )}% participation`
                                : "0% participation"}
                            </Text>
                          </Td>
                          <Td>
                            <Button
                              as={RouterLink}
                              to={`/elections/${election.id}`}
                              size="sm"
                              leftIcon={<FaEye />}
                              colorScheme="brand"
                            >
                              Monitor
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel px={0}>
              {/* Content for Upcoming tab */}
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Timeline</Th>
                      <Th>Registered Voters</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {elections
                      .filter((e) => e.status === "upcoming")
                      .map((election) => (
                        <Tr key={election.id}>
                          <Td>
                            <Text fontWeight="semibold">{election.title}</Text>
                            <Text fontSize="sm" color="gray.600" noOfLines={1}>
                              {election.description}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(election.startDate).split(",")[0]}
                              {" - "}
                              {formatDate(election.endDate).split(",")[0]}
                            </Text>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="brand.600"
                            >
                              {getTimeInfo(election)}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {election.votersCount} voters registered
                            </Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                icon={<FaEdit />}
                                aria-label="Edit"
                                size="sm"
                                onClick={() => handleEditElection(election)}
                                colorScheme="blue"
                              />
                              <IconButton
                                icon={<FaTrash />}
                                aria-label="Delete"
                                size="sm"
                                onClick={() =>
                                  handleDeleteElection(election.id)
                                }
                                colorScheme="red"
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel px={0}>
              {/* Content for Completed tab */}
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Date</Th>
                      <Th>Participation</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {elections
                      .filter((e) => e.status === "completed")
                      .map((election) => (
                        <Tr key={election.id}>
                          <Td>
                            <Text fontWeight="semibold">{election.title}</Text>
                            <Text fontSize="sm" color="gray.600" noOfLines={1}>
                              {election.description}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(election.startDate).split(",")[0]}
                              {" - "}
                              {formatDate(election.endDate).split(",")[0]}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Completed
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {election.totalVotesCast} / {election.votersCount}{" "}
                              votes
                            </Text>
                            <Text fontSize="sm">
                              {election.votersCount > 0
                                ? `${Math.round(
                                    (election.totalVotesCast /
                                      election.votersCount) *
                                      100
                                  )}% participation`
                                : "0% participation"}
                            </Text>
                          </Td>
                          <Td>
                            <Button
                              as={RouterLink}
                              to={`/results/${election.id}`}
                              size="sm"
                              colorScheme="blue"
                              leftIcon={<FaEye />}
                            >
                              View Results
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Create/Edit Election Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ChakraModalContent maxW={activeStep === 2 ? "6xl" : "4xl"}>
          <ModalHeader>
            {selectedElection ? "Edit Election" : "Create New Election"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Stepper */}
            <Stepper index={stepperIndex} mb={8} size="sm">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>

            {/* Step 1: Basic Information */}
            {activeStep === 0 && (
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Election Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the purpose of this election"
                    rows={4}
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Start Date & Time</FormLabel>
                    <Input
                      name="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>End Date & Time</FormLabel>
                    <Input
                      name="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Election Type</FormLabel>
                  <RadioGroup value={electionType} onChange={setElectionType}>
                    <Stack spacing={4}>
                      <Radio value="simple">
                        <Text fontWeight="medium">Simple Election</Text>
                        <Text fontSize="sm" color="gray.600">
                          Single role/position with multiple candidates
                        </Text>
                      </Radio>
                      <Radio value="complex">
                        <Text fontWeight="medium">Complex Election</Text>
                        <Text fontSize="sm" color="gray.600">
                          Multiple roles/positions with different candidates for
                          each
                        </Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Stack>
            )}

            {/* Step 2: Roles & Positions */}
            {activeStep === 1 && (
              <Stack spacing={6}>
                <Box>
                  <Heading size="sm" mb={4}>
                    {electionType === "simple"
                      ? "Define the Position"
                      : "Define Roles & Positions"}
                  </Heading>

                  {electionType === "simple" ? (
                    <FormControl isRequired>
                      <FormLabel>Position Title</FormLabel>
                      <Input
                        value={roles[0].title}
                        onChange={(e) => {
                          const updatedRoles = [...roles];
                          updatedRoles[0].title = e.target.value;
                          setRoles(updatedRoles);
                        }}
                        placeholder="e.g., President, Class Representative"
                      />
                      <FormHelperText>
                        Enter the title of the position being elected
                      </FormHelperText>

                      <FormLabel mt={4}>
                        Position Description (Optional)
                      </FormLabel>
                      <Textarea
                        value={roles[0].description}
                        onChange={(e) => {
                          const updatedRoles = [...roles];
                          updatedRoles[0].description = e.target.value;
                          setRoles(updatedRoles);
                        }}
                        placeholder="Describe the responsibilities of this position"
                        rows={3}
                      />
                    </FormControl>
                  ) : (
                    <>
                      <VStack spacing={4} align="stretch" mb={6}>
                        {roles.map((role, index) => (
                          <Flex
                            key={role.id}
                            borderWidth="1px"
                            borderRadius="md"
                            p={3}
                            align="center"
                          >
                            <Box flex="1">
                              <Text fontWeight="medium">{role.title}</Text>
                              {role.description && (
                                <Text
                                  fontSize="sm"
                                  color="gray.600"
                                  noOfLines={1}
                                >
                                  {role.description}
                                </Text>
                              )}
                            </Box>
                            <IconButton
                              icon={<FaTimes />}
                              aria-label="Remove role"
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              isDisabled={roles.length === 1}
                              onClick={() => handleRemoveRole(role.id)}
                            />
                          </Flex>
                        ))}
                      </VStack>

                      <Box borderWidth="1px" borderRadius="md" p={4}>
                        <Heading size="xs" mb={3}>
                          Add New Role
                        </Heading>
                        <Stack spacing={3}>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">Role Title</FormLabel>
                            <Input
                              size="sm"
                              value={newRoleTitle}
                              onChange={(e) => setNewRoleTitle(e.target.value)}
                              placeholder="e.g., Vice President, Secretary"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm">
                              Description (Optional)
                            </FormLabel>
                            <Input
                              size="sm"
                              value={newRoleDescription}
                              onChange={(e) =>
                                setNewRoleDescription(e.target.value)
                              }
                              placeholder="Brief description of this role"
                            />
                          </FormControl>

                          <Button
                            leftIcon={<FaPlus />}
                            size="sm"
                            onClick={handleAddRole}
                            isDisabled={!newRoleTitle.trim()}
                          >
                            Add Role
                          </Button>
                        </Stack>
                      </Box>
                    </>
                  )}
                </Box>
              </Stack>
            )}

            {/* Step 3: Candidates */}
            {activeStep === 2 && (
              <Stack spacing={6}>
                <Heading size="sm" mb={2}>
                  Add Candidates
                </Heading>
                <Text color="gray.600" mb={4}>
                  Add candidates for each position in the election.
                </Text>

                {roles.map((role) => (
                  <Box
                    key={role.id}
                    borderWidth="1px"
                    borderRadius="md"
                    p={4}
                    mb={4}
                  >
                    <Flex align="center" justify="space-between" mb={4}>
                      <Heading size="sm">{role.title}</Heading>
                      <Button
                        leftIcon={<FaUserPlus />}
                        size="sm"
                        onClick={() => handleAddCandidate(role)}
                      >
                        Add Candidate
                      </Button>
                    </Flex>

                    {role.candidates.length === 0 ? (
                      <Alert status="warning" borderRadius="md">
                        <AlertIcon />
                        <Text>
                          No candidates added yet. Please add at least one
                          candidate.
                        </Text>
                      </Alert>
                    ) : (
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                        {role.candidates.map((candidate) => (
                          <Flex
                            key={candidate.id}
                            borderWidth="1px"
                            borderRadius="md"
                            p={3}
                            align="center"
                          >
                            <Avatar
                              size="md"
                              name={candidate.name}
                              src={candidate.imageUrl}
                              mr={3}
                            />
                            <Box flex="1">
                              <Text fontWeight="medium">{candidate.name}</Text>
                              <HStack>
                                <Badge>
                                  {candidate.party || "Independent"}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                  {candidate.manifesto
                                    ? candidate.manifesto.substring(0, 40) +
                                      "..."
                                    : "No manifesto provided"}
                                </Text>
                              </HStack>
                            </Box>
                            <IconButton
                              icon={<FaTrash />}
                              aria-label="Remove candidate"
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() =>
                                handleRemoveCandidate(role.id, candidate.id)
                              }
                            />
                          </Flex>
                        ))}
                      </SimpleGrid>
                    )}
                  </Box>
                ))}
              </Stack>
            )}

            {/* Step 4: Additional Settings */}
            {activeStep === 3 && (
              <Stack spacing={6}>
                <Heading size="sm" mb={4}>
                  Additional Settings
                </Heading>

                <FormControl>
                  <FormLabel>Voter Eligibility</FormLabel>
                  <Select
                    name="eligibilityType"
                    value={formData.eligibilityType}
                    onChange={handleInputChange}
                    mb={3}
                  >
                    <option value="all">All Registered Voters</option>
                    <option value="department">Specific Department(s)</option>
                    <option value="level">Specific Level(s)</option>
                    <option value="custom">Custom Selection</option>
                  </Select>

                  {/* Department Selection (appears when "Specific Department" is selected) */}
                  {formData.eligibilityType === "department" && (
                    <Box
                      mt={4}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg={bgSecColor}
                    >
                      <FormLabel>Select Department(s)</FormLabel>
                      <Stack spacing={2}>
                        <Checkbox defaultChecked>Computer Science</Checkbox>
                        <Checkbox>Information Technology</Checkbox>
                        <Checkbox>Software Engineering</Checkbox>
                        <Checkbox>Cyber Security</Checkbox>
                        <Checkbox>Data Science</Checkbox>
                        <Checkbox>Business Administration</Checkbox>
                        <Checkbox>Engineering</Checkbox>
                        <Checkbox>Arts</Checkbox>
                      </Stack>
                      <FormHelperText>
                        Only students from selected departments will be eligible
                        to vote in this election
                      </FormHelperText>
                    </Box>
                  )}

                  {/* Level Selection (appears when "Specific Level" is selected) */}
                  {formData.eligibilityType === "level" && (
                    <Box
                      mt={4}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg={bgSecColor}
                    >
                      <FormLabel>Select Level(s)</FormLabel>
                      <Stack spacing={2}>
                        <Checkbox>100 Level</Checkbox>
                        <Checkbox defaultChecked>200 Level</Checkbox>
                        <Checkbox defaultChecked>300 Level</Checkbox>
                        <Checkbox>400 Level</Checkbox>
                        <Checkbox>500 Level</Checkbox>
                        <Checkbox>Postgraduate</Checkbox>
                      </Stack>
                      <FormHelperText>
                        Only students in selected levels will be eligible to
                        vote in this election
                      </FormHelperText>
                    </Box>
                  )}

                  {/* Custom Selection (appears when "Custom Selection" is selected) */}
                  {formData.eligibilityType === "custom" && (
                    <Box
                      mt={4}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg={bgSecColor}
                    >
                      <VStack align="stretch" spacing={4}>
                        <FormControl>
                          <FormLabel>Department Restriction</FormLabel>
                          <Select placeholder="Select option" size="sm">
                            <option value="include">
                              Include specific departments
                            </option>
                            <option value="exclude">
                              Exclude specific departments
                            </option>
                            <option value="none">
                              No department restriction
                            </option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Level Restriction</FormLabel>
                          <Select placeholder="Select option" size="sm">
                            <option value="include">
                              Include specific levels
                            </option>
                            <option value="exclude">
                              Exclude specific levels
                            </option>
                            <option value="none">No level restriction</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>
                            Upload Eligible Voters List (Optional)
                          </FormLabel>
                          <Input
                            type="file"
                            variant="unstyled"
                            py={1}
                            accept=".csv,.xlsx"
                          />
                          <FormHelperText>
                            Upload a CSV or Excel file containing the list of
                            eligible voters
                          </FormHelperText>
                        </FormControl>
                      </VStack>
                    </Box>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel mb={0}>Privacy Options</FormLabel>
                  <Stack spacing={2} mt={2}>
                    <Checkbox defaultChecked>
                      Hide results until election ends
                    </Checkbox>
                    <Checkbox defaultChecked>
                      Allow voters to verify their vote
                    </Checkbox>
                    <Checkbox>Enable anonymous voting statistics</Checkbox>
                  </Stack>
                </FormControl>

                <FormControl>
                  <FormLabel display="flex" alignItems="center">
                    Enable Real-time Results
                    <Switch ml={2} colorScheme="brand" />
                  </FormLabel>
                  <FormHelperText>
                    If enabled, results will be visible in real-time as votes
                    are cast
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Voting Duration Reminder</FormLabel>
                  <HStack>
                    <Select defaultValue="1" width="auto">
                      <option value="1">1 day</option>
                      <option value="2">2 days</option>
                      <option value="3">3 days</option>
                      <option value="7">1 week</option>
                    </Select>
                    <Text>before election ends</Text>
                  </HStack>
                  <FormHelperText>
                    Send a reminder to eligible voters who haven't cast their
                    vote yet
                  </FormHelperText>
                </FormControl>
              </Stack>
            )}

            {/* Step 5: Review */}
            {activeStep === 4 && (
              <Stack spacing={6}>
                <Heading size="sm" mb={2}>
                  Review Election Details
                </Heading>

                <Box borderWidth="1px" borderRadius="md" p={4}>
                  <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Election Title:</Text>
                      <Text>{formData.title}</Text>
                    </Flex>

                    <Flex justify="space-between">
                      <Text fontWeight="bold">Duration:</Text>
                      <Text>
                        {formData.startDate
                          ? new Date(formData.startDate).toLocaleString()
                          : "Not set"}
                        {" to "}
                        {formData.endDate
                          ? new Date(formData.endDate).toLocaleString()
                          : "Not set"}
                      </Text>
                    </Flex>

                    <Flex justify="space-between">
                      <Text fontWeight="bold">Type:</Text>
                      <Text>
                        {electionType === "simple"
                          ? "Simple Election"
                          : "Complex Election"}
                      </Text>
                    </Flex>

                    <Divider />

                    <Text fontWeight="bold">Positions and Candidates:</Text>

                    {roles.map((role) => (
                      <Box key={role.id} pl={4} mt={1}>
                        <Text fontWeight="medium">
                          {role.title} ({role.candidates.length} candidates)
                        </Text>
                        <Wrap mt={1} spacing={2}>
                          {role.candidates.map((candidate) => (
                            <WrapItem key={candidate.id}>
                              <Tag
                                size="md"
                                borderRadius="full"
                                variant="subtle"
                                colorScheme="blue"
                              >
                                <TagLabel>{candidate.name}</TagLabel>
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                    ))}

                    <Divider />

                    <Flex justify="space-between">
                      <Text fontWeight="bold">Voter Eligibility:</Text>
                      <Text>
                        {formData.eligibilityType === "all"
                          ? "All Registered Voters"
                          : formData.eligibilityType === "department"
                          ? "Specific Department"
                          : formData.eligibilityType === "level"
                          ? "Specific Level"
                          : "Custom Selection"}
                      </Text>
                    </Flex>
                  </VStack>
                </Box>

                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Ready to Create</AlertTitle>
                    <AlertDescription>
                      Please review all details before creating this election.
                      Once created, some settings cannot be changed.
                    </AlertDescription>
                  </Box>
                </Alert>
              </Stack>
            )}
          </ModalBody>

          <ModalFooter>
            {activeStep > 0 && (
              <Button mr={3} onClick={handlePrevStep}>
                Previous
              </Button>
            )}

            {activeStep < steps.length - 1 ? (
              <Button
                colorScheme="brand"
                onClick={handleNextStep}
                isDisabled={
                  (activeStep === 0 &&
                    (!formData.title ||
                      !formData.description ||
                      !formData.startDate ||
                      !formData.endDate)) ||
                  (activeStep === 1 && roles.some((role) => !role.title))
                }
              >
                Next
              </Button>
            ) : (
              <Button colorScheme="brand" onClick={handleCreateElectionFinal}>
                Create Election
              </Button>
            )}
          </ModalFooter>
        </ChakraModalContent>
      </Modal>

      {/* Candidate Modal */}
      <Modal
        isOpen={candidateModal.isOpen}
        onClose={candidateModal.onClose}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add Candidate for {currentRole?.title || "Position"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Candidate Name</FormLabel>
                <Input
                  name="name"
                  value={candidateForm.name}
                  onChange={handleCandidateInputChange}
                  placeholder="Full name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Party/Affiliation</FormLabel>
                <Input
                  name="party"
                  value={candidateForm.party}
                  onChange={handleCandidateInputChange}
                  placeholder="e.g., Independent, Student Union"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Manifesto/Statement</FormLabel>
                <Textarea
                  name="manifesto"
                  value={candidateForm.manifesto}
                  onChange={handleCandidateInputChange}
                  placeholder="Candidate's campaign statement or manifesto"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Profile Image URL</FormLabel>
                <Input
                  name="imageUrl"
                  value={candidateForm.imageUrl}
                  onChange={handleCandidateInputChange}
                  placeholder="http://example.com/image.jpg"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={handleSaveCandidate}>
              Save Candidate
            </Button>
            <Button onClick={candidateModal.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
