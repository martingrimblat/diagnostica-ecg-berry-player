import React from 'react';

import { Dialog} from "@material-ui/core";
import Close from "../assets/images/close.svg";

import {
  DialogContent,
  DialogBody,
  CloseContainer,
  CloseIcon,
  DialogTitle
} from "../assets/styled";

import { useEffect } from 'react';

import { useTranslation } from "react-i18next";

import '../styles.css';
import CommentsSection from '../containers/CommentsSection';



const record = {
  _id: new Date(Date.now()).getTime()
}


const AddCommentDialog = ({ 
  open, 
  loading, 
  handleConfirm, 
  handleClose, 
  msg = true, 
  dragIndicators, 
  comments, 
  setComments, 
  viewlistcomments,
  handleFocusMarginsEcg,
  left,
  right,
  isPinReview=true,
  positionrightLiveToReviewRef,
  leftreview,
  inreview
}) => {

  const { t } = useTranslation("global");



  
  // console.log('{JSON.stringify(viewlistcomments)}',viewlistcomments);

  // console.log('dragIndicators',dragIndicators);

  

  return (
    <Dialog
      BackdropProps={{
        style: {
          backgroundColor:'rgba(0,0,0,0)'    
        }
      }}
      PaperProps={{
        style: {
          // marginLeft: !viewlistcomments ? "-16%" : "-20%",
          // marginTop: !viewlistcomments ? "-19%" : "-4%",
          boxSizing: 'unset',
          borderRadius: "24px",
          height: "auto",
          maxWidth: !viewlistcomments ? "850px" : "750px",
          boxSizing: "unset",
          width: "793px",
          position: "absolute",
          left: "19%",
          top: "15%"
        }

      }}
      onClose={handleClose}
      open={open}
    >
      <DialogContent
        style={{
          margin: "10px 10px",
          position: "initial"
        }}
      >
        <CloseContainer onClick={handleClose}>
          <CloseIcon src={Close} alt="close" />
        </CloseContainer>
        {viewlistcomments && 
          <DialogTitle 
          color='#000087'
          style={{
            fontSize: '22px',
            fontFamily: 'Montserrat',
            fontStyle: 'normal',
            fontWeight: 600,
            letterSpacing: '-0.04em',
            color: '#000087',
            marginLeft: '2%'
          }}
          >{t("ecg.list")}</DialogTitle>
        }
        {msg && 
        <DialogBody
        style={{
          marginBottom: !viewlistcomments ? "0px" : "17px",
        }}>
          <CommentsSection 
            record={record} 
            dragIndicators={dragIndicators}
            comments={comments}
            setComments={setComments}
            viewlistcomments={viewlistcomments}
            handleFocusMarginsEcg={handleFocusMarginsEcg}
            handleClose={handleClose}
            left={left}
            right={right}
            isPinReview={isPinReview}
            positionrightLiveToReviewRef={positionrightLiveToReviewRef}
            inreview={inreview}
            leftreview={leftreview}
            >
            </CommentsSection>
        </DialogBody>}
      </DialogContent>
    </Dialog>
  )
}
export default AddCommentDialog;

