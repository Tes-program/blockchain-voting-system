/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/registration/StudentRegistrationForm.tsx
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Select,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  useColorModeValue,
  Divider,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface StudentRegistrationFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  userData: any;
}

const StudentRegistrationForm = ({ onSubmit, isSubmitting, userData }: StudentRegistrationFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: userData?.name?.split(' ')[0] || '',
      lastName: userData?.name?.split(' ')[1] || '',
      email: userData?.email || '',
      studentId: '',
      department: '',
      level: '',
      phoneNumber: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align="stretch">
        <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
          Personal Information
        </Text>
        
        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.firstName} isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              {...register('firstName', {
                required: 'First name is required',
              })}
            />
            <FormErrorMessage>{errors.firstName?.message?.toString()}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.lastName} isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              {...register('lastName', {
                required: 'Last name is required',
              })}
            />
            <FormErrorMessage>{errors.lastName?.message?.toString()}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!errors.email} isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          <FormErrorMessage>{errors.email?.message?.toString()}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.phoneNumber}>
          <FormLabel>Phone Number</FormLabel>
          <InputGroup>
            <InputLeftAddon>+</InputLeftAddon>
            <Input
              type="tel"
              {...register('phoneNumber', {
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: 'Invalid phone number',
                },
              })}
            />
          </InputGroup>
          <FormErrorMessage>{errors.phoneNumber?.message?.toString()}</FormErrorMessage>
        </FormControl>

        <Divider my={2} />
        
        <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
          Academic Information
        </Text>

        <FormControl isInvalid={!!errors.studentId} isRequired>
          <FormLabel>Student ID</FormLabel>
          <Input
            {...register('studentId', {
              required: 'Student ID is required',
            })}
          />
          <FormErrorMessage>{errors.studentId?.message?.toString()}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.department} isRequired>
          <FormLabel>Department</FormLabel>
          <Select
            placeholder="Select department"
            {...register('department', {
              required: 'Department is required',
            })}
          >
            <option value="computer_science">Computer Science</option>
            <option value="information_technology">Information Technology</option>
            <option value="software_engineering">Software Engineering</option>
            <option value="cyber_security">Cyber Security</option>
            <option value="data_science">Data Science</option>
            <option value="business_admin">Business Administration</option>
            <option value="engineering">Engineering</option>
            <option value="arts">Arts</option>
            <option value="other">Other</option>
          </Select>
          <FormErrorMessage>{errors.department?.message?.toString()}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.level} isRequired>
          <FormLabel>Level</FormLabel>
          <Select
            placeholder="Select level"
            {...register('level', {
              required: 'Level is required',
            })}
          >
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
            <option value="postgraduate">Postgraduate</option>
          </Select>
          <FormErrorMessage>{errors.level?.message?.toString()}</FormErrorMessage>
        </FormControl>

        <Button
          mt={4}
          colorScheme="brand"
          isLoading={isSubmitting}
          type="submit"
          size="lg"
        >
          Register as Student
        </Button>
      </VStack>
    </form>
  );
};

export default StudentRegistrationForm;