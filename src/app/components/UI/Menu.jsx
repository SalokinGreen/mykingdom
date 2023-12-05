import React, { useRef, useEffect } from "react";
import styles from "./UI.module.css";
// position = { x: 0, y: 0 }
export default function Menu({ children, position, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickAway = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickAway);

    return () => {
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, [onClose]);

  return (
    <div
      className={`${styles.menu}`}
      ref={menuRef}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div className={styles.menuContent}>{children}</div>
    </div>
  );
}
