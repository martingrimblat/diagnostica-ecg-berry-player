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
  live,
  lastDrawn,
  minWidth,
  setStopmoveviewport,
  setInreview,
  inreview,
  positionsReview,
  positionsRefViewport,
  offsetRefViewport,
  setLeftarrow,
  setRightarrow,
  auxiliarDrawScroll,
  positionrightLiveToReviewRef,
  drag,
  intervalMoveLeft,
  intervalMoveRight,
  isPinReview,
  viewportRef,
  dx
}) => {

  const offsetLeft = 0;
  const [left, setLeft] = useState(0);
  // const offsetLeft = 80;
  // const [left, setLeft] = useState(80);
  let right;

  useEffect(() => {
  
    return () => {
      // console.log('desmonto Viewport');
      viewportRef.current = 0;
      // pos1.current = 0;
      // pos3.current = 0;
      setLeft(0);
      right = 0;
      offset_pointer = 0;
    }
  }, []);
  useEffect(() => {
    //hace que el Viewport siga la grafica
    // console.log(`ECGNav Set left to follow last point drawed`);
    if (live && lastDrawn) {
      const viewportWidth = viewportRef.current.offsetWidth; //260 ancho rect que se mueve
      const parentWidth = viewportRef?.current.closest(".canvas-container").offsetWidth;
      const miniatureScale = 0.5; //TODO: READ FROM INDEX AND CREATE CLASS ECGPanelController
      //10
      // console.log(viewportWidth,parentWidth)
      // console.log('dx', dx)
      const right = lastDrawn * dx * miniatureScale;
      
      const left = Math.round(right - viewportWidth);
      //80
      const cleft = Math.max(offsetLeft, left + offsetLeft);
      // Math.max(offsetLeft, left + offsetLeft); //check width!

      // ultima posicion del margen derecho en vivo
      positionrightLiveToReviewRef.current = Math.floor(right - 1);

      // antes del shift
      if(right <= parentWidth - offsetLeft){
        setLeft(cleft);

        // actualizo la posicion del viewport
        positionsRefViewport.current.start = left;
        positionsRefViewport.current.end = right;
        
        positionsReview.current.start = left;
        positionsReview.current.end = right;


      }else{

        if(offsetRefViewport.current == 0 && inreview){
          setLeftarrow(false);
        }else{
          setLeftarrow(true);
          
        }

        if(offsetRefViewport.current > 0 && inreview){
          setRightarrow(true);
        }

        // if(isPinReview && right > 990){
        //   setLeft(990-510);
        // }
        // if(!isPinReview){
        //   setLeft(990-255);
        // }
        // positionsRefViewport.current.start = 735-255-80;
        // positionsRefViewport.current.end = 990-255-80;
        // actualizo la posicion del viewport review
        // positionsReview.current.start = 733 + offsetRefViewport.current;
        // positionsReview.current.end = 988 + offsetRefViewport.current;
      }

      
    }
    
  }, [live, lastDrawn]);

  // efecto para que no desborde el viewport al hacer click en el pin
  useEffect(() => {


    if(isPinReview){
      if(left + 580 > 990){
        setLeft(left - 325);
      }
    }
    if(!isPinReview && left !== 0){
      if(left + 325 > positionrightLiveToReviewRef.current){
        setLeft(positionrightLiveToReviewRef.current - 255);
      }else{
        setLeft(left + 325);
      }
    }

  }, [isPinReview])
  
  useEffect(() => {
    
    return () => {
      if(viewportRef && viewportRef.current){
        viewportRef.current = null;
      }
    }
  }, []);

  function handleMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    // changeToReview();

    clearInterval(intervalMoveLeft.current);
    clearInterval(intervalMoveRight.current);

    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    setInreview(true);
    setStopmoveviewport(true);
    // offsetRefViewport.current = 0;

    let marginRight = Math.floor(positionrightLiveToReviewRef.current);
    
    if(marginRight <= 990){
      
      offsetRefViewport.current = 0;
      
      auxiliarDrawScroll(0, marginRight);
      
    }else{
      
      offsetRefViewport.current = marginRight - 990;
      
      auxiliarDrawScroll(marginRight - 990, marginRight);
      
    }

    drag(e.clientX);
  }

  function closeDragElement(ev) {
    document.onmouseup = null;
    document.onmousemove = null;
    clearInterval(intervalMoveLeft.current);
    clearInterval(intervalMoveRight.current);
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


const ViewportReview = ({
  onViewportChange,
  onViewportChangeScroll,
  minWidthReview,
  positionsReview,
  offsetRefViewport,
  isPinReview,
  setLeftarrow,
  setRightarrow,
  positionrightLiveToReviewRef,
  drag,
  viewportRefReview,
  pos1,
  pos3,
  intervalMoveLeft,
  intervalMoveRight,
  left,
  setLeft,
  right,
  sendIndexsNavigations,
  stage

}) => {
  // console.log('render VIEWPORT REVIEW')

  const [keepmoveleft, setKeepmoveleft] = useState(false);

  // let right;
  
  useEffect(() => {

    // console.log('cargo el review');
    // sendIndexsNavigations(true);
  
    return () => {
      // console.log('desmonto viewportReview ');
      viewportRefReview.current = null;
      pos1.current = null;
      pos3.current = null;
      intervalMoveLeft.current = null;
      intervalMoveRight.current = null;
      setLeft(0);
      setKeepmoveleft(false);
    }
  }, []);
  
 
 
  useEffect(() => {
    // posicion del rectangulo viewport en review
    if(positionsReview.current.start < 735)
    {
      if(positionsReview.current.start < 0){
        setLeft(0)
        
      }
      else{
        if(positionrightLiveToReviewRef.current > 990){
          if(isPinReview){
            setLeft(403);
          }
          else{
            setLeft(735);
          }
        }else{
          if(isPinReview && (positionsReview.current.start + 580 > 990)){
            setLeft(403);
          }
          else{
            setLeft(positionsReview.current.start)
          }
        }
        
          
        }
        
      }

      
    }, [])
    
    // efecto para que no desborde el viewport al hacer click en el pin
    useEffect(() => {

      if(isPinReview){
        if(left + 580 > 990){
          setLeft(left - 325);
        }
        setTimeout(() => {
          sendIndexsNavigations();
        }, 0);
      }

  }, [isPinReview])
  
  
  function handleMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    
    
    // get the mouse cursor position at startup:
    pos3.current = e.clientX;
    
    viewportRefReview.current.style.cursor = "grabbing";
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

  }


  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    drag(e.clientX);

  }
  
  function closeDragElement(ev) {
    document.onmouseup = null;
    document.onmousemove = null;
    setKeepmoveleft(false);
    clearInterval(intervalMoveLeft.current);
    clearInterval(intervalMoveRight.current);
  }
  
  //  para dispositivos tactiles
  
  const handleTouchStart = (e) => {
    // get the touch position at startup:
    pos3.current = e.touches[0].pageX;
    
    document.ontouchend = closeDragElementTouch;
    
    document.ontouchmove = elementDragTouch;
  }
  
  function elementDragTouch(e) {

    e = e || window.event;
    e.preventDefault();

    drag(e.touches[0].pageX);

  }
  
  function closeDragElementTouch(ev) {
    document.ontouchend = null;
    document.ontouchmove = null;
    clearInterval(intervalMoveLeft.current);
    clearInterval(intervalMoveRight.current);
  }




