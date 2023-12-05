import React from "react";
import styles from "./UI.module.css";

// Context Menu Item
const MenuItem = ({ onClick, children }) => {
  return (
    <div onClick={onClick} className={styles.menuItem}>
      {children}
    </div>
  );
};
export default MenuItem;
