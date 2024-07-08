import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {ECGWave} from './ECGWave'
import EcgNavigator from './ECGNavigator'
import { useDrawDerivations } from '../hooks/useDrawEcg'
import AddCommentDialog from '../dialogs/AddCommentDialog'
import { getSecondsFromPixels } from '../utils/date'

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
  margin-top: 80px;
`
export const BoxGrid = styled.div`
  border-radius: 5px;
  padding: 5px;
  font-size: 150%;
`
const ECGWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ECGPanel = ({
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
  viewlistcomments,
  showModalComments,
  setShowModalComments,
  dragIndicators,
  comments,
  setComments,
  setDragIndicators
  }
) => {

  const intervalReviewRef = useRef()
  const [lastIndex, setLastIndex] = useState(0)
  const [selectedmargins, setSelectedmargins] = useState({left:null,right:null});

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
  } = useDrawDerivations (
    datasetRefViewer,
    displayersRef,
    positionrightLiveToReviewRef,
    gototheEnd,
    onData,
    setLastIndex
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
    const {left, right} = selectedmargins;
    console.log('selected margins',left,right)
    if(left >= 0 && right > 0){
      auxiliarDraw(left, right);
    }
  }, [selectedmargins]);

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

  const handleDragIndicators = (focus = false) => {
    const parentDragIndicatorLeft = document.querySelector('.drag-indicator-left').parentElement.style

    let left = parentDragIndicatorLeft.left
    let width = parentDragIndicatorLeft.minWidth

    // left = parseInt(left.split("px").shift()) - 80;
    left = parseInt(left.split('px').shift())
    width = parseInt(width.split('px').shift())

    //right = (left + width)
    const right = left + width

    const {leftSeconds, rightSeconds} = getSecondsFromPixels(
      left,
      positionrightLiveToReviewRef.current,
      timer,
      isPinReview,
      positionrightLiveToReviewRef,
    )

    setDragIndicators({
      left,
      right,
      leftSeconds,
      rightSeconds,
    })

    // si no viene del metodo de focalizar abro el modal de nuevo comentario
    if (!focus) {
      setViewlistcomments(false)
      setShowModalComments(true)
    }
  }

  const handleFocusMarginsEcg = (left) => {
    // console.log('left', left);
    // console.log('right', right);
    let right;

    offsetRefViewport.current = left;

    if(offsetRefViewport.current > 0){
      setLeftArrow(true);
    }

    
    if(isPinReview){
      right = left + 580;
    }else{
      right = left + 255;
    }

    if(offsetRefViewport.current + 990 > right){
      setRightArrow(false);
    }

    // if (inreview) 
    setInreview(true)
    // setLeft(0)
    // } else {
    document.querySelector('.drag-indicator-viewer-review').style.left = '0px';
    // }
    // mover el rectangulo al comienzo

    // para focalizar todas las graficas
    auxiliarDraw(left, right);

    // para focalizar la dii guia (miniature)
    auxiliarDrawScroll(left, (isPinReview)?right + 410:right + 735);


    setSelectedmargins({left, right});

    handleDragIndicators(true);
  };

  return (
    <I18nextProvider i18n={i18next}>
      <WrapperGrid ref={withoutDataDivRef} style={{ position: 'relative', left:'-100px' ,zIndex: 1}}>
        <BoxGrid >
          <ECGWave />
        </BoxGrid>
      </WrapperGrid>
      { stopmoveviewport &&
        <WrapperGrid ref={withoutDataDivRef} style={{ position: 'relative', left:'-100px', zIndex: 2}}>
          <BoxGrid>
            <ECGWave review={true}/>
          </BoxGrid>
      </WrapperGrid>}
      <WrapperGrid ref={withoutDataDivRef} style={{position: 'relative', left:'-100px', top:'100px',marginTop: '300px'}}>
        <BoxGrid>
          <ECGWrapper
          style={{
            width: '1050px',
            marginLeft: '5px'
          }}>
            <EcgNavigator
              stage={stage}
              setStage={setStage}
              pauseRecord={pauseRecord}
              height={height}
              width={990}
              isPinReview={isPinReview}
              live={live}
              lastDrawn={lastIndex}
              msScale={displayersRef?.current?.mainDisplayer?.scale}
              onViewportChange={(e) => {auxiliarDraw(e.left, e.right)}}
              onViewportChangeScroll={(e) => {auxiliarDrawScroll(e.left, e.right);}}
              minWidth={587} //TODO arreglar esto, tiene que ser el ancho del viewport
              setRight={setRight}
              setLeft={setLeft}
              minWidthReview={minWidthReview}
              withoutdata={withoutdata}
              widthCanvasMiniature={0} // TODO borrar esto, no se usa en ningun lado
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
          </BoxGrid>
      </WrapperGrid>
      <AddCommentDialog
        viewlistcomments={viewlistcomments}
        open={showModalComments}
        handleClose={() => {
          setShowModalComments(false);
          // setSelectedPin(null);
        }}
        dragIndicators={dragIndicators}
        comments={comments}
        setComments={setComments}
        handleFocusMarginsEcg={handleFocusMarginsEcg} // TODO pasar esto al package 
        left={left}
        right={right}
        isPinReview={true}
        positionrightLiveToReviewRef={positionrightLiveToReviewRef}
        inreview={inreview}
        leftreview={leftreview}
      />
    </I18nextProvider>
  )
}
export default ECGPanel;