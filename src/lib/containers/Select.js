import { useState } from "react";
import styled from "styled-components";
import arrowdown from "../../assets/images/arrowdown.svg";
import arrowup from "../../assets/images/arrowup.svg";

const Title = styled.div`
  position: absolute;
  width: 173px;
  height: 26px;
  left: -30%;
  top: 25%;

  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 115%;
  display: flex;
  align-items: center;
  letter-spacing: -0.03em;
  color: #666666;
`;

const Wraper = styled.div`
${(props) => props.isOpen ? `left: 51%;` : `left: 49%;`}
position: absolute;
  top: 53%;
  margin: 10px;

  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: #666666;

  box-sizing: border-box;
  background: #f2f2f2;
  border-radius: 10.8431px;
  width: 201px;
  height: 54px;
`;

const Header = styled.div`
  position: absolute;
  left: 10%;
  top: 25%;
  width: 100%;
  height: 100%;
`;

const ListWrapper = styled.div`
  position: absolute;
  top: 70%;
  box-sizing: border-box;
  background: #f1f1f1;
  border-radius: 10.8431px;
  width: 201px;
  z-index: 10;
`;
const List = styled.ul``;
const ListItem = styled.li`
  list-style: none;
  margin-bottom: 0.8em;
`;

const Select = ({ title, list, itemHandler, handlePause }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => {
    setIsOpen(!isOpen);
    handlePause();
  };

  let img = !isOpen ? arrowdown : arrowup;

  const [option, setOption] = useState(list[1].name);
  let i = 0;
  return (
    <Wraper title={title} isOpen={isOpen}>
      <Title>{title}</Title>
      <Header onClick={toggling}>
        {option}
        <img
          src={img}
          style={{
            position: "absolute",
            top: "20%",
            left: "70%",
          }}
        ></img>
      </Header>
      {isOpen && (
        <ListWrapper>
          <List 
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            paddingLeft: '40px'
          }}
          >
            {list.map((item) => {
              let name = item.name;
              let number = i;
              i++;
              return (
                <ListItem
                  key={number}
                  onClick={() => {
                    itemHandler(number);
                    setOption(name.toString());
                    setIsOpen(!isOpen);
                  }}
                >
                  {name}
                </ListItem>
              );
            })}
          </List>
        </ListWrapper>
      )}
    </Wraper>
  );
};

export default Select;
