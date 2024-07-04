import React, { useEffect, useRef } from 'react'

import { drawReferenceLines } from '../utils/ecg';

const sizes = {
  displayer: {
    height: 200,
    width: 1175,
  },
  player: {
    height: 100,
    width: 500
  }
}

export const ECGWave = ({review, player=false}) => {
  const canvasBgRef = useRef();
  const canvasRef = useRef();
  let id, size
  size = player ? sizes.player : sizes.displayer

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

  // useEffect(() => {
  //   size = player ? sizes.player : sizes.displaye
  //   setCanvasSize(size)
  //   console.log('size', size)
  // }, [player])


  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          left: '80px'
        }}
        id={review ? 'mainEcgReview' : 'mainEcgViewer'}
        className="canvas-content"
        width={size?.width}
        height={size?.height}>
      </canvas>
      
      { !player &&
        <canvas
          ref={canvasBgRef}
          id="mainEcgBg"
          className="canvas-background"
          // width={width}
          width={1255}
          height={200}>
      </canvas>}
    </div>
  )
}