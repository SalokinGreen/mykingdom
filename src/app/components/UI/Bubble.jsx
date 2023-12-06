import React, { useState, useEffect } from "react";
import styles from "./UI.module.css";

export default function Bubble({ children, i }) {
  const [text, setText] = useState(children);
  useEffect(() => {
    setText(text.split("[")[0]);
  }, [text]);

  return (
    <div className={styles.bubble} style={{ whiteSpace: "pre-line" }} key={i}>
      {text}
    </div>
  );
}
