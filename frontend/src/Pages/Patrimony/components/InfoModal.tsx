// components/InfoModal.tsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Divider,
} from '@chakra-ui/react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  observation: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, description, observation }) => {
return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnEsc={false} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Detalhes do Patrimônio</ModalHeader>
            <ModalCloseButton />
            <ModalBody maxHeight="60vh" overflowY={"auto"}>
                <Text><strong>Descrição:</strong></Text> 
                <Text textAlign="justify">{description || '---'}</Text>
                <Divider mt={4} mb={4} variant={"solid"}/>
                <Text><strong>Observação:</strong></Text>
                <Text textAlign="justify">{observation || '---'}</Text>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Fechar
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);
};

export default InfoModal;
