import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";

import { CircularProgress } from "@material-ui/core";

import { useTranslation } from "react-i18next";

import NewComment from "./NewComment";
import Comment from "./Comment";
import { getSecondsFromPixels } from "../utils/date";


const Wrapper = styled.div`
  width: 100%;
  margin-top: 15px;
  display: flex;

  flex-wrap: wrap;
  align-items: flex-start;
  padding: 5px;
  background-color: white;

  flex-direction: column;
  @media (min-width: 770px) {
    flex-direction: row;
  }
`;


const ListWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
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
  font-size: 15px;
  color: #666666;
`;

const CommentsSection = ({ 
    record, 
    dragIndicators, 
    comments, 
    setComments, 
    viewlistcomments, 
    handleFocusMarginsEcg,
    handleClose,
    left,
    right,
    isPinReview,
    positionrightLiveToReviewRef,
    inreview,
    leftreview
  }) => {
  const { t } = useTranslation("global");


  const [commentsFilter, setCommentsFilter] = useState([]);
  const [commentEdit, setCommentEdit] = useState({id:null,content:''});

  const loadingComments = false;

  const noComments = !loadingComments && comments && comments.length === 0;

  useEffect(() => {

    //persisto los comentarios en localstorage para que cuando obtenga el 
    //recordId del estudio se los manden al back
    // localStorage.setItem('comments_ecg', JSON.stringify( comments ) );
    
    // const commentsFilter = comments.filter((c)=>
    //   (
    //     c.from === dragIndicators.left && c.to === dragIndicators.right
    //   )
    // );
    
    const updatesComments = comments.map((comment)=> {
      const {leftSeconds,rightSeconds} = getSecondsFromPixels(Number(comment.from), 587 , 12.5, isPinReview, positionrightLiveToReviewRef);
      
      return {...comment, fromSeconds: leftSeconds, toSeconds: rightSeconds};
      
    })

    setCommentsFilter(updatesComments);

  }, [comments]);

  const handleDeleteComment = async (commentId) => {

    // console.log('deleteCommentId',commentId);

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
    <Wrapper>
      <ListWrapper
        style={{
          height: (!noComments && viewlistcomments) ? '390px': 'auto'
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
            left={left}
            right={right}
            isPinReview={isPinReview}
            positionrightLiveToReviewRef={positionrightLiveToReviewRef}
            leftreview={leftreview}
            inreview={inreview}
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
                />
              );
            })}

        {noComments && viewlistcomments && (
          <NoCommentsIndicator>
            {t("commentsSection.not_comments")}
          </NoCommentsIndicator>
        )}
      </ListWrapper>
    </Wrapper>
  );
};
export default CommentsSection;
