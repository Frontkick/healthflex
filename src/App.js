import React, { useReducer, useEffect, useState, createContext } from "react";

// THEME SUPPORT
const lightTheme = {
  background: "#fff",
  color: "#111",
  card: "#f5f5f5",
  border: "#ccc",
  btn: "#007bff",
  btnSecondary: "#6c757d",
  btnDanger: "#dc3545",
  progress: "#007bff",
  alert: "#ffeeba",
  alertText: "#856404",
};
const darkTheme = {
  background: "#161a1d",
  color: "#f0f3fa",
  card: "#1a1f25",
  border: "#333",
  btn: "#3783ff",
  btnSecondary: "#678",
  btnDanger: "#e46464",
  progress: "#419fff",
  alert: "#6b3700",
  alertText: "#ffe197",
};

const ThemeContext = createContext();

// Helper functions
const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const initialState = {
  timers: [],
  history: [],
  categoriesExpanded: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_STATE": {
      return { ...state, ...action.payload };
    }
    case "ADD_TIMER": {
      return { ...state, timers: [...state.timers, action.payload] };
    }
    case "UPDATE_TIMER": {
      const timers = state.timers.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
      );
      return { ...state, timers };
    }
    case "REMOVE_TIMER": {
      const timers = state.timers.filter((t) => t.id !== action.payload);
      return { ...state, timers };
    }
    case "MARK_COMPLETED": {
      const { id, completionTime } = action.payload;
      const timers = state.timers.map((t) =>
        t.id === id ? { ...t, status: "completed", remaining: 0 } : t
      );
      const completedTimer = state.timers.find((t) => t.id === id);
      if (!completedTimer) return state;
      const logEntry = {
        id: completedTimer.id,
        name: completedTimer.name,
        category: completedTimer.category,
        completionTime,
      };
      return { ...state, timers, history: [logEntry, ...state.history] };
    }
    case "TOGGLE_CATEGORY": {
      const cat = action.payload;
      return {
        ...state,
        categoriesExpanded: {
          ...state.categoriesExpanded,
          [cat]: !state.categoriesExpanded[cat],
        },
      };
    }
    case "BULK_ACTION": {
      const { category, actionName } = action.payload;
      const timers = state.timers.map((t) => {
        if (t.category !== category || t.status === "completed") return t;
        if (actionName === "start") return { ...t, status: "running" };
        if (actionName === "pause") return { ...t, status: "paused" };
        if (actionName === "reset")
          return {
            ...t,
            status: "paused",
            remaining: t.duration,
            alertedHalfway: false,
          };
        return t;
      });
      return { ...state, timers };
    }
    case "CLEAR_HISTORY": {
      return { ...state, history: [] };
    }
    default:
      return state;
  }
}

// --- Styles (uses theme) ---
function getStyles(theme) {
  return {
    container: {
      maxWidth: 800,
      margin: "auto",
      padding: 20,
      fontFamily: "Arial, sans-serif",
      background: theme.background,
      color: theme.color,
      minHeight: "100vh",
      transition: "background 0.3s, color 0.3s",
    },
    navBar: {
      display: "flex",
      gap: 20,
      alignItems: "center",
      marginBottom: 25,
      borderBottom: `1.5px solid ${theme.border}`,
      paddingBottom: 14,
    },
    navBtn: (active) => ({
      fontWeight: active ? "bold" : "normal",
      color: theme.btn,
      background: "none",
      border: 0,
      fontSize: 17,
      cursor: "pointer",
      textDecoration: active ? "underline" : "none",
      padding: 0,
    }),
    card: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 6,
      padding: 15,
      marginBottom: 18,
    },
    header: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
    btn: {
      padding: "6px 12px",
      margin: "0 4px",
      cursor: "pointer",
      borderRadius: 4,
      border: "none",
      background: theme.btn,
      color: "#fff",
    },
    btnDanger: { background: theme.btnDanger, color: "#fff" },
    btnSecondary: { background: theme.btnSecondary, color: "#fff" },
    input: {
      padding: 6,
      width: "100%",
      boxSizing: "border-box",
      marginBottom: 12,
      background: theme.card,
      color: theme.color,
      border: `1px solid ${theme.border}`,
      borderRadius: 4,
    },
    categoryHeader: {
      fontSize: 19,
      fontWeight: "bold",
      cursor: "pointer",
      userSelect: "none",
      marginTop: 18,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      padding: 8,
      borderRadius: 4,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    timerRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 12px",
      borderBottom: `1px solid ${theme.border}`,
      fontSize: 16,
    },
    timerInfo: { flex: 1, marginLeft: 16 },
    progressBarContainer: {
      height: 10,
      background: "#333",
      borderRadius: 5,
      overflow: "hidden",
      marginTop: 6,
    },
    progressBar: {
      height: "100%",
      background: theme.progress,
      transition: "width 0.3s",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: theme.card,
      color: theme.color,
      padding: 34,
      borderRadius: 10,
      maxWidth: 400,
      minWidth: 230,
      textAlign: "center",
    },
    alertMsg: {
      marginTop: 6,
      padding: 6,
      backgroundColor: theme.alert,
      borderRadius: 4,
      color: theme.alertText,
      fontSize: 13,
    },
    select: {
      padding: "7px",
      minWidth: 120,
      background: theme.card,
      color: theme.color,
      border: `1px solid ${theme.border}`,
      borderRadius: 4,
      marginBottom: 20,
    },
    themeSwitcher: {
      cursor: "pointer",
      fontWeight: "bold",
      border: 0,
      padding: "8px 12px",
      background: theme.btn,
      color: "#fff",
      borderRadius: 4,
    },
  };
}

