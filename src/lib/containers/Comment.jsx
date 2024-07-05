import React from 'react';

import styled from 'styled-components';

import { useTranslation } from "react-i18next";
import DButton from 'components/buttons/DButton';

const Column = styled.div`
    display:flex;
    flex-direction:column;
`;

const Wrapper = styled.div`
    background-color:white;
    padding:5px;
    flex-wrap:wrap;
    
    display:flex;
    flex-direction:column;
    @media (min-width: 480px) {
        flex-direction:row;
    }
`;
const FragmentWrapper = styled(Column)`
  display: -webkit-flex;
  display: -ms-flexbox;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  min-width: 92px;
  padding: 0px 10px 0px 0px;
  -ms-flex-align: end;
  align-items: center;
  vertical-align: middle;
  height: 37px;
`;

const ContentWrapper = styled(Column)`
  flex:5;
`;

const FragmentIndicator = styled.div`
    text-align: left;
    color: #FFC04F;
    margin-right: 20px;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 22px;
    line-height: 135%;
    float: left;
    -webkit-letter-spacing: -0.02em;
    -moz-letter-spacing: -0.02em;
    -ms-letter-spacing: -0.02em;
    letter-spacing: -0.02em;
    
`;



const Author = styled.div`
    margin: 2px;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 135%;
    letter-spacing: -0.04em;
    color: #BFBFBF;
`;

const Content = styled.div`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 23px;
    line-height: 135%;
    letter-spacing: -0.04em;
    color: #717377;
`;


const Comment = ({ 
  comment, 
  count,
  setCommentEdit, 
  handleDeleteComment,
  handleFocusMarginsEcg,
  handleClose
}) => {
  const { fromSeconds, toSeconds, from, to, author, content, _id } = comment;

  const { t } = useTranslation("global");

  const handleEdit = () => {
    setCommentEdit({id:_id,content});
  }

  return (
      <div 
      style={{
        marginBottom: '25px',
        minWidth: '300px'
      }}>
        <Wrapper >
          <FragmentWrapper >
            <FragmentIndicator>
              <span
              style={{
                color: "#BFBFBF",
                marginRight: "10px"
              }}>
                {`#${count}`}
              </span>{fromSeconds}/{toSeconds}
            </FragmentIndicator>
            <div style={{
              float: 'left'
            }}>
              <DButton key={_id} outlined onClick={()=> {
                handleClose();
                handleFocusMarginsEcg(from);
              }}
                style={{
                  padding: "0px 5px",
                  boxSizing: "border-box",
                  width: "200px",
                  height: "32px",
                  background: "#FFFFFF",
                  border: "1px solid #004FE",
                  borderRadius: "33.242px",
                  fontFamily: 'Rokkitt',
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontSize: "25px",
                  lineHeight: "131%",
                  letterSpacing: "0.03em",
                  color: "#004FEC",
                  left: "20%"
                }}
                >
              {t("ecg.focus")}
              </DButton>
            </div>
          </FragmentWrapper>




          {/* <Button key={comment._id} onClick={()=> handleDeleteComment(comment._id)}>
            <FontAwesomeIcon
            style={{
              margin: "0px 5px"
            }}
            icon={faTrash}
            />  
          </Button>  */}

        </Wrapper>
          <div>
            <Author>{author}</Author>
          </div>
          <div>
            <Content>{content}</Content>
          </div>
      </div>
  )
}



export default Comment;