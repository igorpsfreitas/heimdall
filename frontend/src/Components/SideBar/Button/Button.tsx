import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ISidebarButtonProps {
  name: string;
  pagePath: string;
  isSelected?: boolean;
}

export const SidebarButton = ({
  name,
  pagePath,
  isSelected,
}: ISidebarButtonProps): React.FunctionComponentElement<ISidebarButtonProps> => {
  const navigate = useNavigate();
  return (
  
      <Box
        w="100%"
        boxShadow={"base"}
        color="white"
        mt={2}
        fontSize="1.2rem"
        textTransform="capitalize"
        fontWeight={isSelected ? "bold" : "normal"}
        _hover={{ 
          shadow: "md",
          rounded: "md",
         }}
        _active={{
          shadow: "base",
          rounded: "md",
         }}
        rounded={"md"}
        backgroundColor={isSelected ? "#9f71f0" : "unset"}
        transition={"0.1s background-color"}
        userSelect="none"
        cursor="pointer"
        onClick={() => navigate(pagePath)}
      >
        <Box px={4} py={2}>
          <Text m={0}>{name}</Text>
        </Box>
      </Box>

  );
};

export default SidebarButton;
