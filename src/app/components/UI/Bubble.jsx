import React, { useState, useEffect, useRef } from "react";
import styles from "./UI.module.css";

export default function Bubble({ children, i, deleteBubble }) {
  const [text, setText] = useState(children);
  useEffect(() => {
    let newText = text;
    newText = newText.replace("***\n", "");
    newText = newText.replace("***", "");
    setText(newText.split("[")[0]);
  }, [text]);
  // delete bubble
  function hadleDelete() {
    deleteBubble(i);
  }
  // Bubble swiping
  const [startX, setStartX] = useState(0);
  const [distanceX, setDistanceX] = useState(0);
  const [positionX, setPositionX] = useState(0);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const distanceX = startX - currentX;
    setDistanceX(distanceX);

    // Update the position of the bubble as you swipe
    setPositionX(-distanceX);
  };

  const handleTouchEnd = () => {
    if (distanceX > 100) {
      // Swiped left
      console.log("Swiped left");
      hadleDelete();
    } else if (distanceX < -100) {
      // Swiped right
      console.log("Swiped right");
    }
    // Reset
    setStartX(0);
    setDistanceX(0);

    // Reset the position of the bubble after the swipe
    setPositionX(0);
  };

  return (
    <div
      className={styles.bubble}
      style={{
        whiteSpace: "pre-line",
        // Add the transform property to move the bubble
        transform: `translateX(${positionX}px)`,
      }}
      key={i}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {text}
    </div>
  );
}
