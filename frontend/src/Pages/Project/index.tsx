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
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import ConfirmDeleteDialog from './components/DeleteDialog';
import CreateProjectModal from './components/CreateProjectModal';
import EditProjectModal from './components/EditProjectModal';


export default function Project() {
  const [data, setData] = useState<TypeProject[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<TypeProject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    getProjects().then((response) => {
      setData(response.data);
      console.log("foi");
    });
  }, []);

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
  }

  const handleDelete = (id: number) => {
    removeProject(id).then(() => {
      setData(data.filter((item) => item.id !== id));
      onClose();
    });
  }

  const handleDeleteDialog = (project: TypeProject) => {
    setSelectedProject(project);
    onOpen();
  }

  const handleCreateSuccess = (project: TypeProject) => {
    setData([...data, project]);
  }

  const handleEditDialog = (project: TypeProject) => {
    setSelectedProject(project);
    onEditOpen();
  }

  const handleEditSuccess = (updatedProject: TypeProject) => {
    setData(data.map((project) => (project.id === updatedProject.id ? updatedProject : project)));
  }


  const filteredData = data.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    statusParse(project.status).toLowerCase().includes(searchQuery.toLowerCase()) ||
    dateFix(project.started).toLowerCase().includes(searchQuery.toLowerCase()) ||
    dateFix(project.finished).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Heimdall - Projetos</title>
      </Helmet>
      <Box>
        <Flex mb={30} justifyContent="space-between" alignItems="center">
          <Text as="b" fontSize={"40px"} color={"#5923b8"}>PROJETOS</Text>
          <Button
            colorScheme="green"
            rightIcon={<Icon as={AiOutlinePlus} />}
            onClick={onCreateOpen}
          >
            Novo
          </Button>
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
                <Th textAlign="center">Status</Th>
                <Th textAlign="center">Inicio</Th>
                <Th textAlign="center">Fim</Th>
                <Th textAlign="center" w="5%">Editar</Th>
                <Th textAlign="center" w="5%">Remover</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((project) => (
                <Tr key={project.id}>
                  <Td textAlign="center">{project.name}</Td>
                  <Td textAlign="center">{statusParse(project.status)}</Td>
                  <Td textAlign="center">{dateFix(project.started)}</Td>
                  <Td textAlign="center">{dateFix(project.finished)}</Td>
                  <Td textAlign="center" w="5%">
                    <Button
                      variant="ghost"
                      colorScheme="purple"
                      onClick={() => {handleEditDialog(project)}}
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