// const ButtonCircle = styled.div.attrs(({ stopmoveviewport }) => ({
//   style: {
//     border: stopmoveviewport ? "1px solid #004FEC" : "1px solid #BFBFBF",
//   },
// }))`
//   box-shadow: 0px 1.3px 2.6px rgb(6 22 85 / 16%);
//   height: 40px;
//   top: 80px;
//   left: 60px;
//   position: absolute;
//   cursor: pointer;
//   box-sizing: border-box;
//   width: 80px;
//   height: 31px;
//   background: #FFFFFF;
//   border-radius: 33.242px;
// `;
  
// const ButtonCircle = styled.div.attrs(({ stopmoveviewport }) => ({
//   style: {
//     border: stopmoveviewport ? "1px solid #004FEC" : "1px solid #BFBFBF",
//   },
// }))`
//   box-shadow: 0px 1.3px 2.6px rgb(6 22 85 / 16%);
//   height: 40px;
//   top: 80px;
//   left: 60px;
//   position: absolute;
//   cursor: pointer;
//   box-sizing: border-box;
//   width: 80px;
//   height: 31px;
//   background: #FFFFFF;
//   border-radius: 33.242px;
// `;
  
  return (
    <SViewport
    ref={viewportRefReview}
    left={left}
    onMouseDown={handleMouseDown}
    onTouchStart={handleTouchStart}
    minWidth={minWidthReview}
    className="drag-indicator-viewer-review"
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

const EcgNavigator = ({
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
  positionLeftIsPinReview,
  setIsPinReview,
  setIsPin,
  leftreview,
  setLeftreview,
  sendIndexsNavigations,
  timer,
  setTimer,
  viewportRefReview,
  viewportRef,
  dx
}) => {
  const { t } = useTranslation("global");
  const refCanvasWrapperMinViewer = useRef();
  const refCanvasMiniatureContainer= useRef();
  
  const [showgototheend, setShowgototheend] = useState(false);

  const [widthscroll, setWidthscroll] = useState(255);

  const pos1 = useRef();
  const pos3 = useRef();
  const intervalMoveLeft = useRef();
  const intervalMoveRight = useRef();



  let right;

  const drag = (clientX) => {


    clearInterval(intervalMoveLeft.current);
    clearInterval(intervalMoveRight.current);

   
    // calculate the new cursor position:
    const elmnt = viewportRefReview.current; //la derivacion de abajo
    pos1.current = pos3.current - clientX; //compara la posicion inicial con la nueva posicion donde movi el mouse
    pos3.current = clientX; //posicion de mi mouse
    
    const left = elmnt.offsetLeft - pos1.current; //posicion del lado izquierdo del viewport - nueva posicion de mi mouse
    const width = elmnt.offsetWidth; //mantenemos el ancho
    right = left + width; //posicion del lado derecho del viewport, ladoizq + ancho
    
    
    const canvasContainer = elmnt.closest(".canvas-container"); //div que contiene toda los componentes del viewport
    const canvasContent = canvasContainer.querySelector(".canvas-content"); //selecionamos el canvas con la derivacion
    const canvasContentOffset = canvasContent.offsetLeft; //obtenemos donde comienza la derivacion
    const parentWidth = elmnt.closest(".canvas-container").offsetWidth; //ancho de la derivacion y/o final de la derivacion
    // const parentWidth2 = elmnt.closest("#canvas-wrapper-min-viewer").offsetWidth; //ancho de la derivacion y/o final de la derivacion
    
    conditionsToScroll(left, right, canvasContentOffset, parentWidth);
  }

  const conditionsToScroll = (left, right, canvasContentOffset, parentWidth) => {

    let addMarginIfIsPin = (isPinReview) ? 0 : 0;

    let navigate = false;
    // set the element's new position
    if (left >= canvasContentOffset && right < parentWidth) {
      navigate = true;
      
      // onMoveViewportMoveScroll(widthCanvasMiniature, left);
      
      // le sumo el valor del margen derecho del navegador scroll
      
      if((right) <= positionrightLiveToReviewRef.current){
        //mientras el viewport no este al final o al principio de la derivacion actualiza la pos
        setLeftreview(left);
        functionOnViewportChange(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin);
      }else{
        if(isPinReview && inreview){
          if(positionrightLiveToReviewRef.current > 580){
            setLeftreview(positionrightLiveToReviewRef.current-580);
            functionOnViewportChange(positionrightLiveToReviewRef.current-580, positionrightLiveToReviewRef.current, canvasContentOffset, offset_pointer, addMarginIfIsPin);
          }
          else{
            setLeftreview(0);
            functionOnViewportChange(0, positionrightLiveToReviewRef.current, canvasContentOffset, offset_pointer, addMarginIfIsPin);
          }
        }
        if(isPinReview && !inreview){
          
          // si muevo a la izquierda
          if(pos1.current > 0){
            setLeftreview(left);
            functionOnViewportChange(left, positionrightLiveToReviewRef.current, canvasContentOffset, offset_pointer, addMarginIfIsPin);
          }
        }
      }
    }
    
    
    // scroll a la derecha
    if (left >= canvasContentOffset && right >= parentWidth) {
      navigate = true;
      
      
      //mientras el viewport no este al final o al principio de la derivacion actualiza la pos
      
      offsetRefViewport.current = offsetRefViewport.current + 3;
      
      // si llego al final de la navegacion no muestra la flecha derecha, ni dibujo
      if((right - canvasContentOffset + offset_pointer + offsetRefViewport.current + addMarginIfIsPin) <= positionrightLiveToReviewRef.current){
        functionOnViewportChange(left, right, 0, 0, addMarginIfIsPin);
        functionOnViewportChangeScroll(left, right, 0, 0, addMarginIfIsPin, -403);//TODO parametrizar
        // functionOnViewportChangeScroll(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin, -730, 735 - 730);
      }else{
        
        let leftLast, rightLast;
        
        rightLast = positionrightLiveToReviewRef.current;
        leftLast = (isPinReview) ? rightLast - 580 : rightLast - 255; 
        
        // quito lo que le sume al offset
        // auxiliarDraw(leftLast, rightLast);
        sendIndexsNavigations(true);
        
        setRightarrow(false);
        offsetRefViewport.current = offsetRefViewport.current - 3;
      }
      
      
      intervalMoveRight.current =  setInterval(() => {
        
        offsetRefViewport.current = offsetRefViewport.current + 3;
        
        // si llego al final de la navegacion no muestra la flecha derecha, ni dibujo
        if((right - canvasContentOffset + offset_pointer + offsetRefViewport.current + addMarginIfIsPin) <= positionrightLiveToReviewRef.current){
          functionOnViewportChange(left, right, 0, 0, addMarginIfIsPin);
          functionOnViewportChangeScroll(left, right, 0, 0, addMarginIfIsPin, -403); //TODO parametrizar
          // functionOnViewportChangeScroll(left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin, -730, 735 - 730);
        }else{
          let leftLast, rightLast;
          
          rightLast = positionrightLiveToReviewRef.current;
          leftLast = (isPinReview) ? rightLast - 580 : rightLast - 255; 
          
          // quito lo que le sume al offset
          // auxiliarDraw(leftLast, rightLast);
          sendIndexsNavigations();
          setRightarrow(false);
          offsetRefViewport.current = offsetRefViewport.current - 3;
        }
      }, 2);
      
      
      
      
    }
    
    // scroll a la izquierda
    // console.log(left, canvasContentOffset, right, parentWidth)
    if (left < canvasContentOffset && right < parentWidth) {
      // console.log('scroll left')
      navigate = true;
      
      // actualizo el offset de navegacion
      offsetRefViewport.current = offsetRefViewport.current - 3;
      
      if(offsetRefViewport.current <= 0){
        offsetRefViewport.current = 0;
      }
      // console.log('left', left, 'canvasContentOffset', canvasContentOffset, 'offset_pointer', offset_pointer, 'offsetRefViewport.current', offsetRefViewport.current)
      if((left - canvasContentOffset + offset_pointer + offsetRefViewport.current) >= 0){
        
        
        functionOnViewportChange(left, right, 0, 0, addMarginIfIsPin);
        functionOnViewportChangeScroll(left, right, 0, 0, addMarginIfIsPin, 0, 403);
        
        // mientras el rectangulo esté a la izquierda y onmousedown  el scroll va a seguir navegando
        intervalMoveLeft.current =  setInterval(() => {
          
          // actualizo el offset de navegacion
          offsetRefViewport.current = offsetRefViewport.current - 3;
          
          if(offsetRefViewport.current <= 0){
            offsetRefViewport.current = 0;
          }
          
          
          if((left - canvasContentOffset + offset_pointer + offsetRefViewport.current) >= 0){
            functionOnViewportChange(left, right, 0, 0, addMarginIfIsPin);
            functionOnViewportChangeScroll(left, right, 0, 0, addMarginIfIsPin, 0, 403); //TODO 640 es la diferencia entre width del canvas y del viewport. ESto tiene que estar parametrizado
            
          }else{
            
            
            typeof onViewportChange === "function" &&
            onViewportChange({
              left: 0,
              right: (isPinReview) ? (580 + addMarginIfIsPin) : (255 + addMarginIfIsPin),
            });
            
            if(positionrightLiveToReviewRef.current < 990){
              
              typeof onViewportChangeScroll === "function" &&
              onViewportChangeScroll({
                left: 0,
                right: positionrightLiveToReviewRef.current,
              });
            }else{
              typeof onViewportChangeScroll === "function" &&
              onViewportChangeScroll({
                left: 0,
                right: 990,
              });
              
                }
                clearInterval(intervalMoveLeft.current);
            }

        }, 2);
        
      }else{

        
        if(positionrightLiveToReviewRef.current < 990){

          typeof onViewportChangeScroll === "function" &&
          onViewportChangeScroll({
            left: 0,
            right: positionrightLiveToReviewRef.current,
          });
        }else{
          typeof onViewportChangeScroll === "function" &&
          onViewportChangeScroll({
            left: 0,
            right: 990,
          });

        }
      }
    }

    if(!navigate)
      sendIndexsNavigations(true);
    

  }

  const functionOnViewportChange = (left, right, canvasContentOffset, offset_pointer, addMarginIfIsPin) => {
    positionLeftIsPinReview.current = left - canvasContentOffset + offset_pointer + offsetRefViewport.current;
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

  
 



  useEffect(() => {
    
  
    return () => {
      // console.log('desmonto EcgNavigator');
      refCanvasWrapperMinViewer.current  = null;
      refCanvasMiniatureContainer.current = null;
      setShowgototheend(false);
      setWidthscroll(255);
      // setButtonleft(false);
      // setButtonright(false);
      pos1.current = 0;
      pos3.current = 0;
    }
  }, [])
  
  
  return (
    <>
      <div>
      <ECGMiniature
        style={{
          marginTop: "12px",
          border: "1px solid #F2F2F2"
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
        refCanvasWrapperMinViewer={refCanvasWrapperMinViewer}
        refCanvasMiniatureContainer={refCanvasMiniatureContainer}
      >
        <Viewport
          onViewportChange={onViewportChange}
          live={live}
          lastDrawn={lastDrawn}
          msScale={msScale}
          minWidth={minWidth}
          setRight={setRight}
          setExtraLeft={setLeft}
          widthCanvasMiniature={widthCanvasMiniature}
          setWidthCanvasMiniature={setWidthCanvasMiniature}
          setShowgototheend={setShowgototheend}
          stopmoveviewport={stopmoveviewport}
          setStopmoveviewport={setStopmoveviewport}
          refCanvasWrapperMinViewer={refCanvasWrapperMinViewer}
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
          drag={drag}
          setIsPinReview={setIsPinReview}
          setIsPin={setIsPin}
          intervalMoveLeft={intervalMoveLeft}
          intervalMoveRight={intervalMoveRight}
          isPinReview={isPinReview}
          sendIndexsNavigations={sendIndexsNavigations}
          viewportRef={viewportRef}
          dx={dx}
        />
      </ECGMiniature> 

        
        {inreview && 
        <>
          <ECGMiniatureReview
          style={{
            marginTop: "12px",
            border: "1px solid #F2F2F2"
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
          refCanvasWrapperMinViewer={refCanvasWrapperMinViewer}
          refCanvasMiniatureContainer={refCanvasMiniatureContainer}
        >
          <ViewportReview
            onViewportChange={onViewportChange}
            onViewportChangeScroll={onViewportChangeScroll}
            minWidthReview={minWidthReview}
            positionsReview={positionsReview}
            offsetRefViewport={offsetRefViewport}
            isPinReview={isPinReview}
            setLeftarrow={setLeftarrow}
            setRightarrow={setRightarrow}
            positionrightLiveToReviewRef={positionrightLiveToReviewRef}
            drag={drag}
            viewportRefReview={viewportRefReview}
            pos1={pos1}
            pos3={pos3}
            intervalMoveLeft={intervalMoveLeft}
            intervalMoveRight={intervalMoveRight}
            left={leftreview}
            setLeft={setLeftreview}
            right={right}
            sendIndexsNavigations={sendIndexsNavigations}
            stage={stage}
            dx={dx}
          />
        </ECGMiniatureReview> 

        </>
        }
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


    <div style={{
      position: 'relative'
    }}>
      <Timer 
        stage={stage} 
        setStage={setStage} 
        pauseRecord={pauseRecord} 
        withoutdata={withoutdata}
        widthscroll={widthscroll}
        setWidthscroll={setWidthscroll}
        timer={timer}inreview
        setTimer={setTimer}
      />
      <ButtonCircle 
      onClick={gototheEnd}
      stopmoveviewport={stopmoveviewport}
      >
        <span style={{
          fontFamily: 'Rokkitt',
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '20px',
          lineHeight: '131%',
          textAlign: 'center',
          letterSpacing: '0.03em',
          color: (inreview) ? '#004FEC' : '#BFBFBF',
          padding: '12px'
        }}>
          {'Ahora'}  
        </span>
      </ButtonCircle>

      {inreview && stage === "FINISH" && (
        <>
          {indicatorsRef && 
          indicatorsRef.current.start &&
          indicatorsRef.current.end &&
            <Eye>
              <FontAwesomeIcon
                style={{
                  margin: "0px 5px",
                  fontSize: "18px"
                }}
                icon={faEye}
              />
              {`${indicatorsRef.current.start} / ${indicatorsRef.current.end}`} 

            </Eye>
          }
        </>
      )}
    </div>
      
    </>
  );
};
export default EcgNavigator;
