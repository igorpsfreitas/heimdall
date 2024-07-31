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
import { TypeHolder, updateHolder } from '../../../API/holderServices';
import { TypeProject, getProjects } from '../../../API/projectServices';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: TypeHolder | null;
  onSuccess: (project: TypeHolder) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, project, onSuccess }) => {
  const [name, setName] = useState('');
  const [cpf, setCPF] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [project_id, setProjectId] = useState('');
  const [projects, setProjects] = useState<TypeProject[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (project) {
      setName(project.name);
      setCPF(project.cpf);
      setEmail(project.email);
      setPhone(project.phone);
      setProjectId(project.project_id);
      
    }
  }, [project]);

  useEffect(() => {
    getProjects().then((response) => {
      setProjects(response.data);
    });
  }, []);

  const handleUpdate = () => {
    if (project) {
      const updatedHolder: TypeHolder = {
        ...project,
        name,
        cpf,
        email,
        phone,
        project_id,
      };

      updateHolder(updatedHolder).then((response) => {
        onSuccess(response.data);
        toast({
          title: "Dado atualizado.",
          description: "Bolsista foi atualizado com sucesso.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      }).catch((error) => {
        toast({
          title: "Erro ao atualizar bolsista.",
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
                <FormControl id="name" isRequired>
                    <FormLabel>Nome:</FormLabel>
                    <Input
                        placeholder="Nome do Bolsista"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>

                <FormControl id="cpf" isRequired>
                    <FormLabel>CPF:</FormLabel>
                    <Input
                        placeholder="CPF"
                        value={cpf}
                        onChange={(e) => setCPF(e.target.value)}
                    />
                </FormControl>

                <FormControl id="email" isRequired>
                    <FormLabel>Email:</FormLabel>
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>

                <FormControl id="phone" isRequired>
                    <FormLabel>Telefone:</FormLabel>
                    <Input
                        placeholder="Telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </FormControl>
                <FormControl id="project" isRequired>
                  <FormLabel>Projeto:</FormLabel>
                  <Select
                    placeholder="Selecione um projeto"
                    value={project_id}
                    onChange={(e) => setProjectId(e.target.value)}
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
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
