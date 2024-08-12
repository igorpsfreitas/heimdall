import React, { useState, useEffect } from 'react';
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
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineInfoCircle } from 'react-icons/ai';
import ConfirmDeleteDialog from './components/DeleteDialog';
import CreatePatrimonyModal from './components/CreatePatrimonyModal';
import EditPatrimonyModal from './components/EditPatrimonyModal';
import InfoModal from './components/InfoModal';
import { TypeProject, getProjects } from '../../API/projectServices';

export default function Patrimony() {
  const [data, setData] = useState<TypePatrimony[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof TypePatrimony>('name');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' } | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedPatrimony, setSelectedPatrimony] = useState<TypePatrimony | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [projects, setProjects] = useState<TypeProject[]>([]);

  const { isOpen: isInfoOpen, onOpen: onInfoOpen, onClose: onInfoClose } = useDisclosure();
  const [infoData, setInfoData] = useState({ description: '', observation: '' });

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
    getProjects().then((response) => {
      setProjects(response.data);
    });
  }, [onClose, onCreateClose, onEditClose]);

  const statusParse = (status: string) => {
    if (status === 'available') {
      return 'Disponível';
    } else if (status === 'unavailable') {
      return 'Indisponível';
    }
    return 'Baixado';
  };

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

  const handleEditSuccess = (updatedPatrimony: TypePatrimony) => {
    setData(data.map((patrimony) => (patrimony.id === updatedPatrimony.id ? updatedPatrimony : patrimony)));
  }

  const handleInfoDialog = (description: string, observation: string) => {
    setInfoData({ description, observation });
    onInfoOpen();
  };

  const getProjectNameById = (id: string | Number | null) => {
    const projectId = typeof id === 'string' ? parseInt(id) : id ?? 0;
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : '';
  };

  const filteredData = data.filter((patrimony) =>
    patrimony.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patrimony.listing_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patrimony.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    statusParse(patrimony.status).toLowerCase().includes(searchQuery.toLowerCase()) ||
    projects.find(p => p.id === patrimony.project_id)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if ((a as any)[sortConfig.key] < (b as any)[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if ((a as any)[sortConfig.key] > (b as any)[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setSortOrder(direction === 'ascending' ? 'asc' : 'desc');
    setSortColumn(key as keyof TypePatrimony);
  }

  return (
    <>
      <Helmet>
        <title>Heimdall - Patrimônios</title>
      </Helmet>
      <Box>
        <Flex mb={30} justifyContent="space-between" alignItems="center">
          <Text as="b" fontSize={"40px"} color={"#5923b8"}>PATRIMÔNIO</Text>
          {username !== 'guest' && (<Button
            colorScheme="blue"
            leftIcon={<Icon as={AiOutlinePlus} />}
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
                <Th textAlign="center" onClick={() => { requestSort('name') }}>
                  Nome
                  {sortColumn === 'name' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => { requestSort('listing_code') }}>
                  Tombamento
                  {sortColumn === 'listing_code' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => { requestSort('serial_number') }}>
                  Nº de Série
                  {sortColumn === 'serial_number' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => { requestSort('project_id') }}>
                  Projeto
                  {sortColumn === 'project_id' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" onClick={() => { requestSort('status') }}>
                  Status
                  {sortColumn === 'status' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                <Th textAlign="center" w="5%">
                  Info
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
              {sortedData.map((patrimony) => (
                <Tr key={patrimony.id}>
                  <Td textAlign="center">{patrimony.name}</Td>
                  <Td textAlign="center">{patrimony.listing_code}</Td>
                  <Td textAlign="center">{patrimony.serial_number ? patrimony.serial_number : '---'}</Td>
                  <Td textAlign="center">{getProjectNameById(patrimony.project_id)}</Td>
                  <Td textAlign="center">{statusParse(patrimony.status)}</Td>
                  <Td textAlign="center" w="5%" padding={0}>
                    <Button
                      padding={0}
                      variant="ghost"
                      colorScheme="black"
                      onClick={() => handleInfoDialog(patrimony.description || '---', patrimony.observation || '---')}
                    >
                      <Icon as={AiOutlineInfoCircle} name="info" />
                    </Button>
                  </Td>
                  {username !== 'guest' && (
                    <>
                      <Td textAlign="center" w="5%" padding={0}>
                        <Button
                          padding={0}
                          variant="ghost"
                          colorScheme="purple"
                          onClick={() => { handleEditDialog(patrimony); }}
                        >
                          <Icon as={AiOutlineEdit} name="edit" />
                        </Button>
                      </Td>
                      <Td textAlign="center" w="5%" padding={0}>
                        <Button
                          padding={0}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteDialog(patrimony)}
                        >
                          <Icon as={AiOutlineDelete} name="delete" />
                        </Button>
                      </Td>
                    </>
                  )}
                </Tr>
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
          patrimonyName={selectedPatrimony.name}
        />
      )}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={onInfoClose}
        description={infoData.description}
        observation={infoData.observation}
      />
      <CreatePatrimonyModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={handleCreateSuccess}
      />
      {selectedPatrimony && (
        <EditPatrimonyModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          patrimony={selectedPatrimony}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
