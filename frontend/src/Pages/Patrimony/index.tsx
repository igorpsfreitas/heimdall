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
import { getPatrimonies, TypePatrimony, removePatrimony } from '../../API/patrimonyServices';
import { TypeProject } from '../../API/projectServices';
import { TypeHolder } from '../../API/holderServices';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import ConfirmDeleteDialog from './components/DeleteDialog';
import CreatePatrimonyModal from './components/CreatePatrimonyModal';
import EditProjectModal from './components/EditProjectModal';

export default function Patrimony() {
  const [data, setData] = useState<TypePatrimony[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof TypePatrimony>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedPatrimony, setSelectedPatrimony] = useState<TypePatrimony | null>(null);
  const [selectedHolder, setSelectedHolder] = useState<TypeHolder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    getPatrimonies().then((response) => {
      setData(response.data);
      setUsername(localStorage.getItem('username'));
    });
  }, []);

  useEffect(() => {
    getPatrimonies().then((response) => {
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
    if (status === 'avaliable') {
      return 'Disponível';
    } else if (status === 'unavaliable') {
      return 'Indisponível';
    }
    return 'Baixado';
  }

  const handleDelete = (id: number) => {
    removePatrimony(id).then(() => {
      setData(data.filter((item) => item.id !== id));
      onClose();
    });
  };

  const handleDeleteDialog = (patrimony: TypePatrimony) => {
    setSelectedPatrimony(patrimony);
    onOpen();
  };

  const handleCreateSuccess = (patrimony: TypePatrimony) => {
    setData([...data, patrimony]);
  };

  const handleEditDialog = (patrimony: TypePatrimony) => {
    setSelectedPatrimony(patrimony);
    onEditOpen();
  };
 // Compare this snippet from frontend/src/Pages/Patrimony/index.tsx:
  const handleEditSuccess = (updatedPatrimony: TypePatrimony) => {
    setData(data.map((patrimony) => (patrimony.id === updatedPatrimony.id ? updatedPatrimony : patrimony)));
  };

  return (
    <>
      <Helmet>
        <title>Heimdall - Patrimônios</title>
      </Helmet>
      <Box>
        <Flex mb={30} justifyContent="space-between" alignItems="center">
          <Text as="b" fontSize={"40px"} color={"#5923b8"}>PATRIMÔNIO</Text>
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
                  setSortColumn('listing_code');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Tombamento
                  {sortColumn === 'listing_code' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => {
                  setSortColumn('serial_number');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Nº de Série
                  {sortColumn === 'serial_number' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => {
                  setSortColumn('description');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Descrição
                  {sortColumn === 'description' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => {
                  setSortColumn('observation');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Observação
                  {sortColumn === 'observation' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => {
                  setSortColumn('project_id');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Projeto
                  {sortColumn === 'project_id' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => {
                  setSortColumn('status');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}>
                  Status
                  {sortColumn === 'status' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                {username !== 'guest' && <Th textAlign="center" w="5%">
                  Editar
                </Th>}
                {username !== 'guest' && <Th textAlign="center" w="5%">
                  Remover
                </Th>}
              </Tr>
            </Thead>
            <Tbody>
              {data.map((project) => (
                username !== 'guest' && (
                  <Tr key={project.id}>
                    <Td textAlign="center">{project.name}</Td>
                    <Td textAlign="center">{project.listing_code}</Td>
                    <Td textAlign="center">{project.serial_number ? project.serial_number : '---'}</Td>
                    <Td textAlign="center">{project.description ? project.description : '---'}</Td>
                    <Td textAlign="center">{project.observation ? project.observation : '---'}</Td>
                    <Td textAlign="center">{project.project_id}</Td>
                    <Td textAlign="center">{project.status}</Td>
                    <Td textAlign="center" w="5%" padding={0}>
                      <Button
                        padding={0}
                        variant="ghost"
                        colorScheme="purple"
                        onClick={() => { handleEditDialog(project) }}
                      >
                        <Icon as={AiOutlineEdit} name="edit" />
                      </Button>
                    </Td>
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
                  </Tr>
                )
              ))}
            </Tbody>

          </Table>
        </TableContainer>
      </Box>
      {selectedPatrimony && (
        <ConfirmDeleteDialog
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={() => handleDelete(selectedPatrimony.id)}
          projectName={selectedPatrimony.name}
        />
      )}
      <CreatePatrimonyModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={handleCreateSuccess}
      />
        {/* <EditProjectModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        project={selectedProject}
        onSuccess={handleEditSuccess}
      /> */}
      
    </>
  );
}
