import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { CircularProgress } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { getSecondsFromPixels, sToMMSS } from "./utils/date";


const TitleWrapper = styled.div`
  align-self: flex-start;
  ${({widthOfEcgPanel})=> (widthOfEcgPanel == 580) && 
  `
  margin-right: 20px;
  `
  }
  padding: 5px;
  box-sizing: border-box;
  @media (min-width: 480px) {
    padding: 10px;
  }
`;


const Title = styled.div`
  font-family: 'Montserrat';
font-style: normal;
font-weight: 600;
line-height: 135%;
letter-spacing: -0.04em;
color: #000087;
${({widthOfEcgPanel})=> (widthOfEcgPanel) && 
`
white-space: nowrap;
overflow: hidden;
text-overflow: clip;
`
}
${({repository})=> (repository === 'frontDiagnostica') && 
`
font-size: 15px;
`
|| (repository === 'frontMulti') && 
  `
  font-size: 21px;
  `
}
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Wrapper = styled.div`
  background-color: white;
  padding: 5px;
  display: flex;
  flex-wrap: wrap;

  flex-direction: column;
  @media (min-width: 480px) {
    flex-direction: row;
  }
  ${({repository})=> (repository === 'frontDiagnostica') && 
    `
    margin: 0px 0px 0px;
    `
  || (repository === 'frontMulti') && 
    `
    margin: 0px 0px 10px;
    `
  }
`;
const FragmentWrapper = styled(Column)`
  display: flex;
  flex-direction: column;
  min-width: 90px;
  padding: 0px 15px;
`;
const FormWrapper = styled(Column)`
  flex: 5;
`;

const FragmentIndicator = styled.span`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  line-height: 135%;
  letter-spacing: -0.02em;
  color: #FFC04F;
  padding: 0px 10px;
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

const FragmentTitle = styled.span`

  ${({widthOfEcgPanel})=> (widthOfEcgPanel) && 
  `
  width: 15px;
  `
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 10px;
`;

const inputStyle = {
  fontFamily: "Montserrat",
  fontSize: "15px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "20px",
  letterSpacing: "-0.04em",
  textAlign: "left",
  color: "#666666",
};

const CommentButton = styled.div`
  font-family: 'Rokkitt';
  font-style: normal;
  font-weight: 700;

  line-height: 131%;
  /* identical to box height, or 35px */

  text-align: center;
  letter-spacing: 0.03em;

  /* Azul Vibrante */

  color: #004FEC;
  margin-left: 5px;
  cursor: pointer;
  ${({repository})=> (repository === 'frontDiagnostica') && 
  `
  font-size: 16px;
  `
  || (repository === 'frontMulti') && 
    `
    font-size: 27px;
    `
  }
`;

const CancelButton = styled.div`
  font-family: 'Rokkitt';
  font-style: normal;
  font-weight: 700;
  line-height: 131%;
  /* identical to box height, or 35px */

  text-align: center;
  letter-spacing: 0.03em;

  /* Gris Medio */

  color: #BFBFBF;
  cursor: pointer;
  margin-right: 10px;
  ${({repository})=> (repository === 'frontDiagnostica') && 
  `
  font-size: 16px;
  `
  || (repository === 'frontMulti') && 
    `
    font-size: 27px;
    `
  }
`;

const TextArea = styled.textarea`
  background: #f2f2f2;
  border-radius: 10.8431px;
  border: none;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  line-height: 25px;
  padding-left: 20px;
  padding-top: 15px;
  letter-spacing: -0.04em;
  ${({widthOfEcgPanel})=>(widthOfEcgPanel) && `
    width: ${widthOfEcgPanel}px;
  `}
  ${({repository})=> (repository === 'frontDiagnostica') && 
  `::placeholder {
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 25px;
    letter-spacing: -0.02em;
    color: #bfbfbf;
  }
  font-size: 15px;
  `
  || (repository === 'frontMulti') && 
    `::placeholder {
      font-family: Montserrat;
      font-style: normal;
      font-weight: 500;
      font-size: 22px;
      line-height: 25px;
      letter-spacing: -0.02em;
      color: #bfbfbf;
    }
    font-size: 22px;
    `
  }
  &:focus {
    outline: none;
    box-shadow: 0px 0px 2px #000;
  }
`;


