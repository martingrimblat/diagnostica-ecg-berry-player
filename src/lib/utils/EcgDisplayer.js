import { msToPixels } from "./ecg";

export class EcgDisplayer {
    constructor(ctx, sampleRate=250, scale, factorScale=1, color="#B163FF") {
      this.ctx = ctx;
      this.widthLimit = ctx.canvas.width
      this.shiftOffset = 0;
      this.lastIndex = 0;
      this.sampleRate = sampleRate
      this.lastCoordinate = {
        x: 0, 
        y: 0}
      this.scale = scale
      this.drawing = false
      this.drawn = []
      this.dx = this.calculateXDistance()
      this.sampleWidth = Math.floor(this.widthLimit / this.dx)
      this.breaks = []
      this.factorScale = factorScale
      this.color = color
      this.ctx.fillStyle = this.color
    }
    
    calculateXDistance() {
      const msDistance = 1000 / this.sampleRate;
      const pxDistance = msToPixels(this.scale, msDistance);

      return pxDistance;
    }

    setCtx(ctx) {
      this.ctx = ctx;
    }
  
    setShiftOffset(shiftOffset) {
      this.shiftOffset = shiftOffset;
    }

    addShiftOffset(shiftOffset) {
      this.shiftOffset += shiftOffset;
    }
  
    setLastIndex(index) {
      this.lastIndex = index;
    }

    setLastCoordinate(coordinate) {
      this.lastCoordinate = coordinate
    }

    setDrawing(drawing) {
      this.drawing = drawing
    }

    addBreak(breakIndex) {
      console.log(breakIndex)
      this.breaks.push(breakIndex)
    }

    addDrawn(newDrawn) {
      this.drawn = this.drawn.concat(newDrawn)
    }

    getCtx() {
      return this.ctx;
    }
  
    getOffset() {
      return this.initialOffset;
    }
  
    getLastIndex() {
      return this.getLastIndex;
    }

    getScale() {
      return this.scale
    }
  }