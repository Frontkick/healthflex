import React from "react";
import { getStyles } from "../styles/styles";
import formatTime from "../utils/formatTime";

export default function TimerRow({ timer, dispatch, theme }) {
  const styles = getStyles(theme);
  const { id, name, remaining, duration, status, halfwayAlert, alertedHalfway } = timer;
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
