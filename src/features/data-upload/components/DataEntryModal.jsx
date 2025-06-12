import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import {
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
  VStack,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  Select,
  useToast,
} from '@chakra-ui/react';

const DataEntryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    lab: '',
    investigator: '',
    chromosome: '',
    start: '',
    end: '',
    assembly: '',
    gene: '',
    species: '',
    tissue: '',
    cellType: '',
    cellLine: '',
    genetype: '',
    treatment: '',
    fov: '',
    stepSize: '',
    walkLength: '',
    numberOfReadout: '',
    protocol: '',
    photobleach: '',
    extraNote: '',
    csvUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const EMAILJS_SERVICE_ID = 'service_28pt9ow';
  const EMAILJS_TEMPLATE_ID = 'template_qa0xxy6';
  const EMAILJS_PUBLIC_KEY = 'wsaE58aAM0O_ZXb_u';

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async () => {
    try {
      // Prepare template parameters for EmailJS
      const templateParams = {
        to_email: 'recipient@example.com',
        from_name: formData.name,
        from_email: formData.email,
        subject: 'New Data Entry Form Submission',

        // Form data
        name: formData.name,
        email: formData.email,
        lab: formData.lab,
        investigator: formData.investigator,
        chromosome: formData.chromosome,
        start: formData.start,
        end: formData.end,
        assembly: formData.assembly,
        gene: formData.gene,
        species: formData.species,
        tissue: formData.tissue,
        cellType: formData.cellType,
        cellLine: formData.cellLine,
        genetype: formData.genetype,
        treatment: formData.treatment,
        fov: formData.fov,
        stepSize: formData.stepSize,
        walkLength: formData.walkLength,
        numberOfReadout: formData.numberOfReadout,
        protocol: formData.protocol,
        photobleach: formData.photobleach,
        extraNote: formData.extraNote,
        csvUrl: formData.csvUrl,

        // Additional info
        submission_date: new Date().toLocaleString(),
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email
      const emailResult = await sendEmail();

      if (emailResult.success) {
        toast({
          title: 'Success!',
          description: 'Form submitted and email sent successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Reset form and close modal
        handleReset();
        onClose();
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error sending the email. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      lab: '',
      investigator: '',
      chromosome: '',
      start: '',
      end: '',
      assembly: '',
      gene: '',
      species: '',
      tissue: '',
      cellType: '',
      cellLine: '',
      genetype: '',
      treatment: '',
      fov: '',
      stepSize: '',
      walkLength: '',
      numberOfReadout: '',
      protocol: '',
      photobleach: '',
      extraNote: '',
      csvUrl: '',
    });
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Data Entry Form</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Required Name Field */}
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Name:</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            {/* Required Email Field */}
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email:</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            {/* Rest of the fields remain the same */}
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Lab:</FormLabel>
              <Input
                value={formData.lab}
                onChange={(e) => handleInputChange('lab', e.target.value)}
                placeholder="Enter lab"
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Investigator:</FormLabel>
              <Input
                value={formData.investigator}
                onChange={(e) => handleInputChange('investigator', e.target.value)}
                placeholder="Enter investigator"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Chromosome:</FormLabel>
              <Input
                value={formData.chromosome}
                onChange={(e) => handleInputChange('chromosome', e.target.value)}
                placeholder="Enter chromosome"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Start:</FormLabel>
              <NumberInput
                value={formData.start}
                onChange={(value) => handleInputChange('start', value)}
              >
                <NumberInputField placeholder="Enter start position" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>End:</FormLabel>
              <NumberInput
                value={formData.end}
                onChange={(value) => handleInputChange('end', value)}
              >
                <NumberInputField placeholder="Enter end position" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Assembly:</FormLabel>
              <Input
                value={formData.assembly}
                onChange={(e) => handleInputChange('assembly', e.target.value)}
                placeholder="Enter assembly"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Gene / locus:</FormLabel>
              <Input
                value={formData.gene}
                onChange={(e) => handleInputChange('gene', e.target.value)}
                placeholder="Enter gene"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Species:</FormLabel>
              <Input
                value={formData.species}
                onChange={(e) => handleInputChange('species', e.target.value)}
                placeholder="Enter species"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Tissue:</FormLabel>
              <Input
                value={formData.tissue}
                onChange={(e) => handleInputChange('tissue', e.target.value)}
                placeholder="Enter tissue"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cell Type:</FormLabel>
              <Input
                value={formData.cellType}
                onChange={(e) => handleInputChange('cellType', e.target.value)}
                placeholder="Enter cell type"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cell Line:</FormLabel>
              <Input
                value={formData.cellLine}
                onChange={(e) => handleInputChange('cellLine', e.target.value)}
                placeholder="Enter cell line"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Genetype:</FormLabel>
              <Input
                value={formData.genetype}
                onChange={(e) => handleInputChange('genetype', e.target.value)}
                placeholder="Enter genetype"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Treatment:</FormLabel>
              <Input
                value={formData.treatment}
                onChange={(e) => handleInputChange('treatment', e.target.value)}
                placeholder="Enter treatment"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Number of FOV:</FormLabel>
              <NumberInput
                value={formData.fov}
                onChange={(value) => handleInputChange('fov', value)}
              >
                <NumberInputField placeholder="Enter FOV" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Step Size (unit: kb):</FormLabel>
              <NumberInput
                value={formData.stepSize}
                onChange={(value) => handleInputChange('stepSize', value)}
              >
                <NumberInputField placeholder="Enter step size in kb" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Walk Length (unit: kb):</FormLabel>
              <NumberInput
                value={formData.walkLength}
                onChange={(value) => handleInputChange('walkLength', value)}
              >
                <NumberInputField placeholder="Enter walk length in kb" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Number of Readout:</FormLabel>
              <NumberInput
                value={formData.numberOfReadout}
                onChange={(value) => handleInputChange('numberOfReadout', value)}
              >
                <NumberInputField placeholder="Enter number of readout" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Protocol:</FormLabel>
              <Input
                value={formData.protocol}
                onChange={(e) => handleInputChange('protocol', e.target.value)}
                placeholder="Enter protocol"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Photobleach:</FormLabel>
              <Select
                value={formData.photobleach || 'N/A'}
                onChange={(e) => handleInputChange('photobleach', e.target.value)}
                defaultValue="N/A"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="N/A">N/A</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Extra Note:</FormLabel>
              <Textarea
                value={formData.extraNote}
                onChange={(e) => handleInputChange('extraNote', e.target.value)}
                placeholder="Enter any additional notes"
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>URL of CSV file (if available):</FormLabel>
              <Input
                type="url"
                value={formData.csvUrl}
                onChange={(e) => handleInputChange('csvUrl', e.target.value)}
                placeholder="Enter CSV file URL"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleReset} disabled={isSubmitting}>
            Reset
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Sending..."
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DataEntryModal;
