import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";

import { CircularProgress } from "@material-ui/core";

import NewComment from "./NewComment";
import { useTranslation } from "react-i18next";


const Wrapper = styled.div`
  width: 100%;
  display: flex;

  flex-wrap: wrap;
  align-items: flex-start;
  padding: 5px;
  background-color: white;

  flex-direction: column;
  @media (min-width: 770px) {
    flex-direction: row;
  }
  ${({repository})=> (repository === 'frontDiagnostica') && 
    `
    margin-top: 0px;
    `
  || (repository === 'frontMulti') && 
    `
    margin-top: 15px;
    `
  }
`;


const ListWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  height: 390px;
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background-color: #fff;
  }
  
  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
  ${({widthOfEcgPanel})=> (widthOfEcgPanel == 580) && 
  `
  width: 100%;
  `
}
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 10px;
`;
const NoCommentsIndicator = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: Montserrat;
  font-weight: 500;
  color: #666666;
  ${({repository})=> (repository === 'frontDiagnostica') && 
  `
  font-size: 12px;
  `
|| (repository === 'frontMulti') && 
  `
  font-size: 15px;
  `
}
`;

const CommentsSection = ({ 
    record, 
    dragIndicators, 
    comments, 
    setComments, 
    viewlistcomments, 
    handleFocusMarginsEcg,
    handleClose,
    fullNameUser,
    left,
    right,
    addComment,
    repository,
    widthOfEcgPanel
  }) => {

  const { t } = useTranslation("global");

  const [commentsFilter, setCommentsFilter] = useState([]);
  const [commentEdit, setCommentEdit] = useState({id:null,content:''});

  const loadingComments = false;

  const noComments = !loadingComments && comments && comments.length === 0;

  useEffect(() => {

    //persisto los comentarios en localstorage para que cuando obtenga el 
    //recordId del estudio se los manden al back
    localStorage.setItem('comments_ecg', JSON.stringify( comments ) );

    // console.log('comentarios', comments);
    
    // const commentsFilter = comments.filter((c)=>
    //   (
    //     c.from === dragIndicators.left && c.to === dragIndicators.right
    //   )
    // );

    setCommentsFilter(comments);

  }, [comments]);

  const handleDeleteComment = async (commentId) => {

    console.log('deleteCommentId',commentId);

    const commentsNotDeleted = comments.filter((c)=>
      (
        c._id !== commentId 
      )
    );

    setComments(commentsNotDeleted);

    const commentsFilterNotDeleted = commentsFilter.filter((c)=>
      (
        c._id !== commentId 
      )
    );

    setCommentsFilter(commentsFilterNotDeleted);

  }

  let count = 0;

 

  return (
    <Wrapper repository={repository} widthOfEcgPanel={widthOfEcgPanel}>

      <ListWrapper
        widthOfEcgPanel={widthOfEcgPanel}
        style={{
          height: (!noComments && viewlistcomments) ? '215px': 'auto'
        }}
      >
        {loadingComments && (
          <LoaderWrapper>
            <CircularProgress size="3rem" color="secondary" />
          </LoaderWrapper>
        )}

        {/* {JSON.stringify(commentEdit)} */}

        {!viewlistcomments && 
          <NewComment 
            recordId={record && record._id}
            comment={commentEdit}
            setCommentEdit={setCommentEdit}
            comments={comments}
            setComments={setComments}
            commentsFilter={commentsFilter}
            setCommentsFilter={setCommentsFilter}
            dragIndicators={dragIndicators}
            handleClose={handleClose}
            fullNameUser={fullNameUser}
            left={left}
            right={right}
            addComment={addComment}
            repository={repository}
            widthOfEcgPanel={widthOfEcgPanel}
          />
        }




        {!loadingComments &&
          commentsFilter &&
          viewlistcomments &&
          commentsFilter
            .sort((c1, c2) => new Date(c1.date) < new Date(c2.date))
            .map((comment) => {
              count++;
              return (
                <Comment 
                  key={comment._id} 
                  count={count}
                  comment={comment} 
                  setCommentEdit={setCommentEdit}
                  handleDeleteComment={handleDeleteComment}
                  handleFocusMarginsEcg={handleFocusMarginsEcg}
                  handleClose={handleClose}
                  left={left}
                  right={right}
                  repository={repository}
                  widthOfEcgPanel={widthOfEcgPanel}
                />
              );
            })}

        {noComments && viewlistcomments && (
          <NoCommentsIndicator repository={repository}>
            {t("listComments.no_comments")} 
          </NoCommentsIndicator>
        )}
      </ListWrapper>
    </Wrapper>
  );
};
export default CommentsSection;
