import React from "react";
import styled, { css, keyframes } from "styled-components";
import { useEffect, useRef, useState } from "react";

import recording from "../assets/images/recording-dot.svg";
import dot from "../assets/images/pause.svg";

const Wrapper = styled.div.attrs(({ stage }) => ({
  style: {
    background: stage ? "#FF6C6C" : "#79D2D2",
  },
}))`
  position: absolute;
  width: 123px;
  height: 34px;
  left: 20px;
  top: 35px;

  z-index: 30;

  opacity: 0.85;

  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-size: 23px;
  line-height: 135%;

  color: #ffffff;

  text-align: center;
  letter-spacing: -0.02em;
`;

const pulse = keyframes`
    0% {
      transform: scale(0.70);
      box-shadow: 0 0 0 0 rgb(255, 108, 108);
    }

    70% {
      transform: scale(1.6);
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0);
    }

    100% {
      transform: scale(0.98);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
`;



const Img = styled.img`

    src= ${props => props.src};

    position: absolute;
    width: 14px;
    height: 22px;
    left: 10px;
    top: 4px;
    zIndex: 31;
    borderRadius: 50%;
    box-sizing:border-box;

    animation: ${props => (props.stage === 'RECORDING')? css`${pulse} 2s infinite` : css``};

`;

const Timer = ({
  stage, 
  time, 
  setStage, 
  pauseRecord, 
  withoutdata,
  timer,
  setTimer
}) => {

  const [active, setActive] = useState(false);
  const [image, setImage] = useState(dot);

  const countRef = useRef(null);

  const handleStart = () => {
    setActive(true);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
  };

  const formatTime = () => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);

    return `${getMinutes}:${getSeconds}`;
  };

  useEffect(() => {
    if (stage === "RECORDING") {
      setActive(true);
      setImage(recording);
    } else {
      setActive(false);
      setImage(dot);
    }
  }, [stage]);

  // useEffect(() => {
  //   if(timer == 0){
  //     handlePause();
  //     pauseRecord();
  //     setStage("FINISH");
  // }
  // }, [timer]);

  useEffect(() => {
    active ? handleStart() : handlePause();
  }, [active]);

  useEffect(() => {
    if(withoutdata){
      setTimer(25);
    }
  }, [withoutdata]);
  

  return (
    <>
      <Wrapper stage={active}>
        <Img
          src={image}
          stage={stage}
          // style={{
          //   position: "absolute",
          //   width: "14px",
          //   height: "22px",
          //   left: "10px",
          //   top: "4px",
          //   zIndex: "31",
          // }}
        />
        <div
          style={{
            position: "absolute",
            left: "40px",
          }}
        >
          {formatTime()}
        </div>
      </Wrapper>
    </>
  );
};

export default Timer;
