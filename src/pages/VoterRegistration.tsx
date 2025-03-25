/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated src/pages/VoterRegistration.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  VStack,
  Center,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FaUserGraduate, FaUniversity, FaVoteYea } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import StudentRegistrationForm from "../components/registration/StudentRegistrationForm";
import InstitutionRegistrationForm from "../components/registration/InsitutionRegistrationForm";

const VoterRegistration = () => {
  const { isAuthenticated, user, login, register, needsRegistration } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialTabIndex, setInitialTabIndex] = useState(0);
  
  // Set initial tab based on query param or state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'institution') {
      setInitialTabIndex(1);
    }
  }, [location]);

  const handleStudentSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Format data to match API expectations
      const registrationData = {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        walletAddress: user?.walletAddress,
        role: "student",
        profileData: {
          studentId: data.studentId,
          department: data.department,
          level: data.level,
          phoneNumber: data.phoneNumber
        }
      };
      
      // Call register method from auth context
      const result = await register(registrationData);
      
      if (result.success) {
        toast({
          title: "Registration successful",
          description: "You have been registered as a student voter",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Redirect to elections dashboard
        navigate("/elections");
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "An error occurred during registration",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstitutionSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Format data to match API expectations
      const registrationData = {
        email: data.email,
        name: data.contactPersonName,
        walletAddress: user?.walletAddress,
        role: "institution",
        profileData: {
          institutionName: data.institutionName,
          institutionType: data.institutionType,
          address: data.address,
          city: data.city,
          state: data.state,
          contactPersonTitle: data.contactPersonTitle,
          contactPersonName: data.contactPersonName,
          phoneNumber: data.phoneNumber,
          description: data.description
        }
      };
      
      // Call register method from auth context
      const result = await register(registrationData);
      
      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your institution has been registered successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Redirect to admin dashboard
        navigate("/admin");
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "An error occurred during registration",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle login and check if registration is needed
  const handleLoginClick = async () => {
    try {
      const result = await login();
      
      if (result.success) {
        if (result.userExists) {
          // User exists, redirect based on role
          if (result.role === 'institution') {
            navigate('/admin');
          } else {
            navigate('/elections');
          }
        } else if (result.needsRegistration) {
          // User needs to register, stay on this page
          toast({
            title: "Registration required",
            description: "Please complete your registration to continue",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Failed to login with Web3Auth",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: error instanceof Error ? error.message : "An error occurred during login",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // If already authenticated and registration is complete, redirect
  useEffect(() => {
    if (isAuthenticated && !needsRegistration) {
      if (user?.role === 'institution') {
        navigate('/admin');
      } else {
        navigate('/elections');
      }
    }
  }, [isAuthenticated, needsRegistration, user, navigate]);

  // Render sign-in prompt if not authenticated and doesn't need registration
  if (!user && !needsRegistration) {
    return (
      <Container maxW="4xl" py={12}>
        <VStack spacing={8} align="center">
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={4}>
              Register for BlockVote
            </Heading>
            <Text color="gray.600" fontSize="lg" mb={8}>
              Sign in to create your account and get started with secure
              blockchain voting.
            </Text>
          </Box>

          <Flex direction="column" align="center">
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={8}
              width="100%"
              maxW="md"
              boxShadow="lg"
              bg="white"
            >
              <VStack spacing={6}>
                <Box
                  as={FaVoteYea}
                  size="80px"
                  color="brand.500"
                  aria-label="Vote"
                />

                <Text textAlign="center">
                  Please sign in with your preferred method to continue with
                  registration.
                </Text>

                <Button
                  onClick={handleLoginClick}
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  height="50px"
                >
                  Sign In to Continue
                </Button>
              </VStack>
            </Box>
          </Flex>
        </VStack>
      </Container>
    );
  }

  // If wallet is connected but needs registration
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Complete Your Registration
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Please select your role and provide the required information.
          </Text>
        </Box>

        <Box
          w="full"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={6}
        >
          <Tabs isFitted variant="enclosed" colorScheme="brand" defaultIndex={initialTabIndex}>
            <TabList mb="1em">
              <Tab>Student Voter</Tab>
              <Tab>Institution</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box py={4}>
                  <Center mb={8}>
                    <Box
                      as={FaUserGraduate}
                      size="80px"
                      color="brand.500"
                      aria-label="Student"
                    />
                  </Center>
                  <Text mb={6} textAlign="center">
                    Register as a student to participate in elections and cast
                    your votes securely.
                  </Text>
                  <StudentRegistrationForm
                    onSubmit={handleStudentSubmit}
                    isSubmitting={isSubmitting}
                    userData={user}
                  />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box py={4}>
                  <Center mb={8}>
                    <Box
                      as={FaUniversity}
                      size="80px"
                      color="brand.500"
                      aria-label="Institution"
                    />
                  </Center>
                  <Text mb={6} textAlign="center">
                    Register your institution to create and manage secure
                    blockchain-based elections.
                  </Text>
                  <InstitutionRegistrationForm
                    onSubmit={handleInstitutionSubmit}
                    isSubmitting={isSubmitting}
                    userData={user}
                  />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
};

export default VoterRegistration;