/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/VoterRegistration.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStudentSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // This would be an API call to your backend in a real app
      console.log("Student registration data:", data);

      // Mock successful registration
      setTimeout(() => {
        toast({
          title: "Registration successful",
          description: "You have been registered as a student voter",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/elections");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description:
          (error as Error).message || "An error occurred during registration",
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
      // This would be an API call to your backend in a real app
      console.log("Institution registration data:", data);

      // Mock successful registration
      setTimeout(() => {
        toast({
          title: "Registration successful",
          description:
            "Your institution has been registered. Please wait for approval.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/admin");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description:
          (error as Error).message || "An error occurred during registration",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render sign-in prompt if not authenticated
  if (!isAuthenticated) {
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
                  aria-label="Student"
                />

                <Text textAlign="center">
                  Please sign in with your preferred method to continue with
                  registration.
                </Text>

                <Button
                  onClick={login}
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

  // Render registration form for authenticated users
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
          <Tabs isFitted variant="enclosed" colorScheme="brand">
            <TabList mb="1em">
              <Tab>Student Voter</Tab>
              <Tab>Institution</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box py={4}>
                  <Center mb={8}>
                    {/* Use React Icons instead of image files */}
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
                    {/* Use React Icons instead of image files */}
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
