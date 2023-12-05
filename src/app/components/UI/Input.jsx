import React from "react";
import styles from "./UI.module.css";

const Input = ({ onChange, value, placeholder, ref, handleEnter }) => {
  return (
    <input
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className={styles.input}
      ref={ref}
      onKeyDown={handleEnter}
    />
  );
};
export default Input;