const NewComment = ({ 
  comment, 
  setCommentEdit, 
  comments, 
  setComments, 
  commentsFilter, 
  setCommentsFilter, 
  dragIndicators,
  handleClose,
  fullNameUser,
  left,
  right,
  addComment,
  repository,
  widthOfEcgPanel
 }) => {

  const { t } = useTranslation("global"); 

  const [currentDate, setCurrentDate] = useState(new Date());

  const {leftSeconds, rightSeconds} = getSecondsFromPixels(left, right);
  //la fecha del comnetario
  // const [from, setFrom] = useState("00:00");
  // const [to, setTo] = useState("00:10");
  const [from, setFrom] = useState(leftSeconds);
  const [to, setTo] = useState(rightSeconds);

  const [content, setContent] = useState(comment.content || '');
  // const { loading } = useCommentsStore();
  const loading = false;

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setContent(comment.content);

  }, [comment]);

  const clear = () => {
    setContent(comment.content);
    handleClose();
  };


  const handleComment = async () => {
    if (content.trim().length === 0) {
      return;
    }

    const success = true;
    // const center = Math.round((dragIndicators.right-dragIndicators.left)/2);

    //si no tiene id es un nuevo comentario sino una edicion
    if(!comment.id){
      
      setComments([...comments, {
        from: left,
        fromSeconds: leftSeconds,
        to: right,
        toSeconds: rightSeconds,
        ecg: new Date(Date.now()).getTime(),
        _id: new Date(Date.now()).getTime(),
        content: content,
        author: fullNameUser,
        source: 'ecgplayer'
      }]);
      
      setCommentsFilter([...commentsFilter, {
        from: left,
        fromSeconds: leftSeconds,
        to: right,
        toSeconds: rightSeconds,
        ecg: new Date(Date.now()).getTime(),
        _id: new Date(Date.now()).getTime(),
        content: content,
        author: fullNameUser,
        source: 'ecgplayer'
      }]);

      // almacenar el comentario en la base de datos
      addComment({
        from: left,
        fromSeconds: leftSeconds,
        to: right,
        toSeconds: rightSeconds,
        ecg: new Date(Date.now()).getTime(),
        _id: new Date(Date.now()).getTime(),
        content: content,
        author: fullNameUser,
        source: 'ecgplayer'
      });

      
    }else{
      
      //modifico el comentario seleccionado
      const updatedComments = comments.map(
        com => {

          const {_id, from, fromSeconds, to, toSeconds, author, ecg} = com;

          const updatedComment = _id === comment.id ? 
                        {
                          from,
                          fromSeconds,
                          to,
                          toSeconds,
                          ecg,
                          _id,
                          content: content,
                          author
                        } 
                      : com;

            return updatedComment;
            }
        );

        setComments(updatedComments);

      const updatedCommentsFilter = commentsFilter.map(
          com => {
                  const {_id, from, fromSeconds, to, toSeconds, author, ecg} = com;

                  const updatedComment = _id === comment.id ? 
                                {
                                  from,
                                  fromSeconds,
                                  to,
                                  toSeconds,
                                  ecg,
                                  _id,
                                  content: content,
                                  author
                                } 
                              : com;
                    return updatedComment;
                    }
        );

        setCommentsFilter(updatedCommentsFilter);

        setCommentEdit({id:null,content:''});

    }

    handleClose();
  
    if (success) {
      setContent("");
    } else {
      console.log("informar sobre error y pedirle que reintente");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (content.trim().length > 0) {
        handleComment();
      }
    }
  };

  return (
    <Wrapper repository={repository}>
      {!loading && (
        <>
          <FormWrapper>
            <Row>
            <FragmentWrapper>
              <TitleWrapper widthOfEcgPanel={widthOfEcgPanel}>
                  <Title repository={repository} widthOfEcgPanel={widthOfEcgPanel}>
                  <FragmentTitle widthOfEcgPanel={widthOfEcgPanel}>
                    {t("addCommentDialog.title")}
                  </FragmentTitle>
                <FragmentIndicator repository={repository}>
                  {from}/{to}
                </FragmentIndicator>
                  </Title>
              </TitleWrapper>
              <TextArea 
                onChange={(ev) => setContent(ev.target.value)}
                autoFocus={false}
                onKeyDown={handleKeyDown}
                value={content}
                placeholder={t("addCommentDialog.placeholder")}
                repository={repository}
                widthOfEcgPanel={Math.round(widthOfEcgPanel*0.6)}
                />
            </FragmentWrapper>
            </Row>
            <Row
              style={{
                justifyContent: "flex-end",
                margin: "6px 15px",
              }}
            >
              <CancelButton 
              repository={repository}
              onClick={clear}
              >
              {t("addCommentDialog.option1")}
              </CancelButton>
              <CommentButton
                repository={repository}
                onClick={handleComment}
              >
                {t("addCommentDialog.option2")}
              </CommentButton>
            </Row>
          </FormWrapper>
        </>
      )}

      {loading && (
        <LoaderWrapper>
          <CircularProgress size="2rem" color="secondary" />
        </LoaderWrapper>
      )}
    </Wrapper>
  );
};
export default NewComment;
