import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Select,
} from '@chakra-ui/react';
import { TypeProject, createProject } from '../../../API/projectServices';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: TypeProject) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'in_progress' | 'finished'>('in_progress');
  const [started, setStarted] = useState('');
  const [finished, setFinished] = useState<string | null>(null);
  const [created_by, setCreatedBy] = useState(localStorage.getItem('user_id'));
  const [updated_by, setUpdatedBy] = useState(localStorage.getItem('user_id'));

  const toast = useToast();
  useEffect(() => {
    if (finished === ""){
      setFinished(null);
    }
  }
  , [finished]);

  useEffect(() => {
    if (status === 'in_progress') {
      setFinished(null);
    }
  }
  , [status]);
  
  useEffect(() => {
    setName('');
    setStatus('in_progress');
    setStarted('');
    setFinished('');
    setCreatedBy(localStorage.getItem('user_id'));
    setUpdatedBy(localStorage.getItem('user_id'));
  } , [isOpen]);

  const handleSubmit = () => {
    const newProject = {
      
      name,
      status,
      started,
      finished,
      created_by,
      updated_by,
    };

    createProject(newProject).then((response) => {
      onSuccess(response.data); 
      onClose();
      toast({
        title: "Projeto criado.",
        description: "O projeto foi criado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }).catch((error) => {
      toast({
        title: "Erro.",
        description: "Houve um erro ao criar o projeto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
  };

return (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Criar Novo Projeto</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl id="name" isRequired>
          <FormLabel>Nome do Projeto</FormLabel>
          <Input
            placeholder="Nome do Projeto"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl id="status" isRequired mt={4}>
          <FormLabel>Status</FormLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'in_progress' | 'finished')}
          >
            <option value="in_progress">Em Progresso</option>
            <option value="finished">Finalizado</option>
          </Select>
        </FormControl>

        <FormControl id="started" isRequired mt={4}>
          <FormLabel>Data de Início</FormLabel>
          <Input
            type="date"
            value={started}
            onChange={(e) => setStarted(e.target.value)}
          />
        </FormControl>

        <FormControl id="finished" isRequired={status === 'finished'} mt={4}>
          <FormLabel>Data de Término</FormLabel>
          <Input
            type="date"
            value={finished ?? ''}
            onChange={(e) => setFinished(e.target.value)}
            disabled={status === 'in_progress'}
          />
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button
          colorScheme="blue"
          mr={3}
          onClick={handleSubmit}
          isDisabled={!name || !started || (status === 'finished' && !finished)}
        >
          Criar
        </Button>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
};

export default CreateProjectModal;