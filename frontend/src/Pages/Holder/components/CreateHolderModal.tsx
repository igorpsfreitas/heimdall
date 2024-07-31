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
import { TypeHolder, createHolder } from '../../../API/holderServices';

import { getProjects, TypeProject } from '../../../API/projectServices';

interface CreateHolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (holder: TypeHolder) => void;
}

const CreateHolderModal: React.FC<CreateHolderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [cpf, setCPF] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [project_id, setProjectId] = useState('');
  const [created_by, setCreatedBy] = useState(localStorage.getItem('user_id'));
  const [updated_by, setUpdatedBy] = useState(localStorage.getItem('user_id'));
  const [projects, setProjects] = useState<TypeProject[]>([]);

  useEffect(() => {
    getProjects().then((response) => {
      setProjects(response.data);
    });
  }, []);
  const toast = useToast();

  const handleSubmit = () => {
    const newHolder = {

      name,
      cpf,
      email,
      phone,
      project_id,
      created_by,
      updated_by,
    };

    createHolder(newHolder).then((response) => {
      onSuccess(response.data);
      onClose();
      toast({
        title: "Bolsista criado.",
        description: "O Bolsista foi criado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }).catch((error) => {
      toast({
        title: "Erro.",
        description: "Houve um erro ao criar o Bolsista.",
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
        <ModalHeader>Criar Novo Bolsista</ModalHeader>
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
              {projects.map((holder) => (
                <option key={holder.id} value={holder.id}>
                  {holder.name}
                </option>
              ))}
            </Select>
          </FormControl>

        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Criar
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateHolderModal;