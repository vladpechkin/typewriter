import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import bellMp3 from "./bell.mp3";
import {
  CHAR_WIDTH,
  CHAR_HEIGHT,
  CHARS_IN_LINE,
  TUTORIAL_EN,
  TUTORIAL_RU,
} from "./consts";

const App = () => {
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(CHAR_HEIGHT * 25);

  const [text, setText] = useState("");

  const ref = useRef(null);

  const [isTutorialComplete, setIstutorialComplete] = useState(false);

  const [padding, setPadding] = useState(2);

  const bell = useMemo(() => new Audio(bellMp3), []);

  const keyHandler = useCallback(
    (event) => {
      if (!isTutorialComplete) {
        setIstutorialComplete(true);
        setText("");
        setYOffset(0);
      }

      if (Math.round(xOffset) === Math.round(CHAR_WIDTH * 62)) {
        bell.play();
      }

      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.key === "Shift"
      )
        return;

      if (
        (Math.round(xOffset) === Math.round(CHAR_WIDTH * CHARS_IN_LINE) &&
          event.key !== "Enter") ||
        (xOffset < 1 &&
          (event.key === "Backspace" || event.key === "ArrowLeft")) ||
        yOffset > 1000
      ) {
        event.preventDefault();

        return;
      }

      if (event.key === "Backspace" || event.key === "ArrowLeft") {
        if (xOffset === 0) setXOffset(ref?.current?.clientWidth);

        if (xOffset > 0) setXOffset(xOffset - CHAR_WIDTH);

        return;
      }

      if (event.key.length === 1 || event.key === "ArrowRight") {
        setXOffset(xOffset + CHAR_WIDTH);

        return;
      }

      if (event.key === "ArrowUp") setYOffset(yOffset - CHAR_HEIGHT);

      if (event.key === "ArrowDown") setYOffset(yOffset + CHAR_HEIGHT);

      if (event.key === "Enter") {
        setXOffset(0);
        setYOffset(yOffset + CHAR_HEIGHT);
      }

      return;
    },
    [xOffset, yOffset, bell, isTutorialComplete]
  );

  useEffect(() => {
    setText(`TYPEWRITER
by @vladpechkin

${navigator.language.includes("ru") ? TUTORIAL_RU : TUTORIAL_EN}`);

    document.addEventListener("keydown", keyHandler, false);

    return () => {
      document.removeEventListener("keydown", keyHandler, false);
    };
  }, [keyHandler]);

  return (
    <>
      <textarea
        autoFocus
        ref={ref}
        value={text}
        onChange={({ target }) => setText(target.value)}
        focus={{ preventScroll: true }}
        style={{
          padding: `${padding}cm`,
          left: `calc(50% - ${padding}cm - ${CHAR_WIDTH / 2}px - ${xOffset}px)`,
          top: `calc(100% - 2cm - 10px - ${CHAR_HEIGHT}px - ${yOffset}px)`,
        }}
        className="page"
        onBlur={({ target }) => target.focus()}
      ></textarea>
      <div className="typewriter">
        <div className="pointer" style={{ height: CHAR_HEIGHT }}></div>
        <div className="scale">
          {Array.from({ length: 22 }, (_, index) => (
            <div className="mark" key={index}></div>
          ))}

          <div
            className="finger"
            style={{ left: `calc(${padding}cm - 2px)` }}
          ></div>
          <div
            className="finger"
            style={{ right: `calc(${padding}cm - 2px)` }}
          ></div>
        </div>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
