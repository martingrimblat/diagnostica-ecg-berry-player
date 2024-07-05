import React from "react";
import styled from "styled-components";
import { faCaretLeft, faCaretRight, faEye } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ECGMiniatureReview from "./ECGMiniatureReview";
import ECGMiniature from "./ECGMiniature";
import Timer from "./Timer";


let offset_pointer = 0;


const SViewport = styled.div.attrs(({ left, minWidth }) => ({
  style: {
    left: left + "px",
    minWidth: minWidth + "px",
  },
}))`
  box-sizing: border-box;
  height: 100%;
  position: absolute;
  z-index: 2;

  border: 1px solid #bfbfbf;
  background-color: #f2f2f233;
  cursor: grab;
`;

const ButtonCircle = styled.div.attrs(({ stopmoveviewport }) => ({
  style: {
    border: stopmoveviewport ? "1px solid #004FEC" : "1px solid #BFBFBF",
  },
}))`
  box-shadow: 0px 1.3px 2.6px rgb(6 22 85 / 16%);
  height: 40px;
  top: 80px;
  left: 60px;
  position: absolute;
  cursor: pointer;
  box-sizing: border-box;
  width: 80px;
  height: 31px;
  background: #FFFFFF;
  border-radius: 33.242px;
`;

const Eye = styled.div`
  text-align: end;
  color: grey;
  /* margin-top: 110px; */
  /* width: 99px; */
  top: 124px;
  left: 15px;
  position: absolute;
  width: 125px;
`;



