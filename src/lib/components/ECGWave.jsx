import React, { useEffect, useRef } from 'react'

import { drawReferenceLines } from '../utils/ecg';

export const ECGWave = ({review}) => {
  const canvasBgRef = useRef();
  const canvasRef = useRef();
  let id

  useEffect(() => {
    if (canvasBgRef.current) {
      drawReferenceLines(canvasBgRef.current, "#F2F2F2");
    }

    if(canvasBgRef && canvasBgRef.current){
      canvasBgRef.current = null;
    }
    console.log('review', review)
    if (review) {
      id = 'mainEcgReview'
    } else {
      id = 'mainEcgViewer'
    }
    console.log(id)
  }, []);


  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          left: '80px'
        }}
        id={review ? 'mainEcgReview' : 'mainEcgViewer'}
        className="canvas-content"
        width={1175}
        height={200}>
      </canvas>
      
      <canvas
        ref={canvasBgRef}
        id="mainEcgBg"
        className="canvas-background"
        // width={width}
        width={1255}
        height={200}>
      </canvas>
    </div>
  )
}