// Theme switcher
function ThemeSwitcher({ theme, setThemeName }) {
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

// Modal
function Modal({ title, children, onClose, theme }) {
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

function TimerForm({ onAddTimer, categories, theme }) {
  const styles = getStyles(theme);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const durSec = parseInt(duration, 10);
    if (!name.trim()) {
      alert("Please enter timer name");
      return;
    }
    if (!durSec || durSec <= 0) {
      alert("Please enter valid duration in seconds");
      return;
    }
    if (!category.trim()) {
      alert("Please select or enter category");
      return;
    }
    onAddTimer({
      id: Date.now().toString(),
      name: name.trim(),
      duration: durSec,
      remaining: durSec,
      category: category.trim(),
      status: "paused",
      alertedHalfway: false,
      halfwayAlert,
    });
    setName("");
    setDuration("");
    setHalfwayAlert(false);
  };
  return (
    <form onSubmit={handleSubmit} style={{ ...styles.card, marginBottom: 20 }}>
      <h3 style={{ marginTop: 0 }}>Add New Timer</h3>
      <input
        style={styles.input}
        type="text"
        placeholder="Name (e.g., Workout Timer)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Duration (seconds)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        list="categories-list"
        placeholder="Category (e.g., Workout, Study)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <datalist id="categories-list">
        {categories.map((cat) => (
          <option key={cat} value={cat} />
        ))}
      </datalist>
      <label style={{ marginBottom: 12, display: "block" }}>
        <input
          type="checkbox"
          checked={halfwayAlert}
          onChange={(e) => setHalfwayAlert(e.target.checked)}
        />{" "}
        Enable halfway alert (notification at 50%)
      </label>
      <button type="submit" style={styles.btn}>
        Add Timer
      </button>
    </form>
  );
}
function TimerRow({ timer, dispatch, theme }) {
  const styles = getStyles(theme);
  const { id, name, remaining, duration, status, halfwayAlert, alertedHalfway } =
    timer;
  const percentage = ((duration - remaining) / duration) * 100;
  return (
    <div style={styles.timerRow}>
      <div style={styles.timerInfo}>
        <div>
          <strong>{name}</strong> {" - "}
          {formatTime(remaining)} {" - "}
          <em>{status.charAt(0).toUpperCase() + status.slice(1)}</em>
        </div>
        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBar, width: `${percentage}%` }} />
        </div>
        {halfwayAlert && percentage >= 50 && !alertedHalfway && (
          <div style={styles.alertMsg}>Halfway alert triggered!</div>
        )}
      </div>
      <div>
        {status !== "running" && status !== "completed" && (
          <button
            style={styles.btn}
            onClick={() =>
              dispatch({
                type: "UPDATE_TIMER",
                payload: { id, updates: { status: "running" } },
              })
            }
          >
            Start
          </button>
        )}
        {status === "running" && (
          <button
            style={styles.btnSecondary}
            onClick={() =>
              dispatch({
                type: "UPDATE_TIMER",
                payload: { id, updates: { status: "paused" } },
              })
            }
          >
            Pause
          </button>
        )}
        <button
          style={styles.btnDanger}
          onClick={() =>
            dispatch({
              type: "UPDATE_TIMER",
              payload: {
                id,
                updates: {
                  status: "paused",
                  remaining: duration,
                  alertedHalfway: false,
                },
              },
            })
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function TimersGrouped({ timers, categoriesExpanded, dispatch, theme, filter }) {
  const styles = getStyles(theme);
  // Group timers by category
  const grouped = timers.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});
  const categories = Object.keys(grouped).sort();
  // Filter list
  const displayCategories =
    filter && filter !== "All"
      ? categories.filter((c) => c === filter)
      : categories;
  if (displayCategories.length === 0)
    return <p>No timers to show for selected category.</p>;
  return displayCategories.map((category) => {
    const expanded = categoriesExpanded[category] ?? true;
    // Bulk actions
    const handleBulkStart = () =>
      dispatch({
        type: "BULK_ACTION",
        payload: { category, actionName: "start" },
      });
    const handleBulkPause = () =>
      dispatch({
        type: "BULK_ACTION",
        payload: { category, actionName: "pause" },
      });
    const handleBulkReset = () =>
      dispatch({
        type: "BULK_ACTION",
        payload: { category, actionName: "reset" },
      });
    return (
      <div key={category}>
        <div
          style={styles.categoryHeader}
          onClick={() =>
            dispatch({ type: "TOGGLE_CATEGORY", payload: category })
          }
        >
          <div>{category}</div>
          <div>{expanded ? "▲" : "▼"}</div>
        </div>
        <div style={{ marginLeft: 20, display: expanded ? "block" : "none" }}>
          <div style={{ marginBottom: 10 }}>
            <button style={styles.btn} onClick={handleBulkStart}>
              Start All
            </button>
            <button style={styles.btnSecondary} onClick={handleBulkPause}>
              Pause All
            </button>
            <button style={styles.btnDanger} onClick={handleBulkReset}>
              Reset All
            </button>
          </div>
          {grouped[category]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((timer) => (
              <TimerRow
                key={timer.id}
                timer={timer}
                dispatch={dispatch}
                theme={theme}
              />
            ))}
        </div>
      </div>
    );
  });
}

