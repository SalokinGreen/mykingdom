import React, { useState, useRef, useEffect } from "react";
import styles from "./UI.module.css";
import Button from "./Button";
import Dialog from "./Dialog";
import Input from "./Input";
export default function DialogInput({
  open,
  onClose,
  onSend,
  title,
  description,
}) {
  const [value, setValue] = useState("");
  const dialogRef = useRef(null);
  //   useEffect(() => {
  //     if (open) {
  //       dialogRef.current.focus();
  //     }
  //   }, [open]);
  const handleSend = () => {
    onSend(value);
    setValue("");
    onClose();
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <div className={styles.dialogInput}>
        <h2 className={styles.dialogInputTitle}>{title}</h2>
        <p className={styles.DialogInputDescription}>{description}</p>
        <Input
          placeholder="Type a message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          ref={dialogRef}
          handleEnter={handleEnter}
        />
        <div className={styles.dialogInputAction}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSend}>Ok</Button>
        </div>
      </div>
    </Dialog>
  );
}
