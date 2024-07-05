import React from 'react';

import { Dialog } from "@material-ui/core";
import Close from "../../../assets/images/close.svg";

import {
  DialogContent,
  DialogBody,
  CloseContainer,
  CloseIcon,
  DialogTitle
} from "./styled";

import CommentsSection from '../CommentsSection';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';


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
  fullNameUser,
  left,
  right,
  addComment,
  repository,
  widthOfEcgPanel
}) => {

const { t } = useTranslation("global");



  return (
    <Dialog
      container={() => document.querySelector('#containerplayer-button-panel-panel')}
      BackdropProps={{
        style: {
          backgroundColor:'rgba(0,0,0,0)',
          position: 'relative'  
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
          width: (widthOfEcgPanel == 580) ?`${widthOfEcgPanel - 100}px`:`${widthOfEcgPanel - 50}px`,
          position: "relative",
          left: 1000,
          top: -150
        }

      }}
      onClose={handleClose}
      open={open}
    >
      <DialogContent
        style={{
          margin: "10px 12px 10px 10px"
        }}
      >
        <CloseContainer onClick={handleClose}>
          <CloseIcon src={Close} alt="close" />
        </CloseContainer>
        {viewlistcomments && 
          <DialogTitle repository={repository}>{t("listComments.title")}</DialogTitle>
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
            fullNameUser={fullNameUser}
            left={left}
            right={right}
            addComment={addComment}
            repository={repository}
            widthOfEcgPanel={widthOfEcgPanel}
            >
            </CommentsSection>
        </DialogBody>}
      </DialogContent>
    </Dialog>
  )
}
export default AddCommentDialog;