const Viewport = ({
  minWidth,
  offsetRefViewport,
  viewportRef,
  setLeft,
  left,
  onViewportChange,
  onViewportChangeScroll,
  widthCanvasMiniature
}) => {
  let addMarginIfIsPin = 0
  let widthOfEcgDiiMiniature = 500 //hardocdeado

  const pos1 = useRef();
  const pos3 = useRef();
  const intervalMoveLeft = useRef();
  const intervalMoveRight = useRef();



  let right;

  const functionOnViewportChange = (left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin) => {
    typeof onViewportChange === "function" &&
    onViewportChange({
      left: left - canvasContentOffset + offset_pointer + offsetRefViewport.current,
      right: right - canvasContentOffset + offset_pointer + offsetRefViewport.current + addMarginIfIsPin,
    });
    
  }
  
  const functionOnViewportChangeScroll = (left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin, extraLeft = 0, extraRight = 0) => {
    typeof onViewportChangeScroll === "function" &&
    onViewportChangeScroll({
      left: left - canvasContentOffset + offset_pointer + offsetRefViewport.current + extraLeft,
      right: right - canvasContentOffset + offset_pointer + offsetRefViewport.current + extraRight,
    });
  }

  const offsetLeft = 0;
  // const [left, setLeft] = useState(0);
  // const offsetLeft = 80;
  // const [left, setLeft] = useState(80);

 

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    // offsetRefViewport.current = 0;
    clearInterval(intervalMoveLeft.current);
    clearInterval(intervalMoveRight.current);
    console.log('intervalMoveRight',intervalMoveRight)

    drag(e.clientX);
  }
  function closeDragElement(ev) {
    console.log('clear interval close drag')
    document.onmouseup = null;
    document.onmousemove = null;
    clearInterval(intervalMoveLeft.current);
    clearInterval(intervalMoveRight.current);
  }
  
  function handleMouseDown(e) {
    e = e || window.event;
    // e.preventDefault();

    // get the mouse cursor position at startup:
    pos3.current = e.clientX;
    console.log(pos3.current)
    viewportRef.current.style.cursor = "grabbing";
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  const handleTouchStart = (e) => {

    // changeToReview();
    
    document.ontouchend = closeDragElementTouch;
    
    document.ontouchmove = elementDrag;
  }
  
  function closeDragElementTouch(ev) {
    document.ontouchend = null;
    document.ontouchmove = null;
  }
  
  const drag = (clientX) => {

    console.log('function drag')
    // calculate the new cursor position:
    const elmnt = viewportRef.current; //la derivacion de abajo
    pos1.current = pos3.current - clientX; //compara la posicion inicial con la nueva posicion donde movi el mouse
    pos3.current = clientX; //posicion de mi mouse
    
    const left = elmnt.offsetLeft - pos1.current; //posicion del lado izquierdo del viewport - nueva posicion de mi mouse
    const width = elmnt.offsetWidth; //mantenemos el ancho
    right = left + width; //posicion del lado derecho del viewport, ladoizq + ancho
    
    
    const canvasContainer = elmnt.closest(".canvas-container"); //div que contiene toda los componentes del viewport
    const canvasContent = canvasContainer.querySelector(".canvas-content"); //selecionamos el canvas con la derivacion
    const canvasContentOffset = canvasContent.offsetLeft; //obtenemos donde comienza la derivacion
    const parentWidth = elmnt.closest(".canvas-container").offsetWidth; //ancho de la derivacion y/o final de la derivacion //TODO revisar esto
    // const parentWidth2 = elmnt.closest("#canvas-wrapper-min-viewer").offsetWidth; //ancho de la derivacion y/o final de la derivacion

    // set the element's new position
    if (left >= canvasContentOffset && right < parentWidth) {
      //mientras el viewport no este al final o al principio de la derivacion actualiza la pos
      setLeft(left);
      typeof onViewportChange === "function" &&
      onViewportChange({
          left: left - canvasContentOffset + offset_pointer + offsetRefViewport.current,
          right: right - canvasContentOffset + offset_pointer + offsetRefViewport.current,
        });
      }
      // scroll a la derecha
      if (left >= canvasContentOffset && right >= parentWidth) {
        //mientras el viewport no este al final o al principio de la derivacion actualiza la pos

        offsetRefViewport.current = offsetRefViewport.current + 10;
  
        // si llego al final de la navegacion no muestra la flecha derecha, ni dibujo
        if((right - canvasContentOffset + offset_pointer + offsetRefViewport.current + addMarginIfIsPin) <= 1700){
          functionOnViewportChange(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin);
          functionOnViewportChangeScroll(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin, - (widthOfEcgDiiMiniature - minWidth));
          }else{
            // quito lo que le sume al offset
            offsetRefViewport.current = offsetRefViewport.current - 10;
          }
    
          
          intervalMoveRight.current =  setInterval(() => {
            console.log('intervalMoveRight', intervalMoveRight)
            offsetRefViewport.current = offsetRefViewport.current + 10;
      
            // si llego al final de la navegacion no muestra la flecha derecha, ni dibujo
            if((right - canvasContentOffset + offset_pointer + offsetRefViewport.current + addMarginIfIsPin) <= 1700){ //TODO hardocodeado sacado del lastMarginRightDB de ecg-react-player
            functionOnViewportChange(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin);
            functionOnViewportChangeScroll(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin, - (widthOfEcgDiiMiniature - minWidth));
            }else{
              // quito lo que le sume al offset
            offsetRefViewport.current = offsetRefViewport.current - 10;
          }
          }, 150);
        
      }
      
      // scroll a la izquierda
          
      if (left < canvasContentOffset && right < parentWidth) {
        
        offsetRefViewport.current = offsetRefViewport.current - 10;
  
        if(offsetRefViewport.current <= 0){
          offsetRefViewport.current = 0;
        }
        if((left - canvasContentOffset + offset_pointer + offsetRefViewport.current) >= 0){
          functionOnViewportChange(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin);
          functionOnViewportChangeScroll(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin, 0, widthOfEcgDiiMiniature - minWidth);
          // mientras el rectangulo esté a la izquierda y onmousedown  el scroll va a seguir navegando
          intervalMoveLeft.current =  setInterval(() => {
              // actualizo el offset de navegacion
              offsetRefViewport.current = offsetRefViewport.current - 10;
  
              if(offsetRefViewport.current <= 0){
                offsetRefViewport.current = 0;
              }
              if((left - canvasContentOffset + offset_pointer + offsetRefViewport.current) >= 0){
                functionOnViewportChange(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin);
                functionOnViewportChangeScroll(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin, 0, widthOfEcgDiiMiniature - minWidth);
              }else{
                  typeof onViewportChange === "function" &&
                  onViewportChange({
                    left: 0,
                    right: minWidth + addMarginIfIsPin,
                  });
            
                  typeof onViewportChangeScroll === "function" &&
                  onViewportChangeScroll({
                    left: 0,
                    right: widthCanvasMiniature,
                  });
                  clearInterval(intervalMoveLeft.current);
              }
          }, 150);
        }else{
          typeof onViewportChange === "function" &&
          onViewportChange({
            left: 0,
            right: minWidth + addMarginIfIsPin,
          });
          typeof onViewportChangeScroll === "function" &&
          onViewportChangeScroll({
            left: 0,
            right: widthCanvasMiniature,
          });
        }
      }

  }
  
  
  return (
    <SViewport
    ref={viewportRef}
    left={left}
    // onClick={changeToReview}
    onMouseDown={handleMouseDown}
    onTouchStart={handleTouchStart}
    minWidth={minWidth}
    className="drag-indicator-viewer"
    >
      <div className="drag-indicator-left">
        <FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon>
      </div>
      <div className="drag-indicator-right">
        <FontAwesomeIcon icon={faCaretRight}></FontAwesomeIcon>
      </div>
    </SViewport>
  );
};

