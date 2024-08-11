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
import { TypePatrimony, createPatrimony } from '../../../API/patrimonyServices';
import { TypeProject, getProjects } from '../../../API/projectServices';
import { TypeHolder, getHolders } from '../../../API/holderServices';

interface CreatePatrimonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: TypePatrimony) => void;
}

const CreatePatrimonyModal: React.FC<CreatePatrimonyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [listing_code, setListingCode] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [observation, setObservation] = useState('');
  const [status, setStatus] = useState<'available' | 'unavailable' | 'dead'>('available');
  const [created_by, setCreatedBy] = useState(localStorage.getItem('user_id'));
  const [updated_by, setUpdatedBy] = useState(localStorage.getItem('user_id'));
  const [holder_id, setHolderId] = useState<number | null>(null);
  const [project_id, setProjectId] = useState<number | null>(null);
  const [projects, setProjects] = useState<TypeProject[]>([]);
  const [holders, setHolders] = useState<TypeHolder[]>([]);
  
  const toast = useToast();

  useEffect(() => {
    getProjects().then((response) => {
      setProjects(response.data);
    });
    getHolders().then((response) => {
      setHolders(response.data);
    });
  }, []);

  useEffect(() => {
    setName('');
    setListingCode('');
    setSerialNumber('');
    setDescription('');
    setObservation('');
    setStatus('available');
    setCreatedBy(localStorage.getItem('user_id'));
    setUpdatedBy(localStorage.getItem('user_id'));
    setHolderId(null);
    setProjectId(null);
  }, [isOpen]);

  const handleSubmit = () => {
    const newPatrimony = {
      name,
      listing_code,
      serial_number: serialNumber,
      description,
      observation,
      status,
      holder_id,
      project_id,
      created_by,
      updated_by,
    };

    createPatrimony(newPatrimony).then((response) => {
      onSuccess(response.data);
      onClose();
      toast({
        title: "Patrimônio criado.",
        description: "O patrimônio foi criado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }).catch((error) => {
      toast({
        title: "Erro.",
        description: "Houve um erro ao criar o patrimônio.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar Patrimônio</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="name" isRequired>
            <FormLabel>Nome do Equipamento</FormLabel>
            <Input
              placeholder="Nome do Equipamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl id="listing_code" isRequired mt={4}>
            <FormLabel>Tombamento</FormLabel>
            <Input
              placeholder="Tombamento"
              value={listing_code}
              onChange={(e) => setListingCode(e.target.value)}
            />
          </FormControl>

          <FormControl id="serial_number" mt={4}>
            <FormLabel>Número de Série</FormLabel>
            <Input
              placeholder="Número de Série"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </FormControl>

          <FormControl id="description" mt={4}>
            <FormLabel>Descrição</FormLabel>
            <Input
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          {/* <FormControl id="observation" mt={4}>
            <FormLabel>Observação</FormLabel>
            <Input
              placeholder="Observação"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </FormControl> */}

          <FormControl id="status" isRequired mt={4}>
            <FormLabel>Status</FormLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'available' | 'unavailable' | 'dead')}
            >
              <option value="available">Disponível</option>
              <option value="unavailable">Indisponível</option>
              <option value="dead">Baixado</option>
            </Select>
          </FormControl>
          <FormControl id="project_id" isRequired mt={4}>
            <FormLabel>Projeto</FormLabel>
            <Select
              value={project_id || ''}
              onChange={(e) => setProjectId(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Nenhum</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl id="holder_id" mt={4}>
            <FormLabel>Responsável</FormLabel>
            <Select
              value={holder_id || ''}
              onChange={(e) => setHolderId(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Nenhum</option>
              {holders.map((holder) => (
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
            onClick={handleSubmit}>
            Adicionar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CreatePatrimonyModal;