import React from "react";
import { getStyles } from "../styles/styles";

export default function Modal({ title, children, onClose, theme }) {
  const styles = getStyles(theme);
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <div>{children}</div>
        <button style={{ ...styles.btn, marginTop: 20 }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