const EcgNavigatorPlayer = ({
  stage,
  setStage,
  pauseRecord,
  width,
  height,
  isPinReview,
  onViewportChange,
  onViewportChangeScroll,
  live,
  lastDrawn,
  msScale,
  minWidth,
  setRight,
  setLeft,
  left,
  minWidthReview,
  withoutdata,
  widthCanvasMiniature,
  setWidthCanvasMiniature,
  auxiliarDrawLive,
  auxiliarDrawScroll,
  stopmoveviewport,
  setStopmoveviewport,
  setInreview,
  inreview,
  positionsReview,
  positionsReviewScroll,
  positionsRefViewport,
  offsetRefViewport,
  leftarrow,
  setLeftarrow,
  rightarrow,
  setRightarrow,
  indicatorsRef,
  gototheEnd,
  positionrightLiveToReviewRef,
  setIsPinReview,
  setIsPin,
  leftreview,
  setLeftreview,
  // sendIndexsNavigations,
  timer,
  setTimer,
  viewportRefReview,
  viewportRef,
  dx,
  bgWidth,
}) => {
  
  return (
    <>
      <div>
      <ECGMiniature
        style={{
          marginTop: "12px",
          border: "1px solid #F2F2F2",
          position: 'relative',
          left: '37px'
        }}
        canvasId={"dii-miniature"}
        backgroundGrid={false}
        derivation={"dii-miniatureViewer"}
        dataDerivation={"dii"}
        canPin={false}
        label={"DII"}
        height={height}
        width={width}
        widthCanvasMiniature={widthCanvasMiniature}
        bgWidth={bgWidth}
      >
        <Viewport
          onViewportChange={onViewportChange}
          onViewportChangeScroll={onViewportChangeScroll}
          live={live}
          lastDrawn={lastDrawn}
          msScale={msScale}
          minWidth={minWidth}
          setRight={setRight}
          setExtraLeft={setLeft}
          widthCanvasMiniature={widthCanvasMiniature}
          setWidthCanvasMiniature={setWidthCanvasMiniature}
          stopmoveviewport={stopmoveviewport}
          setStopmoveviewport={setStopmoveviewport}
          setInreview={setInreview}
          inreview={inreview}
          positionsReview={positionsReview}
          positionsRefViewport={positionsRefViewport}
          offsetRefViewport={offsetRefViewport}
          setLeftarrow={setLeftarrow}
          setRightarrow={setRightarrow}
          auxiliarDrawLive={auxiliarDrawLive}
          auxiliarDrawScroll={auxiliarDrawScroll}
          positionrightLiveToReviewRef={positionrightLiveToReviewRef}
          // drag={drag}
          setIsPinReview={setIsPinReview}
          setIsPin={setIsPin}
          // intervalMoveLeft={intervalMoveLeft}
          // intervalMoveRight={intervalMoveRight}
          isPinReview={isPinReview}
          // sendIndexsNavigations={// sendIndexsNavigations}
          viewportRef={viewportRef}
          dx={dx}
          setLeft={setLeft}
          left={left}
        />
      </ECGMiniature> 
        {leftarrow && 

          <FontAwesomeIcon
            style={{ 
              color: "#004FEC", 
              fontSize: "20px",
              marginTop: "-62px",
              marginLeft: "36px",
              zIndex: 3,
              position: "absolute"
            }}
            icon={faArrowLeft}
          />
        }
        {rightarrow && 
          <FontAwesomeIcon
            style={{ 
              color: "#004FEC", 
              fontSize: "20px",
              marginLeft: "1046px",
              marginTop: "-62px",
              zIndex: 3,
              position: "absolute"
            }}
            icon={faArrowRight}
          />
        }

      </div>   
    </>
  );
};
export default EcgNavigatorPlayer;
