import React, { useReducer, useEffect, useState } from "react";
import ThemeContext from "./context/ThemeContext";
import { lightTheme, darkTheme } from "./styles/themes";
import { getStyles } from "./styles/styles";
import { reducer, initialState } from "./reducer";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Modal from "./components/Modal";
import HomePage from "./components/HomePage";
import HistoryPage from "./components/HistoryPage";

export default function App() {
  // Theme logic
  const [themeName, setThemeName] = useState(() => {
    const fromStorage = localStorage.getItem("theme");
    if (fromStorage === "light" || fromStorage === "dark") return fromStorage;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });
  const theme = themeName === "dark" ? darkTheme : lightTheme;
  useEffect(() => {
    localStorage.setItem("theme", themeName);
    document.body.style.background = theme.background;
    document.body.style.color = theme.color;
  }, [theme, themeName]);

  // App logic
  const [state, dispatch] = useReducer(reducer, initialState);
  const [page, setPage] = useState("home");
  const [filter, setFilter] = useState("All");
  const [modalData, setModalData] = useState(null);
  const [halfwayAlertTimers, setHalfwayAlertTimers] = useState([]);

  // Load (on boot) from localStorage
  useEffect(() => {
    try {
      const savedState = JSON.parse(localStorage.getItem("timerAppState"));
      if (savedState) dispatch({ type: "LOAD_STATE", payload: savedState });
    } catch {}
  }, []);
  // Persist
  useEffect(() => {
    localStorage.setItem("timerAppState", JSON.stringify({ timers: state.timers, history: state.history }));
  }, [state.timers, state.history]);

  return (
    <ThemeContext.Provider value={theme}>
      <div style={getStyles(theme).container}>
        <div style={getStyles(theme).navBar}>
          <button
            style={getStyles(theme).navBtn(page === "home")}
            onClick={() => setPage("home")}
          >Timer Manager</button>
          <button
            style={getStyles(theme).navBtn(page === "history")}
            onClick={() => setPage("history")}
          >History & Logs</button>
          <ThemeSwitcher theme={theme} setThemeName={setThemeName} />
        </div>
        {page === "home" && (
          <HomePage
            theme={theme}
            state={state}
            dispatch={dispatch}
            filter={filter}
            setFilter={setFilter}
            setModalData={setModalData}
            halfwayAlertTimers={halfwayAlertTimers}
            setHalfwayAlertTimers={setHalfwayAlertTimers}
            setThemeName={setThemeName}
          />
        )}
        {page === "history" && (
          <HistoryPage theme={theme} state={state} dispatch={dispatch} />
        )}
        {modalData && (
          <Modal
            title="Congratulations!"
            onClose={() => setModalData(null)}
            theme={theme}
          >
            Timer "{modalData}" completed!
          </Modal>
        )}
        {halfwayAlertTimers.length > 0 && (
          <Modal
            title="Halfway Alert!"
            onClose={() =>
              setHalfwayAlertTimers((prev) => prev.slice(1))
            }
            theme={theme}
          >
            Timer "{halfwayAlertTimers[0].name}" has reached its halfway point!
          </Modal>
        )}
      </div>
    </ThemeContext.Provider>
  );
}
