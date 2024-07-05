import React from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';

const StandardButton = styled.button`
    position: relative;
    color: white;
    background: #004FEC;
    border-color:#004FEC;
    border-width: 0px;
    border-radius: 50px;
    padding:15px 60px;

    font-family: Rokkitt;
    font-size: 27px;
    font-style: normal;
    font-weight: 700;
    line-height: 35px;
    letter-spacing: 0.03em;
    text-align: center;

    box-sizing:border-box;
    cursor:pointer;


    ${props => props.danger && `
        background: #dc3545;
        border-color:#dc3545;
    `}

`;

//box-shadow: -5px -5px 30px 6.64423px rgba(48, 55, 85, 0.12); Agregar esto solo a los botones normales

const OutlinedButton = styled(StandardButton)`
    color: #004FEC; 
    background: white;
    border-width: 2px;
`
const DisabledButton = styled(StandardButton)`
    color: white; 
    background: #BFBFBF;
    cursor:default;
    pointer-events: none;
`



const GhostButton = styled(StandardButton)`
    background-color: transparent;
    border-width:0px; 
    padding:5px 8px;

    font-family: Rokkitt;
    font-size: 27px;
    font-style: normal;
    font-weight: 700;
    line-height: 35px;
    letter-spacing: 0.03em;
    text-align: center;

    box-sizing:border-box;
    width: fit-content;

    color:#666666;
    border-radius:0px;
    ${props => props.primary && `color:#004FEC;`}
    ${props => props.mutted && `color: #BFBFBF;`}
`;

const LoadingPosition = styled.div`
  position: absolute;
  top:0;
  bottom:0;
  right:0;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  width:65px;

`


const LoadingIndicator = ({color="primary"}) => {
  return (
    <LoadingPosition>
      <CircularProgress
        style={{color:color}}
        size={23}
      />
    </LoadingPosition>
  )
}


const DButton = ({ children, outlined, disabled, ghost, loading , ...props }) => {

  let loadingIndicator = null;
  let color = "primary";
  if (loading) {
    if(outlined){
      color = "004FEC";
    } else {
      color = "white";
    }

    loadingIndicator = <LoadingIndicator color={color}/>;
  }

  if (disabled) {
    return (
      <DisabledButton
        {...props}>
        <>
          {children}
          {loadingIndicator}
        </>
      </DisabledButton>
    );
  }
  if (ghost) {
    return (
      <GhostButton
        {...props}>
        <>
          {children}
          {loadingIndicator}
        </>
      </GhostButton>
    )
  }
  if (outlined) {
    return (
      <OutlinedButton
        {...props}>
        <>
          {children}
          {loadingIndicator}
        </>
      </OutlinedButton>
    )
  }

  return (
    <StandardButton
      {...props}>
      {children}
      {loadingIndicator}
    </StandardButton>
  )
}
export default DButton;