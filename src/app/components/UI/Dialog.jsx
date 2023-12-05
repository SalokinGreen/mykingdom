import React, { useRef, useEffect } from "react";
import styles from "./UI.module.css";

export default function Dialog({ open, onClose, children }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (open) {
      dialogRef.current.focus();
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const handleClickOutside = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className={styles.dialog}
      tabIndex={-1}
      ref={dialogRef}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
    >
      <div className={styles.dialogContent}>{children}</div>
    </div>
  );
}
