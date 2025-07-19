import React from "react";
import { getStyles } from "../styles/styles";
import TimerRow from "./TimerRow";

export default function TimersGrouped({ timers, categoriesExpanded, dispatch, theme, filter }) {
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
