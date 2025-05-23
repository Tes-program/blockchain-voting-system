/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/VotingBooth.tsx
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
  RadioGroup,
  Radio,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Progress,
  Flex,
  Spacer,
  Spinner,
  Center,
  Icon,
  useColorModeValue,
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
} from '@chakra-ui/react';
import { 
  FaUserCircle, 
  FaCheckCircle, 
  FaLock, 
  FaArrowRight,
  FaArrowLeft,
  FaVoteYea
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getElectionById } from '../services/electionService';
import { castVote } from '../services/voteService';

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

interface Election {
  id: string;
  title: string;
  description: string;
  instructions: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  roles: Role[];
}

const VotingBooth = () => {
  const { electionId } = useParams();
  const { user, web3 } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const bgSecColor = useColorModeValue("gray.50", "gray.700");

  // For complex elections with multiple roles
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: election?.roles?.length || 1,
  });

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
          
          // Initialize selectedCandidates object based on roles
          const initialSelections: { [key: string]: string } = {};
          response.data.roles.forEach((role: Role) => {
            initialSelections[role.id] = '';
          });
          setSelectedCandidates(initialSelections);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to load election",
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
          description: "Failed to load election. Please try again later.",
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
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const bgColor = useColorModeValue("gray.50", "gray.700");

  // Calculate time remaining
  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m remaining`;
  };

  // Handle vote selection
  const handleCandidateSelect = (roleId: string, candidateId: string) => {
    setSelectedCandidates({
      ...selectedCandidates,
      [roleId]: candidateId
    });
  };

  // Handle next role in stepper
  const handleNextRole = () => {
    if (!election) return;
    if (activeRoleIndex < election.roles.length - 1) {
      setActiveRoleIndex(activeRoleIndex + 1);
      setActiveStep(activeRoleIndex + 1);
    }
  };

  // Handle previous role in stepper
  const handlePrevRole = () => {
    if (activeRoleIndex > 0) {
      setActiveRoleIndex(activeRoleIndex - 1);
      setActiveStep(activeRoleIndex - 1);
    }
  };

  // Check if all selections have been made
  const allSelectionsComplete = () => {
    if (!election) return false;
    
    for (const roleId of Object.keys(selectedCandidates)) {
      if (!selectedCandidates[roleId]) {
        return false;
      }
    }
    return true;
  };

  // Handle vote submission
  const handleVoteSubmit = async () => {
    if (!allSelectionsComplete()) {
      toast({
        title: 'Incomplete ballot',
        description: 'Please select a candidate for each position before submitting.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    onOpen();
  };

  // Handle confirmation
  const handleConfirmVote = async () => {
    setIsSubmitting(true);
    setCurrentStep(2);
    
    try {
      if (!election || !electionId) {
        throw new Error("Election data is missing");
      }
      
      // Prepare selections for API
      const selections = Object.keys(selectedCandidates).map(roleId => ({
        roleId,
        candidateId: selectedCandidates[roleId]
      }));
      
      // Get wallet address
      let walletAddress = user?.walletAddress;
      if (web3 && !walletAddress) {
        try {
          const accounts = await web3.eth.getAccounts();
          walletAddress = accounts[0];
        } catch (error) {
          console.error('Error getting wallet address:', error);
          throw new Error("Could not get wallet address");
        }
      }
      
      if (!walletAddress) {
        throw new Error("Wallet address is required");
      }
      
      // Cast vote via API
      const voteData = {
        electionId,
        selections,
        walletAddress
      };
      
      const response = await castVote(voteData);
      
      if (response.success) {
        // Set transaction hash from response
        setTransactionHash(response.data.blockchainData.transactionHash);
        setCurrentStep(3);
        
        // Move to final step after a short delay
        setTimeout(() => {
          setCurrentStep(4);
        }, 1500);
      } else {
        throw new Error(response.message || "Failed to submit vote");
      }
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Transaction failed",
        description: error.message || "There was an error submitting your vote. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle viewing receipt
  const handleViewReceipt = () => {
    onClose();
    // Navigate to the vote verification page with the receipt ID
    navigate(`/verify/${transactionHash}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Center h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text>Loading election information...</Text>
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
          <AlertDescription>The election you're looking for doesn't exist or has ended.</AlertDescription>
        </Alert>
        <Button mt={4} colorScheme="brand" onClick={() => navigate('/elections')}>
          Back to Elections
        </Button>
      </Container>
    );
  }

  // Election not active
  if (election.status !== 'active') {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="warning" variant="solid" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Voting Unavailable</AlertTitle>
            <AlertDescription>
              {election.status === 'upcoming' 
                ? `This election hasn't started yet. It will begin on ${formatDate(election.startDate)}.`
                : 'This election has ended and voting is no longer available.'}
            </AlertDescription>
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
        {/* Election Header */}
        <Box bg={bgColor} p={6} borderRadius="md" borderWidth="1px" boxShadow="sm">
          <Flex align="center" mb={4}>
            <Heading as="h1" size="xl">
              {election.title}
            </Heading>
            <Spacer />
            <Badge colorScheme="green" fontSize="md" py={1} px={2}>
              Active
            </Badge>
          </Flex>
          
          <Text fontSize="md" mb={4}>
            {election.description}
          </Text>
          
          <HStack fontSize="sm" color="gray.600" mb={4}>
            <Text>
              <strong>Started:</strong> {formatDate(election.startDate)}
            </Text>
            <Text>•</Text>
            <Text>
              <strong>Ends:</strong> {formatDate(election.endDate)}
            </Text>
          </HStack>
          
          <Flex align="center">
            <HStack spacing={2}>
              <Icon as={FaLock} color="brand.500" />
              <Text fontWeight="medium" color="brand.600" fontSize="sm">
                {getTimeRemaining(election.endDate)}
              </Text>
            </HStack>
            <Spacer />
            <HStack>
              <Text fontSize="sm" color="gray.600">
                Your vote is secured with blockchain technology
              </Text>
            </HStack>
          </Flex>
        </Box>

        {/* Voting Instructions */}
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Voting Instructions</AlertTitle>
            <AlertDescription>
              {election.instructions}
            </AlertDescription>
          </Box>
        </Alert>

        {/* Complex Election with Multiple Roles */}
        {election.type === 'complex' && (
          <Box>
            <Heading as="h2" size="md" mb={4}>
              Select Candidates for Each Position
            </Heading>

            {/* Stepper for multiple roles */}
            <Stepper index={activeStep} mb={8} size="sm">
              {election.roles.map((role, index) => (
                <Step key={role.id}>
                  <StepIndicator>
                    <StepStatus 
                      complete={selectedCandidates[role.id] ? <StepIcon /> : <StepNumber />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle>{role.title}</StepTitle>
                    <StepDescription>{selectedCandidates[role.id] ? 'Selected' : 'Choose one'}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>

            {/* Current Role Selection */}
            <Box mb={4}>
              <Flex align="center" mb={2}>
                <Heading as="h3" size="md">
                  {election.roles[activeRoleIndex].title}
                </Heading>
                <Spacer />
                <Text fontSize="sm" color="gray.600">
                  Step {activeRoleIndex + 1} of {election.roles.length}
                </Text>
              </Flex>
              <Text mb={4} color="gray.600">
                {election.roles[activeRoleIndex].description}
              </Text>
              
              <RadioGroup 
                onChange={(value) => handleCandidateSelect(election.roles[activeRoleIndex].id, value)} 
                value={selectedCandidates[election.roles[activeRoleIndex].id]}
              >
                <VStack spacing={4} align="stretch">
                  {election.roles[activeRoleIndex].candidates.map((candidate) => (
                    <Card 
                      key={candidate.id} 
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={selectedCandidates[election.roles[activeRoleIndex].id] === candidate.id ? "brand.500" : "gray.200"}
                      boxShadow={selectedCandidates[election.roles[activeRoleIndex].id] === candidate.id ? "md" : "sm"}
                      _hover={{ boxShadow: "md" }}
                      transition="all 0.2s"
                    >
                      <CardBody>
                        <Flex>
                          <Box mr={4}>
                            <Image
                              borderRadius="full"
                              boxSize="80px"
                              src={candidate.imageUrl}
                              alt={candidate.name}
                              fallback={<Icon as={FaUserCircle} boxSize="80px" color="gray.300" />}
                            />
                          </Box>
                          <Box flex="1">
                            <Radio value={candidate.id} colorScheme="brand" size="lg" mb={2}>
                              <Heading as="h3" size="md">
                                {candidate.name}
                              </Heading>
                            </Radio>
                            <Badge colorScheme="blue" mb={2}>
                              {candidate.party}
                            </Badge>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                              {candidate.position}
                            </Text>
                            <Text fontSize="sm">
                              {candidate.manifesto}
                            </Text>
                          </Box>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </RadioGroup>
            </Box>

            {/* Navigation Buttons */}
            <Flex mt={6} mb={4}>
              <Button 
                leftIcon={<FaArrowLeft />} 
                onClick={handlePrevRole}
                isDisabled={activeRoleIndex === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Spacer />
              {activeRoleIndex < election.roles.length - 1 ? (
                <Button 
                  rightIcon={<FaArrowRight />} 
                  onClick={handleNextRole}
                  colorScheme="brand"
                  isDisabled={!selectedCandidates[election.roles[activeRoleIndex].id]}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  rightIcon={<FaVoteYea />} 
                  onClick={handleVoteSubmit}
                  colorScheme="brand"
                  isDisabled={!allSelectionsComplete()}
                >
                  Submit Ballot
                </Button>
              )}
            </Flex>

            {/* Selection Summary */}
            <Box mt={6} p={4} borderWidth="1px" borderRadius="md" bg={bgSecColor}>
              <Heading as="h3" size="sm" mb={3}>
                Your Selections
              </Heading>
              <VStack align="stretch" spacing={2}>
                {election.roles.map((role) => (
                  <Flex key={role.id} align="center">
                    <Text fontWeight="medium">{role.title}:</Text>
                    <Spacer />
                    {selectedCandidates[role.id] ? (
                      <Text>
                        {role.candidates.find(c => c.id === selectedCandidates[role.id])?.name}
                      </Text>
                    ) : (
                      <Text color="gray.500" fontStyle="italic">Not selected yet</Text>
                    )}
                  </Flex>
                ))}
              </VStack>
            </Box>
          </Box>
        )}

        {/* Simple Election (Single Role) */}
        {election.type === 'simple' && (
          <Box>
            <Heading as="h2" size="md" mb={4}>
              Candidates
            </Heading>

            <RadioGroup 
              onChange={(value) => handleCandidateSelect(election.roles[0].id, value)} 
              value={selectedCandidates[election.roles[0].id]}
            >
              <VStack spacing={4} align="stretch">
                {election.roles[0].candidates.map((candidate) => (
                  <Card 
                    key={candidate.id} 
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={selectedCandidates[election.roles[0].id] === candidate.id ? "brand.500" : "gray.200"}
                    boxShadow={selectedCandidates[election.roles[0].id] === candidate.id ? "md" : "sm"}
                    _hover={{ boxShadow: "md" }}
                    transition="all 0.2s"
                  >
                    <CardBody>
                      <Flex>
                        <Box mr={4}>
                          <Image
                            borderRadius="full"
                            boxSize="80px"
                            src={candidate.imageUrl}
                            alt={candidate.name}
                            fallback={<Icon as={FaUserCircle} boxSize="80px" color="gray.300" />}
                          />
                        </Box>
                        <Box flex="1">
                          <Radio value={candidate.id} colorScheme="brand" size="lg" mb={2}>
                            <Heading as="h3" size="md">
                              {candidate.name}
                            </Heading>
                          </Radio>
                          <Badge colorScheme="blue" mb={2}>
                            {candidate.party}
                          </Badge>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            {candidate.position}
                          </Text>
                          <Text fontSize="sm">
                            {candidate.manifesto}
                          </Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </RadioGroup>

            {/* Submit Button for Simple Election */}
            <Box textAlign="center" py={4}>
              <Button 
                colorScheme="brand" 
                size="lg" 
                onClick={handleVoteSubmit}
                isDisabled={!selectedCandidates[election.roles[0].id]}
                minW="200px"
              >
                Submit My Vote
              </Button>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Your vote will be recorded on the blockchain and cannot be changed after submission.
              </Text>
            </Box>
          </Box>
        )}
      </VStack>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => currentStep < 4 && onClose()}
        closeOnOverlayClick={currentStep < 4}
        closeOnEsc={currentStep < 4}
        isCentered
        size={election.type === 'complex' ? "lg" : "md"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentStep < 4 ? 'Confirm Your Vote' : 'Vote Successfully Recorded'}
          </ModalHeader>
          {currentStep < 4 && <ModalCloseButton />}
          <ModalBody pb={6}>
            {currentStep === 1 && (
              <VStack spacing={4} align="stretch">
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Once submitted, your vote cannot be changed. Please confirm your selection{election.type === 'complex' ? 's' : ''}.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                {election.type === 'simple' ? (
                  <Box borderWidth="1px" borderRadius="md" p={4}>
                    <Text fontWeight="bold" mb={2}>You are voting for:</Text>
                    <HStack>
                      <Image
                        borderRadius="full"
                        boxSize="40px"
                        src={election.roles[0].candidates.find(c => c.id === selectedCandidates[election.roles[0].id])?.imageUrl}
                        alt={election.roles[0].candidates.find(c => c.id === selectedCandidates[election.roles[0].id])?.name}
                        fallback={<Icon as={FaUserCircle} boxSize="40px" color="gray.300" />}
                      />
                      <Box>
                        <Text fontWeight="semibold">
                          {election.roles[0].candidates.find(c => c.id === selectedCandidates[election.roles[0].id])?.name}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {election.roles[0].candidates.find(c => c.id === selectedCandidates[election.roles[0].id])?.party}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                ) : (
                  <Box borderWidth="1px" borderRadius="md" p={4}>
                    <Text fontWeight="bold" mb={3}>You are voting for:</Text>
                    <VStack spacing={3} align="stretch">
                      {election.roles.map((role) => {
                        const selectedCandidate = role.candidates.find(c => c.id === selectedCandidates[role.id]);
                        return (
                          <Box key={role.id}>
                            <Text fontWeight="medium" fontSize="sm" color="gray.600">
                              {role.title}:
                            </Text>
                            <HStack mt={1}>
                              <Image
                                borderRadius="full"
                                boxSize="32px"
                                src={selectedCandidate?.imageUrl}
                                alt={selectedCandidate?.name}
                                fallback={<Icon as={FaUserCircle} boxSize="32px" color="gray.300" />}
                              />
                              <Box>
                                <Text fontWeight="semibold" fontSize="sm">
                                  {selectedCandidate?.name}
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  {selectedCandidate?.party}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                )}
                
                <Text fontSize="sm" color="gray.600">
                  By clicking "Confirm Vote", you agree to cast your vote for the selected candidate{election.type === 'complex' ? 's' : ''}. 
                  This action will be recorded on the blockchain and cannot be reversed.
                </Text>
              </VStack>
            )}
            
            {currentStep === 2 && (
              <VStack spacing={6} align="center" py={4}>
                <Text>Processing your vote on the blockchain...</Text>
                <Progress isIndeterminate colorScheme="brand" width="100%" />
                <Text fontSize="sm" color="gray.500">
                  Please do not close this window. This may take a few moments.
                </Text>
              </VStack>
            )}
            
            {currentStep === 3 && (
              <VStack spacing={6} align="center" py={4}>
                <Text>Recording transaction on blockchain...</Text>
                <Progress value={80} colorScheme="brand" width="100%" />
                <Text fontSize="sm" fontFamily="monospace" color="gray.600">
                  Transaction: {transactionHash.substring(0, 20)}...
                </Text>
              </VStack>
            )}
            
            {currentStep === 4 && (
              <VStack spacing={6} align="center" py={4}>
                <Icon as={FaCheckCircle} boxSize="60px" color="green.500" />
                <Text fontWeight="bold" fontSize="xl">Vote Successfully Recorded</Text>
                <Text>
                  Your vote has been securely recorded on the blockchain. Thank you for participating!
                </Text>
                <Box 
                  borderWidth="1px" 
                  borderRadius="md" 
                  p={4} 
                  bg="gray.50" 
                  width="100%"
                >
                  <Text fontSize="sm" fontWeight="bold" mb={1}>
                    Transaction Hash:
                  </Text>
                  <Text fontSize="xs" fontFamily="monospace" isTruncated>
                    {transactionHash}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            {currentStep === 1 && (
              <>
                <Button colorScheme="brand" mr={3} onClick={handleConfirmVote}>
                  Confirm Vote
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </>
            )}
            
            {currentStep === 4 && (
              <Button colorScheme="brand" onClick={handleViewReceipt} width="full">
                View Receipt
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default VotingBooth;