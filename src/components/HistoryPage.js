import React from "react";
import { getStyles } from "../styles/styles";
import ExportJsonButton from "./ExportJsonButton";

export default function HistoryPage({ theme, state, dispatch }) {
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