function CategoryFilter({ categories, filter, setFilter, theme }) {
  const styles = getStyles(theme);
  return (
    <select
      style={styles.select}
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    >
      <option value="All">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}

function ExportJsonButton({ data, filename, theme }) {
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

function HomePage({
  theme,
  state,
  dispatch,
  filter,
  setFilter,
  setModalData,
  halfwayAlertTimers,
  setHalfwayAlertTimers,
  setThemeName,
}) {
  const categories = Array.from(
    new Set(state.timers.map((t) => t.category))
  ).sort();
  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      state.timers.forEach((timer) => {
        if (timer.status === "running" && timer.remaining > 0) {
          const newRem = timer.remaining - 1;
          // Halfway alert trigger & notify
          if (
            timer.halfwayAlert &&
            !timer.alertedHalfway &&
            newRem <= Math.floor(timer.duration / 2)
          ) {
            dispatch({
              type: "UPDATE_TIMER",
              payload: { id: timer.id, updates: { alertedHalfway: true, remaining: newRem } },
            });
            setHalfwayAlertTimers((prev) => [
              ...prev,
              { id: timer.id, name: timer.name },
            ]);
          } else {
            dispatch({
              type: "UPDATE_TIMER",
              payload: { id: timer.id, updates: { remaining: newRem } },
            });
          }
          if (newRem <= 0) {
            dispatch({
              type: "MARK_COMPLETED",
              payload: { id: timer.id, completionTime: new Date().toISOString() },
            });
            setModalData(timer.name);
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.timers, dispatch, setModalData, setHalfwayAlertTimers]);

  const addTimer = (timer) => {
    dispatch({ type: "ADD_TIMER", payload: timer });
  };

  return (
    <div>
      <TimerForm onAddTimer={addTimer} categories={categories} theme={theme} />
      <CategoryFilter
        categories={categories}
        filter={filter}
        setFilter={setFilter}
        theme={theme}
      />
      <TimersGrouped
        timers={state.timers}
        categoriesExpanded={state.categoriesExpanded}
        dispatch={dispatch}
        theme={theme}
        filter={filter}
      />
    </div>
  );
}

function HistoryPage({ theme, state, dispatch }) {
  const styles = getStyles(theme);
  const clearHistory = () => {
    if (window.confirm("Clear all history?")) {
      dispatch({ type: "CLEAR_HISTORY" });
      localStorage.setItem(
        "timerAppState",
        JSON.stringify({ timers: state.timers, history: [] })
      );
    }
  };
  return (
    <div>
      {state.history.length === 0 ? (
        <p>No completed timers yet.</p>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <ExportJsonButton
              data={state.history}
              filename={`timer-history-${new Date().toISOString().slice(0, 10)}.json`}
              theme={theme}
            />
            <button
              style={{ ...styles.btnDanger, marginLeft: 12 }}
              onClick={clearHistory}
            >
              Clear History
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                  <th style={{ textAlign: "left", padding: 8 }}>Name</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Category</th>
                  <th style={{ textAlign: "left", padding: 8 }}>
                    Completion Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.history.map(({ id, name, category, completionTime }) => (
                  <tr
                    key={id}
                    style={{ borderBottom: `1px solid ${theme.border}` }}
                  >
                    <td style={{ padding: 8 }}>{name}</td>
                    <td style={{ padding: 8 }}>{category}</td>
                    <td style={{ padding: 8 }}>
                      {new Date(completionTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

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
