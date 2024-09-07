import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";

const App = () => {
  const [charsXOffset, setCharsXOffset] = useState(0);
  const [charsYOffset, setCharsYOffset] = useState(0);

  const ref = useRef(null);

  const CHARACTER_WIDTH = 8.795;
  // const CHARACTER_HEIGHT = 20;

  const CHARACTERS_IN_LINE = 72;

  const keyHandler = useCallback(
    (event) => {
      if (event.key.includes("Arrow")) {
        event.preventDefault();
        return;
      }

      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.key === "Shift"
      )
        return;

      if (
        Math.round(charsXOffset) ===
          Math.round(CHARACTER_WIDTH * CHARACTERS_IN_LINE) &&
        event.key !== "Enter"
      ) {
        event.preventDefault();

        // setCharsXOffset(CHARACTER_WIDTH);

        return;
      }

      if (event.key === "Backspace" || event.key === "ArrowLeft") {
        if (charsXOffset === 0) setCharsXOffset(ref?.current?.clientWidth);

        if (charsXOffset > 0) setCharsXOffset(charsXOffset - CHARACTER_WIDTH);

        return;
      }

      if (event.key.length === 1 || event.key === "ArrowRight") {
        setCharsXOffset(charsXOffset + CHARACTER_WIDTH);

        return;
      }

      // if (event.key === "ArrowUp") setCharsYOffset(charsYOffset + CHARACTER_HEIGHT)

      setCharsXOffset(0);
    },
    [charsXOffset]
  );

  useEffect(() => {
    ref.current.focus();

    document.addEventListener("keydown", keyHandler, false);

    return () => document.removeEventListener("keydown", keyHandler, false);
  }, [keyHandler]);

  return (
    <>
      <div
        contentEditable
        autoFocus
        ref={ref}
        style={{
          left: `calc(50% - ${charsXOffset}px)`,
          bottom: `calc(50% - 12px - ${charsYOffset}px)`,
        }}
        className="input"
        onBlur={({ target }) => target.focus()}
      ></div>
      <div className="cursor"></div>
      {/* <div className="stats">
        {charsXOffset + " " + ref?.current?.clientWidth}
      </div> */}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
