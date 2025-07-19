import React from "react";
import { lightTheme } from "../styles/themes";

export default function ThemeSwitcher({ theme, setThemeName }) {
  return (
    <button
      style={{
        cursor: "pointer",
        border: 0,
        background: "transparent",
        fontWeight: "bold",
        color: theme.btn,
        fontSize: 16,
      }}
      onClick={() => setThemeName((prev) => (prev === "light" ? "dark" : "light"))}
      title="Switch theme"
    >
      {theme === lightTheme ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
