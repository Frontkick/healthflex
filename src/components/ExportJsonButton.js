import React from "react";
import { getStyles } from "../styles/styles";

export default function ExportJsonButton({ data, filename, theme }) {
  const styles = getStyles(theme);
  const handleExport = () => {
    const str = JSON.stringify(data, null, 2);
    const blob = new Blob([str], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button style={styles.btnSecondary} onClick={handleExport}>
      Export as JSON
    </button>
  );
}
