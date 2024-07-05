import React from 'react';
import { useTranslation } from 'react-i18next';

import styled from 'styled-components';

import DButton from './buttons/DButton';


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
    line-height: 135%;
    float: left;
    -webkit-letter-spacing: -0.02em;
    -moz-letter-spacing: -0.02em;
    -ms-letter-spacing: -0.02em;
    letter-spacing: -0.02em;
    ${({repository})=> (repository === 'frontDiagnostica') && 
    `
    font-size: 15px;
    `
    || (repository === 'frontMulti') && 
      `
      font-size: 22px;
      `
    }
`;



const Author = styled.div`
    margin: 2px;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    line-height: 135%;
    letter-spacing: -0.04em;
    color: #BFBFBF;
    ${({repository})=> (repository === 'frontDiagnostica') && 
    `
    font-size: 14px;
    `
    || (repository === 'frontMulti') && 
      `
      font-size: 20px;
      `
    }
`;

const Content = styled.div`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    line-height: 135%;
    letter-spacing: -0.04em;
    color: #717377;
    ${({repository})=> (repository === 'frontDiagnostica') && 
    `
    font-size: 17px;
    `
    || (repository === 'frontMulti') && 
      `
      font-size: 23px;
      `
    }
`;

const StyledDButton = styled(DButton)`
  padding: 0px 5px;
  boxSizing: border-box;
  height: 32px;
  background: #FFFFFF;
  border: 1px solid #004FE;
  borderRadius: 33.242px;
  fontFamily: Rokkitt;
  fontStyle: normal;
  fontWeight: 700;
  lineHeight: 131%;
  letterSpacing: 0.03em;
  color: #004FEC;
  ${({repository})=> (repository === 'frontDiagnostica') && 
  `
  font-size: 19px;
  `
  || (repository === 'frontMulti') && 
  `
  font-size: 25px;
  `
}
${({widthOfEcgPanel})=> (widthOfEcgPanel === 580) ? 
`
left: 20%;
width: 200px;
`
:
`
left: 0%;
width: 150px;
    `
  }
`;


const Comment = ({ 
  comment, 
  count,
  setCommentEdit, 
  handleDeleteComment,
  handleFocusMarginsEcg,
  handleClose,
  left,
  right,
  repository,
  widthOfEcgPanel
}) => {
  const { fromSeconds, toSeconds, from, to, author, content, _id } = comment;
  const date = new Date(comment.date);

  const { t } = useTranslation("global");

  const handleEdit = () => {
    setCommentEdit({id:_id,content});
  }

  return (
      <div 
      style={{
        marginBottom: '25px',
        minWidth: (widthOfEcgPanel == 580)?'300px':'200px'
      }}>
        <Wrapper >
          <FragmentWrapper >
            <FragmentIndicator repository={repository}>
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
              <StyledDButton 
              key={_id}
              repository={repository}
              widthOfEcgPanel={widthOfEcgPanel}
              outlined
              onClick={()=> {
                handleClose();
                handleFocusMarginsEcg(from,to);
              }}
              >
                {t("listComments.focus")}
              </StyledDButton>
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
            <Author repository={repository}>{author}</Author>
          </div>
          <div>
            <Content repository={repository}>{content}</Content>
          </div>
      </div>
  )
}



export default Comment;