// src/pages/ProfilePage.tsx
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Avatar,
    Divider,
    Badge,
    Button,
    useColorModeValue,
    SimpleGrid,
    Card,
    CardBody,
    Stack,
  } from '@chakra-ui/react';
  import { useAuth } from '../context/AuthContext';
  import { useState, useEffect } from 'react';
  
  interface VotingHistory {
    electionId: string;
    electionName: string;
    date: string;
    verified: boolean;
  }
  
  // Mock data - in a real app, this would come from your backend
  const mockVotingHistory: VotingHistory[] = [
    {
      electionId: '1',
      electionName: 'Student Union Election 2025',
      date: '2025-02-15',
      verified: true,
    },
    {
      electionId: '2',
      electionName: 'Department Representative Election',
      date: '2025-01-20',
      verified: true,
    },
  ];
  
  const ProfilePage = () => {
    const { user, web3 } = useAuth();
    const [address, setAddress] = useState<string>('');
    const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
    const bgColor = useColorModeValue('gray.50', 'gray.700')
  
    useEffect(() => {
      const getAddress = async () => {
        if (web3) {
          try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
              setAddress(accounts[0]);
            }
          } catch (error) {
            console.error('Error getting Ethereum address:', error);
          }
        }
      };
  
      getAddress();
      // In a real app, fetch voting history from your backend
      setVotingHistory(mockVotingHistory);
    }, [web3]);
  
    return (
      <Container maxW="4xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={6}
            bg={useColorModeValue('white', 'gray.700')}
          >
            <HStack spacing={6} align="flex-start">
              <Avatar
                size="xl"
                name={user?.name || 'User'}
                src={user?.profileImage}
              />
              <VStack align="start" spacing={2} flex={1}>
                <Heading as="h2" size="lg">
                  {user?.name || 'User Profile'}
                </Heading>
                <Text color="gray.600">{user?.email}</Text>
                <HStack>
                  <Badge colorScheme="green">Verified Voter</Badge>
                  <Badge colorScheme="blue">Active</Badge>
                </HStack>
                <Divider my={2} />
                <Text fontWeight="bold">Blockchain Address:</Text>
                <Text fontSize="sm" fontFamily="monospace">
                  {address || 'No address connected'}
                </Text>
              </VStack>
            </HStack>
          </Box>
  
          <Box>
            <Heading as="h3" size="md" mb={4}>
              Voting History
            </Heading>
            {votingHistory.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {votingHistory.map((vote) => (
                  <Card key={vote.electionId}>
                    <CardBody>
                      <Stack spacing={3}>
                        <Text fontWeight="bold">{vote.electionName}</Text>
                        <Text fontSize="sm">Date: {vote.date}</Text>
                        <HStack>
                          <Badge colorScheme={vote.verified ? 'green' : 'yellow'}>
                            {vote.verified ? 'Verified' : 'Pending'}
                          </Badge>
                          <Button
                            size="xs"
                            variant="outline"
                            as="a"
                            href={`/verify/${vote.electionId}`}
                          >
                            View Receipt
                          </Button>
                        </HStack>
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg={bgColor}
              >
                <Text align="center">You haven't participated in any elections yet.</Text>
              </Box>
            )}
          </Box>
  
          <Button colorScheme="red" variant="outline" alignSelf="flex-start">
            Delete Account
          </Button>
        </VStack>
      </Container>
    );
  };
  
  export default ProfilePage;