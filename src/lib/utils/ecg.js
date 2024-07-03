export async function generateCoordinates (data, dx, prevX=0, factorScale=1) {
    // Tomando un fragmento de data se genera un array con coordenadas
    // el eje X está en ms y el Y en amp que viene del berry
    // console.log('test', timePeriod, data.length)

    // const sampleTimeInterval = timePeriod / data?.length
    // const samplePxInterval = msToPixels(scale, sampleTimeInterval)
    // console.log('sample time', samplePxInterval)
    const coordinates = []
    let deltaX = prevX
    // console.log('delta x', deltaX)
    for (let i = 0; i < data.length; i++) {
        let x = deltaX + dx
        deltaX = x
        let y = Math.floor(data[i]*factorScale)
        coordinates.push({x, y})
        // console.log(factorScale, y)
    }

    return coordinates
}

export const setPixel = (ctx, x, y) => {
    ctx.fillStyle = "#B163FF"
    ctx.fillRect(x, y, 1, 1);
  }

  // TODO cambiar param canvas height por ecgDisplayer
  export function plotLine (ctx, startCoordinate, endCoordinate, canvasHeight=261) { //Should be integers
    // console.log('start point', startCoordinate, 'endpoint', endCoordinate)
    let {x: x0, y: y0} = startCoordinate
    let {x: x1, y: y1} = endCoordinate
    // console.log(startCoordinate, endCoordinate)
    y0 = canvasHeight - y0;
    y1 = canvasHeight - y1;
    // console.log(y1,x1)
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = dx + dy, e2;                                   /* error value e_xy */

    for (; ;) {              
      // console.log('for iteration')                                            /* loop */
      setPixel(ctx, x0, y0);
      if (x0 == x1 && y0 == y1) break;
      e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }                        /* x step */
      if (e2 <= dx) { err += dx; y0 += sy; }                        /* y step */
    }
  }

export const drawDerivations = async (data, timePeriod, ecgDisplayer) => {
  let sliceInit, sliceEnd, dataSlice, prevX, coordinates, lastCoordinate
  let sampleRate = ecgDisplayer.sampleRate
  let lastIndex = ecgDisplayer.lastIndex
  let widthLimit = ecgDisplayer.widthLimit
  let factorScale = ecgDisplayer.factorScale
  let dx = ecgDisplayer.dx
  let sampleAmount = Math.floor((sampleRate * timePeriod)/1000) //TODO esto es fijo, pasarlo a ecgDisplayer
  if (ecgDisplayer.shiftOffset == 0) {
    sliceInit = lastIndex
    sliceEnd = lastIndex + sampleAmount
    dataSlice = data.slice(sliceInit, sliceEnd)
    prevX = lastIndex * dx || 0
    coordinates = await generateCoordinates(dataSlice, dx, prevX, factorScale)
    lastCoordinate = await drawWave(ecgDisplayer, coordinates)
    ecgDisplayer.setLastCoordinate(lastCoordinate)
  } else {
    let sampleWidth = ecgDisplayer.sampleWidth // cantidad de samples quee entran en todo el width. //TODO buscar un nombre más acore
    // console.log(lastIndex,sampleWidth,sampleAmount)
    let lastDrawn = data.slice(lastIndex-sampleWidth-sampleAmount, lastIndex)
    sliceInit = lastIndex
    sliceEnd = lastIndex + sampleAmount

    let breakPoint

    ecgDisplayer.breaks.map(breakIndex => {
      if (breakIndex >= sliceInit && breakIndex <= sliceEnd) {
        breakPoint = breakIndex - sliceInit
      }
    })
    
    const newSlice = data.slice(sliceInit, sliceEnd)
    // console.log(lastDrawn, newSlice)
    dataSlice = lastDrawn.concat(newSlice)
    prevX = ecgDisplayer.lastCoordinate.x
    coordinates = await generateCoordinates(dataSlice, dx, 0, factorScale)
    lastCoordinate = await drawWave(ecgDisplayer, coordinates)
    ecgDisplayer.setLastCoordinate({x: 0, y: 125})
  }
  if (lastCoordinate.x > widthLimit) ecgDisplayer.addShiftOffset(sampleAmount)
  ecgDisplayer.addDrawn(coordinates)
  // console.log('drawn', ecgDisplayer.drawn)
  // console.log(lastCoordinate)
  ecgDisplayer.setLastIndex(sliceEnd)
  // console.log('last coord', lastCoordinate)
  return ecgDisplayer.lastIndex
}

export const drawFragment = async (data, indexes, displayer) => {
  const dx = displayer.dx
  const dataSlice = data.slice(indexes.start, indexes.end)
  const ctx = displayer.ctx
  // console.log('draw', ctx.canvas)
  const factorScale = displayer.factorScale
  // console.log('clear ctx', ctx)
  ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
  const coordinates = await generateCoordinates(dataSlice, dx, 0, factorScale)
    await drawWave(displayer, coordinates)
  return
}

