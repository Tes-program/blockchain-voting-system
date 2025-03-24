/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/registration/InstitutionRegistrationForm.tsx
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Textarea,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  Divider,
  Text,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface InstitutionRegistrationFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  userData: any;
}

const InstitutionRegistrationForm = ({ onSubmit, isSubmitting, userData }: InstitutionRegistrationFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      institutionName: '',
      email: userData?.email || '',
      phoneNumber: '',
      institutionType: '',
      address: '',
      city: '',
      state: '',
      contactPersonName: userData?.name || '',
      contactPersonTitle: '',
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align="stretch">
        <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
          Institution Information
        </Text>

        <FormControl isInvalid={!!errors.institutionName} isRequired>
          <FormLabel>Institution Name</FormLabel>
          <Input
            {...register('institutionName', {
              required: 'Institution name is required',
            })}
          />
          <FormErrorMessage>{errors.institutionName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.institutionType} isRequired>
          <FormLabel>Institution Type</FormLabel>
          <Select
            placeholder="Select institution type"
            {...register('institutionType', {
              required: 'Institution type is required',
            })}
          >
            <option value="university">University</option>
            <option value="college">College</option>
            <option value="high_school">High School</option>
            <option value="government">Government Organization</option>
            <option value="corporate">Corporate</option>
            <option value="ngo">NGO</option>
            <option value="other">Other</option>
          </Select>
          <FormErrorMessage>{errors.institutionType?.message}</FormErrorMessage>
        </FormControl>

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

        <FormControl isInvalid={!!errors.phoneNumber} isRequired>
          <FormLabel>Phone Number</FormLabel>
          <InputGroup>
            <InputLeftAddon>+</InputLeftAddon>
            <Input
              type="tel"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: 'Invalid phone number',
                },
              })}
            />
          </InputGroup>
          <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
        </FormControl>

        <Divider my={2} />
        
        <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
          Address Information
        </Text>

        <FormControl isInvalid={!!errors.address} isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            {...register('address', {
              required: 'Address is required',
            })}
          />
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.city} isRequired>
          <FormLabel>City</FormLabel>
          <Input
            {...register('city', {
              required: 'City is required',
            })}
          />
          <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.state} isRequired>
          <FormLabel>State/Province</FormLabel>
          <Input
            {...register('state', {
              required: 'State is required',
            })}
          />
          <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
        </FormControl>

        <Divider my={2} />
        
        <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
          Contact Person Information
        </Text>

        <FormControl isInvalid={!!errors.contactPersonName} isRequired>
          <FormLabel>Contact Person Name</FormLabel>
          <Input
            {...register('contactPersonName', {
              required: 'Contact person name is required',
            })}
          />
          <FormErrorMessage>{errors.contactPersonName?.message?.toString()}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.contactPersonTitle} isRequired>
          <FormLabel>Contact Person Title/Position</FormLabel>
          <Input
            {...register('contactPersonTitle', {
              required: 'Title is required',
            })}
          />
          <FormErrorMessage>{errors.contactPersonTitle?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description (optional)</FormLabel>
          <Textarea
            {...register('description')}
            placeholder="Briefly describe your institution and how you plan to use our voting system"
            rows={4}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <Button
          mt={4}
          colorScheme="brand"
          isLoading={isSubmitting}
          type="submit"
          size="lg"
        >
          Register Institution
        </Button>
      </VStack>
    </form>
  );
};

export default InstitutionRegistrationForm;