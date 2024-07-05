import styled from 'styled-components';

export const Spacing = styled.div`
  box-sizing: border-box;
  ${(props) => props.mtop && `margin-top:${props.mtop};`}
  ${(props) => props.mright && `margin-right:${props.mright};`}
  ${(props) => props.mbottom && `margin-bottom:${props.mbottom};`}
  ${(props) => props.mleft && `margin-left:${props.mleft};`}
  ${(props) => props.mt && `margin-top:${props.mt};`}
  ${(props) => props.mr && `margin-right:${props.mr};`}
  ${(props) => props.mb && `margin-bottom:${props.mb};`}
  ${(props) => props.ml && `margin-left:${props.ml};`}
  ${(props) => props.m && `margin:${props.m};`}
  ${(props) => props.mx && `margin-left:${props.mx};margin-right:${props.mx};`}
  ${(props) => props.my && `margin-top:${props.my};margin-bottom:${props.my};`}
    
  ${(props) => props.ptop && `padding-top:${props.ptop};`}
  ${(props) => props.pright && `padding-right:${props.pright};`}
  ${(props) => props.pbottom && `padding-bottom:${props.pbottom};`}
  ${(props) => props.pleft && `padding-left:${props.pleft};`}
  ${(props) => props.p && `padding:${props.p};`}
  ${(props) => props.pt && `padding-top:${props.pt};`}
  ${(props) => props.pr && `padding-right:${props.pr};`}
  ${(props) => props.pb && `padding-bottom:${props.pb};`}
  ${(props) => props.pl && `padding-left:${props.pl};`}
  ${(props) =>
    props.px && `padding-left:${props.px};padding-right:${props.px};`}
  ${(props) =>
    props.py && `padding-top:${props.py};padding-bottom:${props.py};`}
  ${(props) => props.position && `position:${props.position};`}
  ${(props) => props.relative && `position:relative;`}
  ${(props) => props.absolute && `position:absolute;`}
  
  ${(props) => props.t && `top:${props.t};`}
  ${(props) => props.r && `right:${props.r};`}
  ${(props) => props.b && `bottom:${props.b};`}
  ${(props) => props.l && `left:${props.l};`}
  ${(props) => props.top && `top:${props.top};`}
  ${(props) => props.right && `right:${props.right};`}
  ${(props) => props.bottom && `bottom:${props.bottom};`}
  ${(props) => props.left && `left:${props.left};`}
  ${(props) => props.w && `width:${props.w};`}
  ${(props) => props.h && `height:${props.h};`}
  ${(props) => props.width && `width:${props.width};`}
  ${(props) => props.height && `height:${props.height};`}
  ${(props) => props.bc && `border: 2px solid ${props.bc};`}
  ${(props) => props.fit && `width: fit-content;`}
  ${(props) =>
    props.spacingX &&
    `
    & > * {
      margin-left: ${props.spacingX}px;  
      margin-right: ${props.spacingX}px; 
    }
  `}
  ${(props) =>
    props.spacingY &&
    `
  & > * {
    margin-top: ${props.spacingY};  
    margin-bottom: ${props.spacingY}; 
  }
`}
`;

export const Flex = styled(Spacing)`
  display: flex;
  ${(props) => props.wrap && `flex-wrap: wrap;`}
  max-width: ${(props) => props.maxWidth || "100%"};
  ${(props) => {
    const direction = props.d || props.direction;
    return direction ? `flex-direction:${direction};` : "";
  }}
  ${(props) => {
    return props.row ? "flex-direction:row;" : "";
  }}
  ${(props) => {
    return props.column ? "flex-direction:column;" : "";
  }}
  ${(props) => {
    const justify = props.j || props.justify;
    return justify ? `justify-content:${justify};` : "";
  }}
  ${(props) => {
    const align = props.a || props.align;
    return align ? `align-items:${align};` : "";
  }}
  ${(props) => {
    const flex = props.flex;
    return flex ? `flex:${flex};` : "";
  }}
  ${(props) => {
    return props.center ? "justify-content:center;align-items:center;" : "";
  }}
  ${(props) =>
    props.spacing &&
    `
  & > * {
    ${(props) =>
      props.row &&
      `
              margin-left:10px;
              margin-right:10px;
    `}
    ${(props) =>
      props.column &&
      `
              margin-top:15px;
              margin-bottom:15px;
    `}
  }
`}
`;