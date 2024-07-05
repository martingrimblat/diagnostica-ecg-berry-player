import { useEffect, useRef } from "react";
import { drawDerivations, drawFragment } from "../utils/ecg";
import { EcgDisplayer } from "../utils/EcgDisplayer";
import { mmScales } from "../utils/constants";
import { useState } from "react";
// import { useRemoteRecorder } from "hooks/useRemoteRecorder";



export function useDrawDerivations(datasetRef, displayersRef, positionrightLiveToReviewRef, gototheEnd, onData, setLastIndex) {
  
  const cancelRef = useRef();  
  // const [onData, setOnData] = useState(data)
  const timeoutRef = useRef();
  const animationIdRef = useRef();
  const [playOn, setPlayOn] = useState(false)
  // const {onCaptureMade, onCaptureEnd, onCaptureDiscard} = useRemoteRecorder(undefined, 'application/json', undefined, {})


    // desmonto
    useEffect(() => {
    
      return async() => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = undefined;
       }
        cancelRef.current = null;  
  
        timeoutRef.current = null;
        animationIdRef.current = null;
        datasetRef.current = null;
        clearTimeout(timeoutRef.current);
      }
    }, [])

  function play() {
    gototheEnd()
    setPlayOn(true)
}

useEffect(() => {
    if (playOn && onData) {
        cancelRef.current = startRenderLoop();
    }
  }, [datasetRef.current?.ECG_WAVE, playOn, onData])

  async function stop() {
    clearTimeout(timeoutRef.current);
    setPlayOn(false)
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = undefined;
   }
    if(displayersRef.current.mainDisplayer) {
      let lastIndex = displayersRef.current.mainDisplayer.lastIndex
      datasetRef.current.ECG_WAVE.splice(lastIndex)
    }
    typeof cancelRef?.current === "function" && cancelRef.current();
  }

  async function initialize(dataSet = null) {
    datasetRef = dataSet;
  }

  async function finalize() {
    let i = 0;
    let duration = positionrightLiveToReviewRef.current
    
    if(displayersRef.current.mainDisplayer) {
      let lastIndex = displayersRef.current.mainDisplayer.lastIndex
      datasetRef.current.ECG_WAVE.splice(lastIndex)
    }

    const data = datasetRef.current.ECG_WAVE
 
    if (datasetRef.current?.ECG_WAVE) {
      datasetRef.current.ECG_WAVE = null  
    }
    datasetRef.current = null  
    
    return data;
  }

  function startRenderLoop() {
    const data = datasetRef.current.ECG_WAVE;
    if(!data){
      console.log(`startRenderLoop. datasetRef is not initialized`);
      return
    }

    let time, fps = 15, lastIndex;

    if (!displayersRef.current) setDisplayers()

    function draw(now) {
      let timeout = 0
      if (data?.length > 0) {
        timeout = 1000 / fps
      }
      timeoutRef.current = setTimeout(async () => {
        let timePeriod = (now - (time || now)) || 0;
        if (timePeriod != 0 && data) {
          await drawDerivations(data, timePeriod, displayersRef.current.mainDisplayer)
          lastIndex = await drawDerivations(data, timePeriod, displayersRef.current.miniatureDisplayer)
        }
        // displayersRef.current.mainDisplayer.setLastIndex(lastIndex)
        setLastIndex(lastIndex)
        // console.log('dataset', data.length, 'drawed', ecgDisplayerRef.current.lastIndex)
        // console.log('dif', data.length - ecgDisplayerRef.current.lastIndex)
        
        time = now;
        animationIdRef.current = requestAnimationFrame(draw);
        // requestAnimationFrame(() => console.log('RERENDER SCREEN'));
      }, timeout);
    }
    draw();
    
    return () => {
      console.log('remove animation frame')
      cancelAnimationFrame(animationIdRef.current);
    };
  }

  function setDisplayers() {
    const mainCanvas = document.querySelector('[id=mainEcgViewer]')
    const ctxMain = mainCanvas.getContext("2d")
    const miniatureCanvas = document.querySelector('[id=ecgMiniature]')
    const ctxMiniature = miniatureCanvas.getContext("2d")


    const mainDisplayer = new EcgDisplayer(ctxMain, 250, mmScales[2])
    const mainReviewDisplayer = new EcgDisplayer(ctxMain, 250, mmScales[2])
    const miniatureDisplayer = new EcgDisplayer(ctxMiniature, 250, mmScales[1], 0.5)
    const miniatureReviewDisplayer = new EcgDisplayer(ctxMiniature, 250, mmScales[1], 0.5)

    displayersRef.current = {mainDisplayer,miniatureDisplayer,miniatureReviewDisplayer,mainReviewDisplayer}
  }

  /* Determinar de donde leemos la escala con la que se genero el viewport - por ahora asumimos .5 */
  function drawViewportFragment(left, right, type) {
    const data = datasetRef.current.ECG_WAVE;
    if(!data) return;

    let displayer
    const viewportScale = 0.5; // TODO esto hardcodeado no va
    const dx = displayersRef.current.mainDisplayer.dx

    //invertimos la escala
    const tLeft = left / viewportScale;
    const tRight = right / viewportScale;
    const tIndexLeft = Math.round(tLeft / dx);
    const tIndexRight = Math.round(tRight / dx);
    const indexes = {
      start: tIndexLeft,
      end: tIndexRight
    }
      displayer = displayersRef.current.mainReviewDisplayer
      const mainReviewCanvas = document.querySelector('[id=mainEcgReview]')
      const ctxMainReview = mainReviewCanvas.getContext("2d")
      displayer.ctx = ctxMainReview

    // //Check data length before
    // if(Object.keys(datasetRef.current).length){
    //   if(type === 'live')
    //     drawFragmentLive(data,tIndexLeft,tIndexRight);
    //   else
    // if(type === 'live') {
    //   drawFragmentLive(data, indexes, displayersRef.current.mainDisplayer);
    //   drawFragmentLive(data, indexes, displayersRef.current.miniatureDisplayer);
    // }
    // else{
      drawFragment(data, indexes, displayer);
    // }
    // }
  }

  function drawViewportMiniature(left, right) {

    const data = datasetRef.current.ECG_WAVE;
    if(!data) return;
    
    const viewportScale = 0.5;
    
    //const mvScale = options.mvScale;
    const dx = displayersRef.current.mainDisplayer.dx
    //invertimos la escala
    const tLeft = left / viewportScale;
    const tRight = right / viewportScale;
    const tIndexLeft = Math.round(tLeft / dx);
    const tIndexRight = Math.round(tRight / dx);
    const indexes = {
      start: tIndexLeft,
      end: tIndexRight
    }
    const miniatureReviewCanvas = document.querySelector('[id=ecgMiniatureReview]')
    const ctxMiniatureReview = miniatureReviewCanvas.getContext("2d")
    displayersRef.current.miniatureReviewDisplayer.ctx = ctxMiniatureReview
    //Check data length before
    if(Object.keys(datasetRef.current).length){
      drawFragment(data,indexes,displayersRef.current.miniatureReviewDisplayer);

    }
  }

  return {
    play,
    stop,
    initialize,
    finalize,
    drawViewportFragment,
    drawViewportMiniature,
    displayersRef
  }

}