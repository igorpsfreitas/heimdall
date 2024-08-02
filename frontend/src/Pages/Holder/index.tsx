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
import { getHolders, TypeHolder, removeHolder } from '../../API/holderServices';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import ConfirmDeleteDialog from './components/DeleteDialog';
import CreateHolderModal from './components/CreateHolderModal';
import EditHolderModal from './components/EditHolderModal';
import { TypeProject, getProjects } from '../../API/projectServices';

export default function Holder() {
  const [data, setData] = useState<TypeHolder[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' } | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedHolder, setSelectedHolder] = useState<TypeHolder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [projects, setProjects] = useState<TypeProject[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof TypeHolder>('name');

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
  }, [onClose, onCreateClose, onEditClose]);

  const handleDelete = (id: number) => {
    removeHolder(id).then(() => {
      setData(data.filter((item) => item.id !== id));
      onClose();
    });
  }

  const handleDeleteDialog = (holder: TypeHolder) => {
    setSelectedHolder(holder);
    onOpen();
  }

  const handleCreateSuccess = (holder: TypeHolder) => {
    setData([...data, holder]);
  }

  const handleEditDialog = (holder: TypeHolder) => {
    setSelectedHolder(holder);
    onEditOpen();
  }

  const handleEditSuccess = (updatedHolder: TypeHolder) => {
    setData(data.map((holder) => (holder.id === updatedHolder.id ? updatedHolder : holder)));
  }

  const getProjectNameById = (id: string) => {
    const projectId = parseInt(id);
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : '';
  };

  const filteredData = data.filter((holder) =>
    holder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    holder.cpf.toLowerCase().includes(searchQuery.toLowerCase()) ||
    holder.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    holder.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    projects.find(p => p.id === parseInt(holder.project_id))?.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    setSortColumn(key as keyof TypeHolder);
  };

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
                <Th textAlign="center" onClick={() => requestSort('name')}>
                  Nome
                  {sortColumn === 'name' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>
                {username !== 'guest' && <Th textAlign="center" onClick={() => requestSort('cpf')}>
                  CPF
                {sortColumn === 'cpf' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                </Th>}
                <Th textAlign="center" onClick={() => requestSort('email')}>
                  E-mail
                  {sortColumn === 'email' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                  </Th>
                <Th textAlign="center" onClick={() => requestSort('phone')}>
                  Telefone
                  {sortColumn === 'phone' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
                  </Th>
                <Th textAlign="center" onClick={() => requestSort('project_id')}>
                  Projeto
                  {sortColumn === 'project_id' && (sortOrder === 'asc' ? <Icon as={AiOutlineArrowUp} /> : <Icon as={AiOutlineArrowDown} />)}
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
              {sortedData.map((holder) => (
                <Tr key={holder.id}>
                  <Td textAlign="center">{holder.name}</Td>
                  {username !== 'guest' && <Td textAlign="center">{holder.cpf}</Td>}
                  <Td textAlign="center">{holder.email}</Td>
                  <Td textAlign="center">{holder.phone}</Td>
                  <Td textAlign="center">{getProjectNameById(holder.project_id)}</Td>
                  {username !== 'guest' && (
                    <>
                      <Td textAlign="center" w="5%">
                        <Button
                          variant="ghost"
                          colorScheme="purple"
                          onClick={() => { handleEditDialog(holder); } }
                        >
                          <Icon as={AiOutlineEdit} name="edit" />
                        </Button>
                      </Td>
                      <Td textAlign="center" w="5%">
                        <Button
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteDialog(holder)}
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
      <CreateHolderModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={handleCreateSuccess}
      />
      {selectedHolder && (
        <EditHolderModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          holder={selectedHolder}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
