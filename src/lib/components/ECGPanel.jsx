import React from 'react'
import styled from 'styled-components'
import {ECGWave} from './ECGWave'
import EcgNavigator from './ECGNavigator'

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
  minWidthReview,
  withoutdata,
  widthCanvasMiniature=0, // TODO borrar esto, no se usa en ningun lado
  setWidthCanvasMiniature,// TODO borrar esto, no se usa en ningun lado
  auxiliarDraw,
  auxiliarDrawLive,
  auxiliarDrawScroll,
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
  displayersRef,
  inreview,
  withoutDataDivRef}
) => {
  console.log('inreview',setInreview)
  console.log('setStage',setStage)
  console.log('setTimer',setTimer)
  console.log('setLeftreview',setLeftreview)
  console.log('setRightArrow',setRightArrow)
  return (
    <>
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
              lastDrawn={displayersRef?.current?.mainDisplayer?.lastIndex}
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
    </>

  )
}
export default ECGPanel;