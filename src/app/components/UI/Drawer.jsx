import React from "react";
import styles from "./UI.module.css";

export default function Drawer({ position, children }) {
  return (
    <div className={`${styles.drawer} ${styles[position]}`}>{children}</div>
  );
}
