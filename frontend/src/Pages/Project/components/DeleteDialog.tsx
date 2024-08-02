import React, { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
} from '@chakra-ui/react';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  projectName,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  
  const handleConfirm = () => {
    toast({
      title: "Projeto excluído!",
      description: `O projeto "${projectName}" foi excluído com sucesso.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onConfirm();
  };

  const handleCancel = () => {
    onClose();
  };

  
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleCancel}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Confirmar Exclusão
          </AlertDialogHeader>

          <AlertDialogBody>
            Tem certeza que deseja excluir o projeto "{projectName}"? Esta ação não pode ser desfeita.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleCancel}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleConfirm} ml={3}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
