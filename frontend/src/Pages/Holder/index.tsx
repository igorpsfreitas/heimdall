import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Table,
  Tbody,
  Button,
  Icon,
  Divider,
  Flex,
  useDisclosure,
  Input,

} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { getHolders, TypeHolder, removeHolder} from '../../API/holderServices';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import ConfirmDeleteDialog from './components/DeleteDialog';
import CreateProjectModal from './components/CreateProjectModal';
import EditProjectModal from './components/EditProjectModal';
import { TypeProject, getProjects } from '../../API/projectServices';

export default function Holder() {
  const [data, setData] = useState<TypeHolder[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedHolder, setSelectedHolder] = useState<TypeHolder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [projects, setProjects] = useState<TypeProject[]>([]);
  
  useEffect(() => {
    getHolders().then((response) => {
      setData(response.data);
      setUsername(localStorage.getItem('username'));
    });
  }, []);

  useEffect(() => {
    getProjects().then((response) => {
      setProjects(response.data);
    });
  }, []);

  const handleDelete = (id: number) => {
    removeHolder(id).then(() => {
      setData(data.filter((item) => item.id !== id));
      onClose();
    });
  }

  const handleDeleteDialog = (project: TypeHolder) => {
    setSelectedHolder(project);
    onOpen();
  }

  const handleCreateSuccess = (project: TypeHolder) => {
    setData([...data, project]);
  }

  const handleEditDialog = (project: TypeHolder) => {
    setSelectedHolder(project);
    onEditOpen();
  }

  const handleEditSuccess = (updatedProject: TypeHolder) => {
    setData(data.map((project) => (project.id === updatedProject.id ? updatedProject : project)));
  }
  const getProjectNameById = (id: string) => {
    const projectId = parseInt(id);
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : '';
  };

  const filteredData = data.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.cpf.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    projects.find(p => p.id === parseInt(project.project_id))?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Heimdall - Bolsistas</title>
      </Helmet>
      <Box>
        <Flex mb={30} justifyContent="space-between" alignItems="center">
          <Text as="b" fontSize={"40px"} color={"#5923b8"}>BOLSISTAS</Text>
          {username !== 'guest' && (<Button
            colorScheme="green"
            rightIcon={<Icon as={AiOutlinePlus} />}
            onClick={onCreateOpen}
          >
            Novo
          </Button>
          )}
        </Flex>
        <Box mb={4}>
          <Input
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Divider />
        <TableContainer
          w="100%"
          maxH="60vh"
          overflowX="auto"
          overflowY="auto"
        >
          <Table variant="striped" colorScheme='purple'>
            <Thead position="sticky" top={0} zIndex={1} bg="white">
              <Tr>
                <Th textAlign="center">Nome</Th>
                {username !== 'guest' && <Th textAlign="center">CPF</Th>}
                <Th textAlign="center">E-mail</Th>
                <Th textAlign="center">Telefone</Th>
                <Th textAlign="center">Projeto</Th>
                {username !== 'guest' && <Th textAlign="center" w="5%">Editar</Th>}
                {username !== 'guest' && <Th textAlign="center" w="5%">Remover</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((project) => (
                <Tr key={project.id}>
                  <Td textAlign="center">{project.name}</Td>
                  {username !== 'guest' && <Td textAlign="center">{project.cpf}</Td>}
                  <Td textAlign="center">{project.email}</Td>
                  <Td textAlign="center">{project.phone}</Td>
                  <Td textAlign="center">{getProjectNameById(project.project_id)}</Td>
                  {username !== 'guest' && (
                    <>
                      <Td textAlign="center" w="5%">
                        <Button
                          variant="ghost"
                          colorScheme="purple"
                          onClick={() => { handleEditDialog(project); } }
                        >
                          <Icon as={AiOutlineEdit} name="edit" />
                        </Button>
                      </Td>
                      <Td textAlign="center" w="5%">
                        <Button
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteDialog(project)}
                        >
                          <Icon as={AiOutlineDelete} name="delete" />
                        </Button>
                      </Td>
                    </>
                  )}
                </Tr>)
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      {selectedHolder && (
        <ConfirmDeleteDialog
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={() => handleDelete(selectedHolder.id)}
          projectName={selectedHolder.name}
        />
      )}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={handleCreateSuccess}
      />
      {selectedHolder && (
        <EditProjectModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          project={selectedHolder}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}