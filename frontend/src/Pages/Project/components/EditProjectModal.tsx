import React, { useState, useEffect } from 'react';
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
import { TypeProject, updateProject } from '../../../API/projectServices';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: TypeProject | null;
  onSuccess: (project: TypeProject) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onSuccess }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'in_progress' | 'finished'>('in_progress');
  const [started, setStarted] = useState('');
  const [finished, setFinished] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (project) {
      setName(project.name);
      setStatus(project.status);
      setStarted(project.started ? new Date(project.started).toISOString().split('T')[0] : '');
      setFinished(project.finished ? new Date(project.finished).toISOString().split('T')[0] : '');
    }
  }, [project]);

  const handleUpdate = () => {
    if (project) {
      const updatedProject: TypeProject = {
        ...project,
        name,
        status,
        started,
        finished,
      };

      updateProject(updatedProject).then((response) => {
        onSuccess(response.data);
        toast({
          title: "Projeto atualizado.",
          description: "O projeto foi atualizado com sucesso.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      }).catch((error) => {
        toast({
          title: "Erro ao atualizar projeto.",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Projeto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="name" mb={4}>
            <FormLabel>Nome</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl id="status" mb={4}>
            <FormLabel>Status</FormLabel>
            <Select
                        placeholder="Selecione o Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'in_progress' | 'finished')}
                    >
                        <option value="in_progress">Em Progresso</option>
                        <option value="finished">Finalizado</option>
                    </Select>
          </FormControl>
          <FormControl id="started" mb={4}>
            <FormLabel>Início</FormLabel>
            <Input type="date" value={started} onChange={(e) => setStarted(e.target.value)} />
          </FormControl>
          <FormControl id="finished" mb={4}>
            <FormLabel>Fim</FormLabel>
            <Input type="date" value={finished} onChange={(e) => setFinished(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
            Atualizar
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProjectModal;
