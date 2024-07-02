import React, { useRef } from 'react'
import { useDrawDerivations } from '../hooks/useDrawEcg'

export const ECGPanel = (
  datasetRefViewer,
  setIsWithoutData,
  stage,
  setStage,
  pauseRecord,
  gototheEnd,
  positionrightLiveToReviewRef,
  stopmoveviewport,
  setStopmoveviewport,
  pauseGraffics,
  leftArrow,
  setLeftArrow,
  rightArrow,
  setRightArrow,
  leftreview,
  setLeftreview,
  setLeft,
  setRight
  ) => {

  const [minWidthReview, setMinWidthReview] = useState(587);
  const [timer, setTimer] = useState(0);

  const offsetRefViewport = useRef(0);
  const positionsReview = useRef({
    'start': 0,
    'end': 255
  });
  const positionsReviewScroll = useRef({
    'start': 0,
    'end': 1000
  });
  const positionsRefViewport = useRef({
    'start': 0,
    'end': 255
  });
  const indicatorsRef = useRef({
    'start': 0,
    'end': 255
  });
  const displayersRef = useRef()
  const positionLeftIsPinReview = useRef(0);
  const viewportRef = useRef()
  const viewportRefReview = useRef()



  const { play,
    stop,
    initialize,
    finalize,
    setOnData,
    drawViewportFragment,
    drawViewportMiniature
  } = useDrawDerivations(
    datasetRefViewer,
    displayersRef,
    positionrightLiveToReviewRef
  )

  const {
    readValues,
    startAcq,
    pauseAcq,
    retry
  } = useEcgBerryDevice(
    setIsWithoutData,
    datasetRefViewer,
    setOnData
  )

  //TODO muchas de estas funciones deberían estar en otro lugar para mayor orden

  const gototheEnd = () => {
    setStopmoveviewport(false);
    setInreview(false);
    setRightArrow(false);

    if(positionrightLiveToReviewRef.current > 990)
      setLeftArrow(true);
    else
      setLeftArrow(false);
  }

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
      setLeft(0)
    // } else {
    //   document.querySelector('.drag-indicator-viewer').style.left = '0px';
    // }
    // mover el rectangulo al comienzo

    // para focalizar todas las graficas
    auxiliarDraw(left, right);

    // para focalizar la dii guia (miniature)
    auxiliarDrawScroll(left, (isPinReview)?right + 410:right + 735);


    setSelectedmargins({left, right});

    handleDragIndicators(true);
  };

  const handleListcomments = () => {
    setViewlistcomments(true)
    setShowModalComments(true)
  }

  return (
    <Flex>
        <WrapperGrid ref={withoutDataDivRef} style={{ position: 'relative', left:'-100px' ,zIndex: 1}}>
            <BoxGrid type={typesGrid.ECGWave}>
              <ECGWave />
            </BoxGrid>
          </WrapperGrid>
          { stopmoveviewport &&
            <WrapperGrid ref={withoutDataDivRef} style={{ position: 'relative', left:'-100px', zIndex: 2}}>
              <BoxGrid type={typesGrid.ECGWave}>
                <ECGWave review={true}/>
              </BoxGrid>
          </WrapperGrid>}
          <WrapperGrid ref={withoutDataDivRef} style={{position: 'relative', left:'-100px', top:'100px',marginTop: '300px'}}>
            <BoxGrid type={typesGrid.SPO2Wave}>
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
                  isPinReview={true} //TODO sacar, esta siempre en true
                  live={true} //TODO sacar, esta siempre en true
                  lastDrawn={displayersRef.current?.mainDisplayer?.lastIndex}
                  msScale={displayersRef.current?.mainDisplayer?.scale}
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
                  setIsPinReview={() => {}} //TODO esto no se usa
                  setIsPin={() => {}} //TODO esto no se usa
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
                  dx={displayersRef.current?.mainDisplayer?.dx}
                  />
              </ECGWrapper>
            </BoxGrid>
          </WrapperGrid>
        </Flex>
  )
}
