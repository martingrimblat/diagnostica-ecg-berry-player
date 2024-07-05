import React, { useRef, useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { CircularProgress, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { getSecondsFromPixels } from "../utils/date";



const TitleWrapper = styled.div`
  align-self: flex-start;
  margin-right: 20px;
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
font-size: 21px;
line-height: 135%;
/* or 28px */

letter-spacing: -0.04em;

/* Azul Casinegro */

color: #000087;
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
  margin: 0px 0px 10px;

  display: flex;
  flex-wrap: wrap;

  flex-direction: column;
  @media (min-width: 480px) {
    flex-direction: row;
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

const FragmentIndicator = styled.div`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 135%;
  /* or 30px */

  letter-spacing: -0.02em;

  /* Amarillo Semáforo */

  color: #FFC04F;
  padding: 0px 10px;
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
  font-size: 27px;
  line-height: 131%;
  /* identical to box height, or 35px */

  text-align: center;
  letter-spacing: 0.03em;

  /* Azul Vibrante */

  color: #004FEC;
  margin-left: 5px;
  cursor: pointer;
`;

const CancelButton = styled.div`
  font-family: 'Rokkitt';
  font-style: normal;
  font-weight: 700;
  font-size: 27px;
  line-height: 131%;
  /* identical to box height, or 35px */

  text-align: center;
  letter-spacing: 0.03em;

  /* Gris Medio */

  color: #BFBFBF;
  cursor: pointer;
  margin-right: 10px;
`;

const TextArea = styled.textarea`
  background: #f2f2f2;
  border-radius: 10.8431px;
  border: none;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  width: '540px';
  line-height: 25px;
  letter-spacing: -0.02em;
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


const NewComment = ({ 
  comment, 
  setCommentEdit, 
  comments, 
  setComments, 
  commentsFilter, 
  setCommentsFilter, 
  dragIndicators,
  handleClose,
  left,
  right,
  isPinReview,
  positionrightLiveToReviewRef,
  inreview,
  leftreview,
 }) => {
  const { t } = useTranslation("global");
  const commentInput = useRef(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  let leftpx
  if (inreview) {
    leftpx =leftreview
  } else {
    if (positionrightLiveToReviewRef && positionrightLiveToReviewRef.current >= 587) {
      leftpx = positionrightLiveToReviewRef.current - 587
    } else {
      leftpx = 0
    }
  }

  const {leftSeconds,rightSeconds} = getSecondsFromPixels(leftpx, 587 , 12.5, isPinReview, positionrightLiveToReviewRef);


  //Para usar estos campos, necesitamos poder escuchar cambios de posicion del reproductor.
  //El nativo por alguna causa no ejecuta el handler en firefox, por eso momentaneamente mostramos
  //la fecha del comnetario
  // const [from, setFrom] = useState("00:00");
  // const [to, setTo] = useState("00:10");
  const [from, setFrom] = useState(leftSeconds);
  const [to, setTo] = useState(rightSeconds);

  const [content, setContent] = useState(comment.content || '');
  // const { loading } = useCommentsStore();
  const loading = false;

  const fullName = sessionStorage.getItem("userName");

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
        from: leftpx,
        fromSeconds: leftSeconds,
        to: right,
        toSeconds: rightSeconds,
        ecg: new Date(Date.now()).getTime(),
        _id: new Date(Date.now()).getTime(),
        content: content,
        author: fullName
      }]);
      
      setCommentsFilter([...commentsFilter, {
        from: left,
        fromSeconds: leftSeconds,
        to: right,
        toSeconds: rightSeconds,
        ecg: new Date(Date.now()).getTime(),
        _id: new Date(Date.now()).getTime(),
        content: content,
        author: fullName
      }]);
      
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
      console.log("Error, reintentar");
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
    <Wrapper>
      {!loading && (
        <>
          <FormWrapper>
            <Row>
            <FragmentWrapper>
              <TitleWrapper>
                  <Title color='#000087'>
                    {t("commentsSection.comments")}
                  </Title>
              </TitleWrapper>
              <FragmentIndicator>
                {from}/{to}
              </FragmentIndicator>
            </FragmentWrapper>
              <TextArea 
                onChange={(ev) => setContent(ev.target.value)}
                autoFocus={false}
                onKeyDown={handleKeyDown}
                value={content}
                placeholder={t("addCommentDialog.placeholder")} 
                style={{
                  letterSpacing: '-0.04em',
                  width: '540px'
                }}
              />
            </Row>
            <Row
              style={{
                justifyContent: "flex-end",
                margin: "6px 0px",
              }}
            >
              <CancelButton onClick={clear}>
                {t("addCommentDialog.cancel")}
              </CancelButton>
              <CommentButton
                color="#004FEC"
                onClick={handleComment}
              >
                {t("addCommentDialog.comment")}
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
