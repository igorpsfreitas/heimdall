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

  const toast = useToast();
  useEffect(() => {
    getProjects().then((response) => {
      setProjects(response.data);
    });
  }, []);

  useEffect(() => {
    setName('');
    setCPF('');
    setEmail('');
    setPhone('');
    setProjectId('');
    setCreatedBy(localStorage.getItem('user_id'));
    setUpdatedBy(localStorage.getItem('user_id'));
  }, [isOpen]);

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

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não for número
    value = value.replace(/\D/g, '');

    // Formata o número conforme necessário
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      value = value.replace(/^(\d*)/, '($1');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const formatCPF = (value: string) => {
    // Remove tudo que não for número
    value = value.replace(/\D/g, '');

    // Formata o CPF conforme necessário
    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    }

    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCPF(formatCPF(e.target.value));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnEsc={false} closeOnOverlayClick={false}>
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
              onChange={handleCPFChange}
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
              onChange={handlePhoneChange}
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
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isDisabled={!name || !cpf || !email || !phone || !project_id}
          >
            Criar
          </Button>
          <Button colorScheme={'red'} variant={'outline'} onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateHolderModal;