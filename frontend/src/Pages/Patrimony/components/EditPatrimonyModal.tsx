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
  Textarea,
  useToast,
  Select,
} from '@chakra-ui/react';
import { TypePatrimony, updatePatrimony } from '../../../API/patrimonyServices';
import { TypeProject, getProjects } from '../../../API/projectServices';
import { TypeHolder, getHolders } from '../../../API/holderServices';

interface EditPatrimonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  patrimony: TypePatrimony | null;
  onSuccess: (patrimony: TypePatrimony) => void;
}

const EditPatrimonyModal: React.FC<EditPatrimonyModalProps> = ({ isOpen, onClose, patrimony, onSuccess }) => {
  const [name, setName] = useState('');
  const [listing_code, setListingCode] = useState('');
  const [serial_number, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [observation, setObservation] = useState('');
  const [status, setStatus] = useState<'available' | 'unavailable' | 'dead'>('available');
  const [created_by, setCreatedBy] = useState(localStorage.getItem('user_id') || '');
  const [updated_by, setUpdatedBy] = useState(localStorage.getItem('user_id') || '');
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
    if (patrimony) {
      setName(patrimony.name);
      setListingCode(patrimony.listing_code);
      setSerialNumber(patrimony.serial_number);
      setDescription(patrimony.description || '');
      setObservation(patrimony.observation || '');
      setStatus(patrimony.status as 'available' | 'unavailable' | 'dead');
      setCreatedBy(patrimony.created_by?.toString() || localStorage.getItem('user_id') || '0');
      setUpdatedBy(patrimony.updated_by?.toString() || localStorage.getItem('user_id') || '0');
      setHolderId(patrimony.holder_id);
      setProjectId(patrimony.project_id ?? null);
    }
  }, [patrimony]);

  const handleUpdate = () => {
    if (patrimony) {
      const updatedPatrimony: TypePatrimony = {
        ...patrimony,
        name,
        listing_code,
        serial_number,
        description,
        observation,
        status,
        created_by,
        updated_by,
        holder_id,
        project_id,
      };

      updatePatrimony(updatedPatrimony).then((response) => {
        onSuccess(response.data);
        toast({
          title: "Patrimônio atualizado.",
          description: "O patrimônio foi atualizado com sucesso.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      }).catch((error) => {
        toast({
          title: "Erro ao atualizar patrimônio.",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Patrimônio</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="60vh" overflowY="auto">
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
              value={serial_number}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </FormControl>

          <FormControl id="description" mt={4}>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl id="observation" mt={4}>
            <FormLabel>Observação</FormLabel>
            <Textarea
              placeholder="Observação"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </FormControl>

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
            onClick={handleUpdate}
            isDisabled={!name || !listing_code || !status || !project_id}
          >
            Atualizar
          </Button>
          <Button colorScheme={'red'} variant={'outline'} onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditPatrimonyModal;
