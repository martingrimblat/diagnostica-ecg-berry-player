import React, { useEffect, useState } from 'react';
import { getSecondsFromPixels } from '../utils/date';

export const useComments = (auxiliarDraw, auxiliarDrawScroll, offsetRefViewportPlayer, lastMarginRightDB, widthOfEcgDiiMiniature, minWidthViewport, setLeftarrow) => {

    const [viewlistcomments, setViewlistcomments] = useState(true);
    const [showModalComments, setShowModalComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dragIndicators, setDragIndicators] = useState({});
    const [selectedmargins, setSelectedmargins] = useState({left:null,right:null});
    const [widthcomments, setWidthcomments] = useState(widthOfEcgDiiMiniature - minWidthViewport);

    
    const [margin, setMargin] = useState(200);

    const handleListcomments = () => {
    setViewlistcomments(true);
    setShowModalComments(true);
    }

    const handleFocusMarginsEcg = (left, right) => {

      // un ejemplo de la grafica sería el siguiente:
      // para una diiMiniature de 500px y viewport de 80px
  
      // |----------|----|----------|
      // 0px       210  290       500px

      // para focalizar todas las graficas
      auxiliarDraw(left, right);
      
      setSelectedmargins({left, right});
      
      handleDragIndicators(true);
      // , widthOfEcgDiiMiniature, minWidthViewport
      let lastMarginLeftDB, primeros = false;
      if(lastMarginRightDB >= widthOfEcgDiiMiniature){
        lastMarginLeftDB = lastMarginRightDB - widthOfEcgDiiMiniature;
      }else{
        primeros = true;
        lastMarginLeftDB = 0;
      }


      
      if(((right > lastMarginLeftDB) && (right <= lastMarginRightDB))&&!primeros){
        
        // ultimos 500px
        
        // seteo el offset del scroll
        offsetRefViewportPlayer.current = lastMarginLeftDB;
        
        // muevo el rectangulo
        document.querySelector('.drag-indicator-viewer').style.left = `${right - lastMarginLeftDB - minWidthViewport}px`;
        
        // para focalizar la dii guia (miniature)
        auxiliarDrawScroll(lastMarginLeftDB, lastMarginRightDB);
        
        
      }else{
        if(((right > 0) && (right <= widthOfEcgDiiMiniature))||primeros){
          // primeros 500px
          setLeftarrow(false)
          
          // seteo el offset del scroll
          offsetRefViewportPlayer.current = 0;
          
          // muevo el rectangulo
          document.querySelector('.drag-indicator-viewer').style.left = `${right - minWidthViewport}px`;
          
          if(lastMarginRightDB<widthOfEcgDiiMiniature){
            // para focalizar la dii guia (miniature)
            auxiliarDrawScroll(0, lastMarginRightDB);
            
          }else{
            // para focalizar la dii guia (miniature)
            auxiliarDrawScroll(0, widthOfEcgDiiMiniature);
            
            
          }
          
        }else{
          // 500px intermedios (no son los primeros ni los ultimos)
          
            // seteo el offset del scroll
            offsetRefViewportPlayer.current = right - widthOfEcgDiiMiniature;
            
            // muevo el rectangulo
            document.querySelector('.drag-indicator-viewer').style.left = `${widthOfEcgDiiMiniature - minWidthViewport}px`;
            
            // para focalizar la dii guia (miniature)
            auxiliarDrawScroll(offsetRefViewportPlayer.current, right);

          }
        }
      };
    
    const handleDragIndicators = (focus = false) => {
      
      const parentDragIndicatorLeft =  document.querySelector('.drag-indicator-left').parentElement.style;
      
    let left = parentDragIndicatorLeft.left;
    let width = parentDragIndicatorLeft.minWidth;

    left = parseInt(left.split("px").shift()) - minWidthViewport;
    width = parseInt(width.split("px").shift());

    //right = (left + width)
    const right = (left + width);


    const { leftSeconds, rightSeconds } = getSecondsFromPixels(left, right, widthcomments , 25);

    setDragIndicators({
        left,
        right,
        leftSeconds,
        rightSeconds
    });

    // si no viene del metodo de focalizar abro el modal de nuevo comentario
    if(!focus){
        setViewlistcomments(false);
        setShowModalComments(true);
    }

    }

  return {
    dragIndicators,
    loading,
    margin,
    viewlistcomments,
    handleListcomments,
    handleFocusMarginsEcg,
    handleDragIndicators,
    showModalComments,
    setShowModalComments,
    setMargin
  }
}
