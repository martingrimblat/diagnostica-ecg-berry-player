import React, {useEffect, useRef, useState} from 'react'
import styled, { css, keyframes } from "styled-components";
import {ECGWave} from './ECGWave'
import EcgNavigator from './ECGNavigator'
import { useDrawDerivations } from '../hooks/useDrawEcg'
import { useDrawDerivationsPlayer } from '../hooks/useDrawEcgPlayer'
import EcgNavigatorPlayer from './ECGNavigatorPlayer'
import { ButtonAdd } from '../buttons/ButtonAdd'
import { Flex } from '../containers/Flex'
import { getSecondsFromPixels } from '../utils/date'
import AddCommentDialog from './commentsPlayer/dialogs/AddCommentDialog';
import { useComments } from '../hooks/useComments'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faEye } from "@fortawesome/free-solid-svg-icons";
// traducciones
import global_es from "../translations/es/global.json";
import global_pt from "../translations/pt/global.json";

import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";


i18next.use(LanguageDetector).init({
  detection: {
    // order and from where user language should be detected
    order: ["querystring", "localStorage", "sessionStorage", "navigator"],
    // keys or params to lookup language from
    lookupQuerystring: "lng",
    lookupLocalStorage: "language",
    lookupSessionStorage: "",
  },
  interpolation: { escapeValue: false },
  fallbackLng: "es",
  resources: {
    es: {
      global: global_es,
    },
    pt: {
      global: global_pt,
    },
  },
});

export const WrapperGrid = styled.div`
  display: grid;
  background-color: #fff;
  margin-top: 25px;
`
export const BoxGrid = styled.div`
  border-radius: 5px;
  padding: 5px;
  font-size: 150%;
  margin-top: 50px;
`
const ECGWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const ECGButton = styled.button`
    position: relative;
    bottom: 300px;
    color: white;
    background: #004FEC;
    border-color:#004FEC;
    border-width: 0px;
    border-radius: 50px;

    font-family: Rokkitt;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-align: center;
    
    box-sizing:border-box;
    cursor:pointer;
    borderRadius: 50%;
    
    ${({repository})=> (repository === 'frontDiagnostica') && 
      `
      line-height: 20px;
      padding: 7px 8px;
      font-size: 22px;
      `
    || (repository === 'frontMulti') && 
      `line-height: 35px;
      padding: 11px 13px;
      font-size: 27px;
      `
    }

`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    color: #FFFF;
    ${({repository})=> (repository === 'frontDiagnostica') && 
    `margin: 0px 1px;
    font-size: 15px`
    || (repository === 'frontMulti') && 
    `margin: 0px 5px;
    font-size: 18px;
    `
  }
