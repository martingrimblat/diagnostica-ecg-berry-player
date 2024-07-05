import styled from "styled-components";

export const Range = styled.input`
height: 20px;
width: 116px;
margin-right: 8px;
margin-left: 8px;
appearance: none;
cursor: pointer;
::-webkit-slider-runnable-track {
  height: 4px;
  width: 100%;
  cursor: pointer;
  pointer-events: none;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background-color: #fff;
  border-radius: 2px;
}
&:focus {
  outline: none;
}
::-webkit-slider-thumb {
  appearance: none;
  background: #FFC04F;
  margin-top: -8px;

  width: 0px;
  height: 22px;

  border: 4px solid #FFC04F;
}
`;

