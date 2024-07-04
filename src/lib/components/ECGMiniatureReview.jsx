import React from "react";
import styled from "styled-components";
import { useEffect, useRef } from "react";
import { drawReferenceLines } from '../utils/ecg';

import "./styles/styles.css";

const CanvasContainer = styled.div.attrs(props => ({
  style: {
    height: (props.height ? `${props.height}px` : `161px`),
    width: `${props.widthCanvasMiniature}px`,
    maxWidth: `${props.widthCanvasMiniature}px`
  },
}))`position: relative;`

const CanvasActions = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
`;

const DerivationIndicator = styled.div`
  font-family: Montserrat;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: 35px;
  letter-spacing: -0.04em;
  text-align: center;
  width: 48px;
  height: 35px;

  margin-right: 11px;
`;


const ECGMiniatureReview = ({
  isPin,
  handlePin,
  derivation,
  dataDerivation,
  label,
  canvasRef,
  width = 909,
  height = 161,
  canPin = true,
  backgroundGrid = true,
  canvasId,
  widthCanvasMiniature,
  children,
  refCanvasWrapperMinViewer,
  refCanvasMiniatureContainer,
  bgWidth = 1045,
  ...props
}) => {
  const canvasBgRef = useRef();
  const canvasMiniatureRef = useRef();


  useEffect(() => {
    if (canvasBgRef.current && backgroundGrid) {
      drawReferenceLines(canvasBgRef.current, "#F2F2F2");
    }

    if(canvasBgRef && canvasBgRef.current){
      canvasBgRef.current = null;
    }

    if(canvasRef && canvasRef.current){
      canvasRef.current = null;
    }



    /* Retornar algo para hacer un clean del canvas en el unmount? */
    return () => {
      const canvasBg = canvasBgRef.current;
      const bgCtx = canvasBg?.getContext("2d");
      bgCtx?.clearRect(0, 0, canvasBg?.canvas?.width, canvasBg?.canvas?.height);
      if(canvasBgRef && canvasBgRef.current){
        canvasBgRef.current = null;
      }
    };
  }, []);


  return (
    <div style={{
      marginTop: '-151px',
      backgroundColor: '#ffff',
      width: `${bgWidth}px`,
      marginLeft: '0px',
      marginRight: '14px'
    }}>

      <DerivationIndicator></DerivationIndicator>

        <div 
        id={'canvas-wrapper-min-viewer'}
        ref={refCanvasWrapperMinViewer }
        className="canvas-wrapper" 
        {...props}
          // style={{
          //   overflowX: 'auto'
          // }}
        >
      <CanvasContainer
        className="canvas-container"
        ref={refCanvasMiniatureContainer}
        width={width}
        canvasId={canvasId}
        widthCanvasMiniature={width}
        // width={(canvasId === 'dii-miniature') ? `${widthCanvasMiniature}px` : width - 80}
        height={height}
      > 
        <canvas
          style={{
            backgroundColor: '#fff'
          }}
          ref={canvasMiniatureRef}
          id={`ecgMiniatureReview`}
          data-derivation={dataDerivation || derivation}
          className="canvas-content"
          width={width}
          height={height}
        ></canvas>

        <canvas
          ref={canvasBgRef}
          id={`${derivation}-bgViewer`}
          className="canvas-background"
          // width={width}
          width={width}
          height={height}
        ></canvas>

        {children}
      </CanvasContainer>
    </div>

    </div>
    
  );
};
export default ECGMiniatureReview;
