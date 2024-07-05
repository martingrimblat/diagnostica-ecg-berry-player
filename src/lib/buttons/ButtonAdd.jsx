import React from 'react';
import { useTranslation } from "react-i18next";
import DButton from './DButton';
import styled from "styled-components";

const StyledDButton = styled(DButton)`
  margin-right: 5px;
  line-height: 30px;
  border-width: 1px;
  ${({isPin})=> (isPin) && 
  `
  margin-left: 6px;
  `
  }
`;

export const ButtonAdd = ({
    handleDragIndicators,
    repository,
    isPin= true
}) => {
    const { t } = useTranslation("global");
  return (
    <StyledDButton 
    repository={repository}
    isPin={isPin}
    outlined
    onClick={() => {
      handleDragIndicators();
    }}
    >
      {t("Añadir comentario")}
    </StyledDButton>
  )
}