export const drawWave = async (ecgDisplayer, coordinates, breakPoint) => {

  // console.log('draw wave', coordinates)

    const scale = ecgDisplayer.scale
    let prevCoordinate = ecgDisplayer.lastCoordinate
    let xDelta = 0
    let shiftOffset = ecgDisplayer.shiftOffset > 0
    let ctx = ecgDisplayer.ctx
    
    if (ecgDisplayer.shiftOffset) {  
      // prevCoordinate = {
      //   x: 0,
      //   y: Math.floor(ctx.canvas.height / 2)
      // }
     ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
    //  prevCoordinate = {x: 0, y: 0}
    }

    // console.log('coordinates',coordinates)  
    coordinates.map((coordinate, index) => {
      // if (!ecgDisplayer.drawing || (breakPoint && breakPoint == index)) {
      //   if (!breakPoint) {
      //     let coordinateIndex = ecgDisplayer.lastIndex + index
      //     ecgDisplayer.addBreak(coordinateIndex)
      //   }

      //   plotLine(ctx, prevCoordinate, {x: prevCoordinate.x, y: 160})
      //   plotLine(ctx, {x: prevCoordinate.x, y: 160} , {x: prevCoordinate.x + 10, y: 160})
      //   prevCoordinate = {x: prevCoordinate.x + 10, y: 160}
      //   xDelta = 10
      // }

      if (shiftOffset) {
        xDelta = -(msToPixels(scale, 1000/250)) // TODO revisar esto
      }

      let {x , y} = coordinate
      let coordinatePx = {y, x: Math.floor(xDelta + x)} //
      // console.log('plot line')
      plotLine(ctx, prevCoordinate, coordinatePx, ecgDisplayer.ctx.canvas.height)
      if (ecgDisplayer.drawing != true) ecgDisplayer.setDrawing(true)
      prevCoordinate = coordinatePx
      })
        
    return prevCoordinate
      // const xIntervalsPx = msToPixels(scale, msDistance);
}

export function drawReferenceLines(canvas, color) {
    const xAxisMax = canvas.clientWidth;
    const yAxisMax = canvas.clientHeight;
  
    const width = 38/10; //TODO parametrizar esto, de donde sale este valor?
    const height = 38/10; //TODO parametrizar esto
  
    const lineWidths = [
      0.5,
      0.8,
      2.5
    ]
  
    const canvasContext = canvas.getContext("2d");
    canvasContext.translate(0.5, 0.5);
    canvasContext.strokeStyle = color || "#FF0000";
    canvasContext.lineWidth = lineWidths[0]; //0.3  
  
  
    canvasContext.beginPath();
    for (let y = 0; y <= yAxisMax; y += height) {
      canvasContext.moveTo(0, y);
      canvasContext.lineTo(xAxisMax, y);
    }

    for (let x = 0; x <= xAxisMax; x += width) {
      canvasContext.moveTo(x, 0);
      canvasContext.lineTo(x, yAxisMax);
    }

    canvasContext.stroke();
  
    canvasContext.beginPath();
    canvasContext.lineWidth = lineWidths[1];

    for (let y = 0; y <= yAxisMax; y += height * 5) {
      canvasContext.moveTo(0, y);
      canvasContext.lineTo(xAxisMax, y);
    }

    for (let x = 0; x <= xAxisMax; x += width * 5) {
      canvasContext.moveTo(x, 0);
      canvasContext.lineTo(x, yAxisMax);
    }
  
    canvasContext.stroke();
  
    canvasContext.beginPath();
    canvasContext.lineWidth = lineWidths[2];

    for (let y = 0; y <= yAxisMax; y += height * 25) {
      canvasContext.moveTo(0, y);
      canvasContext.lineTo(xAxisMax, y);
    }

    for (let x = 0; x <= xAxisMax; x += width * 25) {
      canvasContext.moveTo(x, 0);
      canvasContext.lineTo(x, yAxisMax);
    }
  
    canvasContext.stroke();
  
    // ctx.translate(0, 0);
  }

export function msToPixels(scale, milliseconds){
    const millimeters = milliseconds * scale.factor;
    const _1cm_px = 38; //23.5''
    const _1mm_px = _1cm_px / 10;
    return millimeters * _1mm_px;
   }
  
export function drawStartRect(ctx, startCoordinate) {
  let {x, y} = startCoordinate
  ctx.beginPath();
  ctx.lineTo(x, y + 100);
  ctx.stroke();
  ctx.lineTo(x + 50, y);
  ctx.stroke();
}