`;
const ECGPanelPlayer = ({
  stage,
  setStage,
  pauseRecord,
  setInreview,
  height,
  width=990,
  isPinReview,
  live,
  minWidth=587, //TODO arreglar esto, tiene que ser el ancho del viewport
  setRight,
  setLeft,
  left,
  right,
  minWidthReview,
  withoutdata,
  widthCanvasMiniature=0, // TODO borrar esto, no se usa en ningun lado
  setWidthCanvasMiniature,// TODO borrar esto, no se usa en ningun lado
  // auxiliarDraw,
  // auxiliarDrawLive,
  // auxiliarDrawScroll,
  stopmoveviewport,
  setStopmoveviewport,
  pauseGraffics,
  positionsReview,
  positionsReviewScroll,
  positionsRefViewport,
  offsetRefViewport,
  leftArrow,
  setLeftArrow,
  setRightArrow,
  rightArrow,
  indicatorsRef,
  // gototheEnd,
  positionrightLiveToReviewRef,
  positionLeftIsPinReview,
  setIsPinReview,
  setIsPin,
  leftreview,
  setLeftreview,
  // sendIndexsNavigations,
  timer,
  setTimer,
  viewportRefReview,
  viewportRef,
  displayersRef,
  inreview,
  withoutDataDivRef,
  datasetRefViewer,
  helpersRef,
  onData,
  repository,
  fullNameUser= 'Doctor1',
  addComment,
  lastMarginRightDB = 1706,
  commentsDB,
  }
) => {

  const minWidthViewport = 250 // TODO revisar estas dos cons pueden tener que ser ajustadas
  const widthOfEcgDiiMiniature = 500
  const intervalReviewRef = useRef()
  const [lastIndex, setLastIndex] = useState(0)
  const [comments, setComments] = useState([])
  const offsetRefViewportPlayer = useRef(0);
  console.log('dataset',datasetRefViewer.current)
  const gototheEnd = () => {
    setStopmoveviewport(false);
    setInreview(false);
    setRightArrow(false);

    if(positionrightLiveToReviewRef.current > 990)
      setLeftArrow(true);
    else
      setLeftArrow(false);
  }

  // inicializo el hook para dibujar las derivaciones
  const { 
    play,
    stop,
    initialize,
    finalize,
    drawViewportFragment,
    drawViewportMiniature
  } = useDrawDerivationsPlayer (
    datasetRefViewer,
    displayersRef,
  )

  
  
  // guardo las funciones de dibujo en helpersRef para poder utilizarlas desde la app
  useEffect(() => {
    if (!helpersRef) return;
    helpersRef.current = {
      play,
      stop,
      drawViewportFragment,
      initialize,
      finalize,
      drawViewportMiniature
    };
    console.log(`Helpers initialized`);
  }, []);

  useEffect(() => {
    getComments();
  }, [minWidthViewport])
  
  useEffect(() => {
    if (inreview && stage === 'RECORDING') {
      let marginRight = Math.round(positionrightLiveToReviewRef.current);
      
      if(marginRight < 990) {
        intervalReviewRef.current = setInterval(() => {
          
          // para seguir dibujando la der guia en la revision hasta llegar al margen derecho
          if(positionrightLiveToReviewRef.current <= 990){
            auxiliarDrawScroll(0, positionrightLiveToReviewRef.current);
            
          }
          else{
            // drawOneTimeTotalWidthDiiMiniature();
            setRightArrow(true);
          }
        }, 500)
      }
    }
    
    return () => {
      clearInterval(intervalReviewRef.current);
    }
  }, [inreview])
  
  const auxiliarDraw = (left, right) => {
    if(right == positionrightLiveToReviewRef.current){
      setRightArrow(false);
    }
    if(right != positionrightLiveToReviewRef.current && stage === 'RECORDING' && right > 990){
      setRightArrow(true);
    }
    drawViewportFragment(left, right, 'main');
  };
  
  const auxiliarDrawScroll = (left, right) => {
    // flechas indicadoras
    if(left == 0){
      setLeftArrow(false);
    }
    if(left > 0 && right < positionrightLiveToReviewRef.current){
      setLeftArrow(true);
      setRightArrow(true); 
    }
    drawViewportMiniature(left, right, 'miniature');
  };
  const auxiliarDrawLive = (left, right) => {
    // drawViewportFragment(left, right, 'live');
    console.log('auxiliar drawLive') //TODO resolver esto
  };
  
  const sendIndexsNavigations = (fromlive = false) => {
    
    let marginLeftPx, widthPx, left, width;
    
    // si es llamado en el review
    if(!fromlive){
      marginLeftPx = viewportRef.current.style.left;
      widthPx = viewportRef.current.style.minWidth;
    }
    
    // si es llamada estando en vivo
    if(fromlive){
      marginLeftPx = viewportRef.current.style.left;
      widthPx = viewportRef.current.style.minWidth;
    }
    
    left = Number(marginLeftPx.replace("px", "")) + offsetRefViewport.current;
    width = Number(widthPx.replace("px", ""));
    
    let right = left + width;
    
    // posicion actual
    let marginRight = Math.floor(positionrightLiveToReviewRef.current);
    
    // primeros segundos
    if(marginRight <= 255){
      left = 0;
      right = marginRight;
    }
    
    // en el pin de la review, no mostrar toda la señal si corresponde
    if(marginRight < 990 && marginRight < right){
      right = marginRight;
    }
    
    auxiliarDraw(left, right);
  }

  const getComments = async() => {
    try {
      const commentsResp = commentsDB;
      if(commentsResp && commentsResp.length && commentsResp.length > 0){
        //agrego los segundos a los comentarios
        const commentsRespExtend = commentsResp.map(
          (comment)=> {
            let leftPixels, rightPixels;
            let left = parseInt(comment.from);
            let right = parseInt(comment.to);
          if(comment.source !== 'ecgplayer'){
            //convierto los px del viewer al player
            const {leftPixelsPlayer, rightPixelsPlayer} = getPixelsFromViewerToPlayer(left, right,204.4,minWidthViewport);
            leftPixels = leftPixelsPlayer;
            rightPixels = rightPixelsPlayer;
          }else{
            leftPixels = left;
            rightPixels = leftPixels + minWidthViewport;
          }
          //obtengo los segundos desde los px del player
          const {leftSeconds, rightSeconds} = getSecondsFromPixels(leftPixels, rightPixels, minWidthViewport, 5.6);

          return { ...comment, 
            from: leftPixels, 
            to: rightPixels, 
            fromSeconds: leftSeconds, 
            toSeconds: rightSeconds
          }
          }
        )


        setComments(commentsRespExtend);
      }
    } catch (error) {
      console.log('error_db', JSON.stringify(error));
    }

}

  const {   
    dragIndicators,
    loading,
    margin,
    viewlistcomments,
    handleListcomments,
    handleFocusMarginsEcg,
    handleDragIndicators,
    showModalComments,
    setShowModalComments,
    setMargin
  } = useComments(
    auxiliarDraw,
    auxiliarDrawScroll,
    offsetRefViewportPlayer,
    lastMarginRightDB,
    widthOfEcgDiiMiniature,
    minWidthViewport,
    setLeftArrow); 

  return (
    <I18nextProvider i18n={i18next}>
      <WrapperGrid ref={withoutDataDivRef}>
        <BoxGrid>
          <ECGWave player={true} />
        </BoxGrid>
      </WrapperGrid>
      <WrapperGrid ref={withoutDataDivRef}>
          <ECGWrapper
          style={{
            width: '500px',
          }}>
            <EcgNavigatorPlayer
              stage={stage}
              setStage={setStage}
              pauseRecord={pauseRecord}
              height={75}
              width={530}
              bgWidth={550}
              isPinReview={isPinReview}
              live={live}
              lastDrawn={lastIndex}
              msScale={displayersRef?.current?.mainDisplayer?.scale}
              onViewportChange={(e) => {auxiliarDraw(e.left, e.right)}}
              onViewportChangeScroll={(e) => {auxiliarDrawScroll(e.left, e.right);}}
              minWidth={minWidthViewport} //TODO arreglar esto, tiene que ser el ancho del viewport
              setRight={setRight}
              setLeft={setLeft}
              left={left}
              minWidthReview={minWidthReview}
              withoutdata={withoutdata}
              widthCanvasMiniature={500} // TODO borrar esto, no se usa en ningun lado
              setWidthCanvasMiniature={() => {}} // TODO borrar esto, no se usa en ningun lado
              auxiliarDrawLive={auxiliarDrawLive}
              auxiliarDrawScroll={auxiliarDrawScroll}
              stopmoveviewport={stopmoveviewport}
              setStopmoveviewport={setStopmoveviewport}
              pauseGraffics={pauseGraffics}
              positionsReview={positionsReview}
              positionsReviewScroll={positionsReviewScroll}
              positionsRefViewport={positionsRefViewport}
              offsetRefViewport={offsetRefViewport}
              leftarrow={leftArrow}
              setLeftarrow={setLeftArrow}
              rightarrow={rightArrow}
              setRightarrow={setRightArrow}
              indicatorsRef={indicatorsRef}
              gototheEnd={gototheEnd}
              positionrightLiveToReviewRef={positionrightLiveToReviewRef}
              positionLeftIsPinReview={positionLeftIsPinReview}
              setIsPinReview={setIsPinReview}
              setIsPin={setIsPin}
              leftreview={leftreview}
              setLeftreview={setLeftreview}
              sendIndexsNavigations={sendIndexsNavigations}
              timer={timer}
              setTimer={setTimer}
              viewportRefReview={viewportRefReview}
              viewportRef={viewportRef}
              displayersRef={displayersRef}
              setInreview={setInreview}
              inreview={inreview}
              dx={displayersRef?.current?.mainDisplayer?.dx}
              />
            </ECGWrapper>
      </WrapperGrid>
      <Flex center mt='60px'>
        <ButtonAdd
          repository={repository}
          handleDragIndicators={handleDragIndicators}
        />
      </Flex>
      <ECGButton 
        onClick={() => {
          handleListcomments();
        }}
        // secondcheck={secondcheck}
        // continuesecondtocomments={continuesecondtocomments}
        repository={repository}
        >
          <StyledFontAwesomeIcon 
            icon={faCommentAlt} 
            repository={repository}
            />
      </ECGButton>
      
      <AddCommentDialog
        // loading={loading}
        loading={false} // TODO setear bien el loading
        viewlistcomments={viewlistcomments}
        open={showModalComments}
        handleClose={() => {
          setShowModalComments(false);
        }}
        dragIndicators={dragIndicators}
        comments={comments}
        setComments={setComments}
        handleFocusMarginsEcg={handleFocusMarginsEcg}
        fullNameUser={fullNameUser}
        left={left}
        right={right}
        addComment={addComment}
        repository={repository}
        widthOfEcgPanel={580} //TODO revisar esto
        style={{
          position: 'relative',
          left: '50px',
          top: '50px'
        }}
      />
    </I18nextProvider>
  )
}
export default ECGPanelPlayer;