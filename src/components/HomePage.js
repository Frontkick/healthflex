import React, { useEffect } from "react";
import TimerForm from "./TimerForm";
import CategoryFilter from "./CategoryFilter";
import TimersGrouped from "./TimersGrouped";

export default function HomePage({
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
