import styled from "styled-components";

export const Canvas = styled.canvas.attrs(props => ({
  style: {
    height: `${props.height}`,
    width: `${props.widthCanvasMiniature}px`
  },
}))`left: '0px';`

