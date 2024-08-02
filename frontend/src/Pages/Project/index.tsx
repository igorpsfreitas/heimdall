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
import { getProjects, TypeProject, removeProject } from '../../API/projectServices';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import ConfirmDeleteDialog from './components/DeleteDialog';
import CreateProjectModal from './components/CreateProjectModal';
import EditProjectModal from './components/EditProjectModal';

export default function Project() {
  const [data, setData] = useState<TypeProject[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof TypeProject>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<TypeProject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username'));
  
  useEffect(() => {
    getProjects().then((response) => {
      setData(response.data);
      setUsername(localStorage.getItem('username'));
    });
  }, []);

  useEffect(() => {
    getProjects().then((response) => {
      setData(response.data);
    });
  }, [onClose, onCreateClose, onEditClose]);

  const dateFix = (date: any) => {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    const formattedDate = adjustedDate.toLocaleDateString('pt-BR');
    return formattedDate;
  };

  const statusParse = (status: string) => {
    if (status === 'in_progress') {
      return 'Em progresso';
    } else {
      return 'Finalizado';
    }
  };

  const handleDelete = (id: number) => {
    removeProject(id).then(() => {
      setData(data.filter((item) => item.id !== id));
      onClose();
    });
  };

  const handleDeleteDialog = (project: TypeProject) => {
    setSelectedProject(project);
    onOpen();
  };

  const handleCreateSuccess = (project: TypeProject) => {
    setData([...data, project]);
  };

  const handleEditDialog = (project: TypeProject) => {
    setSelectedProject(project);
    onEditOpen();
  };

  const handleEditSuccess = (updatedProject: TypeProject) => {
    setData(data.map((project) => (project.id === updatedProject.id ? updatedProject : project)));
  };

  const sortData = (data: TypeProject[]) => {
    return data.sort((a, b) => {
      if (sortColumn === 'started' || sortColumn === 'finished') {
        
        const dateA = a[sortColumn] ? new Date(a[sortColumn] as string) : new Date(0);
        const dateB = b[sortColumn] ? new Date(b[sortColumn] as string) : new Date(0);
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      } else {
        
        const valueA = a[sortColumn] as string || '';
        const valueB = b[sortColumn] as string || '';
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    });
  };
  
  
  const filteredData = sortData(
    data.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statusParse(project.status).toLowerCase().includes(searchQuery.toLowerCase()) ||
      dateFix(project.started).toLowerCase().includes(searchQuery.toLowerCase()) ||
      dateFix(project.finished).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <Helmet>
        <title>Heimdall - Projetos</title>
      </Helmet>
      <Box>
        <Flex mb={30} justifyContent="space-between" alignItems="center">
          <Text as="b" fontSize={"40px"} color={"#5923b8"}>PROJETOS</Text>
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
          bottom={0}
          overflowX="auto"
          overflowY="auto"
          maxH="calc(100vh - 240px)"
        >
          <Table variant="striped" colorScheme='purple'>
            <Thead position="sticky" top={0} zIndex={1} bg="white">
              <Tr>
                <Th textAlign="center" onClick={() => {
                  setSortColumn('name');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Nome
                  {sortColumn === 'name' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => {
                  setSortColumn('status');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Status
                  {sortColumn === 'status' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => {
                  setSortColumn('started');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Inicio
                  {sortColumn === 'started' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => {
                  setSortColumn('finished');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Fim
                  {sortColumn === 'finished' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                {username !== 'guest' && <Th textAlign="center" w="5%">Editar</Th>}
                {username !== 'guest' && <Th textAlign="center" w="5%">Remover</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((project) => (
                <Tr key={project.id}>
                  <Td textAlign="center">{project.name}</Td>
                  <Td textAlign="center">{statusParse(project.status)}</Td>
                  <Td textAlign="center">{dateFix(project.started)}</Td>
                  <Td textAlign="center">{project.finished ? dateFix(project.finished) : '---'}</Td>
                  {username !== 'guest' && (
                    <Td textAlign="center" w="5%" padding={0}>
                      <Button
                        padding={0}
                        variant="ghost"
                        colorScheme="purple"
                        onClick={() => {handleEditDialog(project)}}
                      >
                        <Icon as={AiOutlineEdit} name="edit" />
                      </Button>
                    </Td>
                  )}
                  {username !== 'guest' && (
                    <Td textAlign="center" w="5%" padding={0}>
                    <Button
                      padding={0}
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteDialog(project)}
                    >
                      <Icon as={AiOutlineDelete} name="delete" />
                    </Button>
                  </Td>
                  )}
                </Tr>)
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      {selectedProject && (
        <ConfirmDeleteDialog
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={() => handleDelete(selectedProject.id)}
          projectName={selectedProject.name}
        />
      )}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={handleCreateSuccess}
      />
      {selectedProject && (
        <EditProjectModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          project={selectedProject}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
