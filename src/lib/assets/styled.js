import styled from "styled-components";

export const DialogContent = styled.div`
  position: relative;
  margin: 60px 46px 48px 46px;
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background-color: #f2f2f2;
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`;

export const DialogTitle = styled.div`
  font-family: Montserrat;
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 43px;
  letter-spacing: -0.04em;
  text-align: left;
  ${(props) => props.color && `color: ${props.color}`};
`;

export const DialogBody = styled.div`
  font-family: Montserrat;
  font-size: 23px;
  font-style: normal;
  font-weight: 500;
  line-height: 40px;
  letter-spacing: -0.02em;
  text-align: left;
  color: #666666;

  margin-top: 17px;
  margin-bottom: 17px;
  padding: 3px;
  min-height: 71px;
`;

export const CloseContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 40px;
  cursor: pointer;
`;
export const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
`;
export const DialogFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${(props) => props.justify && `justify-content:${props.justify};`}
`;

export const Label = styled.div`
  font-family: Montserrat;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 115%;
  letter-spacing: -0.03em;
  text-align: left;
  color: #666666;
  margin-bottom: 10px;
`;

export const TextArea = styled.textarea`
  width: 562px;
  height: 141px;
  background: #f2f2f2;
  border-radius: 10.8431px;
  border: none;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 25px;
  letter-spacing: -0.02em;
  color: #bfbfbf;
  padding-left: 20px;
  padding-top: 15px;
  ::placeholder {
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 22px;
    line-height: 25px;
    letter-spacing: -0.02em;
    color: #bfbfbf;
  }
  &:focus {
    outline: none;
    box-shadow: 0px 0px 2px #000;
  }
`;
