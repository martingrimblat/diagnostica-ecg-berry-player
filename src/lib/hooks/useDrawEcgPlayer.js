import { useEffect, useRef } from "react";
import { drawDerivations, drawFragment } from "../utils/ecg";
import { EcgDisplayer } from "../utils/EcgDisplayer";
import { mmScales } from "../utils/constants";
import { useState } from "react";
// import { useRemoteRecorder } from "hooks/useRemoteRecorder";



export function useDrawDerivationsPlayer(datasetRef, displayersRef) {
  
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
    setPlayOn(true)
}

useEffect(() => {
    if (playOn && datasetRef.current?.ECG_WAVE) {
        cancelRef.current = startRenderLoop();
    }
  }, [datasetRef.current?.ECG_WAVE, playOn])

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
    const data = {};
    let i = 0;
    let duration = positionrightLiveToReviewRef.current
    
    if(displayersRef.current.mainDisplayer) {
      let lastIndex = displayersRef.current.mainDisplayer.lastIndex
      datasetRef.current.ECG_WAVE.splice(lastIndex)
    }

    const finalDataset = datasetRef.current.ECG_WAVE
    var blob = new Blob([JSON.stringify(finalDataset)], {
      type: 'applicaton/json',
    })

    // setLoading(true)
    // await onCaptureMade({blob, duration}) //TODO IMP! esto lo tengo que pasar al multi
    console.log(datasetRef.current)
    if (datasetRef.current?.ECG_WAVE) {
      datasetRef.current.ECG_WAVE = null  
    }
    datasetRef.current = null  
    console.log(datasetRef.current)
    // cleanContext();
    return data;
  }

  function startRenderLoop() {
    const data = datasetRef.current.ECG_WAVE;
    if(!data){
      console.log(`startRenderLoop. datasetRef is not initialized`);
      return
    }

    if (!displayersRef.current) setDisplayers()
      let time = data.length*1000/250 //TODO parametrizar
    console.log('time', time)
    console.log('data',data)
        drawDerivations(data, time, displayersRef.current.mainDisplayer)
        drawDerivations(data, time, displayersRef.current.miniatureDisplayer)
      // displayersRef.current.mainDisplayer.setLastIndex(lastIndex)
      // console.log('dataset', data.length, 'drawed', ecgDisplayerRef.current.lastIndex)
      // console.log('dif', data.length - ecgDisplayerRef.current.lastIndex)
      
      // requestAnimationFrame(() => console.log('RERENDER SCREEN'));
    
    return () => {
      console.log('remove animation frame')
    };
  }

  function setDisplayers() {
    const mainCanvas = document.querySelector('[id=mainEcgViewer]')
    const ctxMain = mainCanvas.getContext("2d")
    const miniatureCanvas = document.querySelector('[id=ecgMiniature]')
    const ctxMiniature = miniatureCanvas.getContext("2d")


    const mainDisplayer = new EcgDisplayer(ctxMain, 250, mmScales[1], 0.5)
    const mainReviewDisplayer = new EcgDisplayer(ctxMain, 250, mmScales[1], 0.5)
    const miniatureDisplayer = new EcgDisplayer(ctxMiniature, 250, mmScales[0], 0.25)
    const miniatureReviewDisplayer = new EcgDisplayer(ctxMiniature, 250, mmScales[0], 0.25)

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
      const mainReviewCanvas = document.querySelector('[id=mainEcgViewer]')
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
    const miniatureReviewCanvas = document.querySelector('[id=ecgMiniature]')
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