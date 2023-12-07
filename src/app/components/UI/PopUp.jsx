import React, { useRef, useEffect } from "react";
import styles from "./UI.module.css";

export default function PopUP({ open, setOpen, title, text, i }) {
  // click event listener
  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);
  // click event handler
  const handleClick = (e) => {
    setOpen(false);
  };

  return (
    <div className={styles.popUp} key={i}>
      <div className={styles.popUpTitle}>{title}</div>
      <div className={styles.popUpText}>{text}</div>
    </div>
  );
}
