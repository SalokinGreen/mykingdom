import React, { useRef, useEffect } from "react";

// style
import styles from "./UI.module.css";
import Exit from "./Exit";

const Modal = ({ isOpen, onClose, children, size = "small", title = "" }) => {
  // click event listener
  const modalRef = useRef(null);
  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);
  // click event handler
  const handleClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  let modalSizeClass = "";
  if (size === "medium") {
    modalSizeClass = styles.modalMedium;
  } else if (size === "big") {
    modalSizeClass = styles.modalBig;
  }

  return (
    <div
      className={`${styles.modal} ${
        isOpen ? styles.open : ""
      } ${modalSizeClass}`}
      ref={modalRef}
    >
      <div className={styles.modalHeader}>
        <Exit onClick={onClose}>X</Exit>

        <div className={styles.modalTitle}>{title}</div>
      </div>
      <div className={styles.modalContent}>{children}</div>
    </div>
  );
};

export default Modal;
