import { useReducer, useEffect, useRef } from 'react';

// Retrieve timers and history from localStorage or provide defaults
function getInitialTimers() {
  try {
    const timers = JSON.parse(localStorage.getItem('timers') || '[]');
    return Array.isArray(timers) ? timers : [];
  } catch {
    return [];
  }
}

function getInitialHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

const initialState = {
  timers: getInitialTimers(),
  history: getInitialHistory(),
  filter: 'All',
  theme: localStorage.getItem('theme') || 'light'
};

function timerReducer(state, action) {
  switch (action.type) {
    case 'ADD_TIMER': {
      const timers = [...state.timers, action.timer];
      return { ...state, timers };
    }
    case 'UPDATE_TIMER': {
      const timers = state.timers.map(t =>
        t.id === action.id ? { ...t, ...action.update } : t
      );
      return { ...state, timers };
    }
    case 'REMOVE_TIMER': {
      const timers = state.timers.filter(t => t.id !== action.id);
      return { ...state, timers };
    }
    case 'BULK_UPDATE_BY_CAT': {
      const timers = state.timers.map(t =>
        t.category === action.category
          ? { ...t, ...action.update }
          : t
      );
      return { ...state, timers };
    }
    case 'COMPLETE_TIMER': {
      const now = new Date().toISOString();
      const timers = state.timers.map(t =>
        t.id === action.id ? { ...t, status: 'completed', remaining: 0 } : t
      );
      const finTimer = state.timers.find(t => t.id === action.id);
      const history = finTimer
        ? [
            ...state.history,
            {
              id: finTimer.id,
              name: finTimer.name,
              completedAt: now,
            },
          ]
        : state.history;
      return { ...state, timers, history };
    }
    case 'UPDATE_FILTER': {
      return { ...state, filter: action.filter };
    }
    case 'SET_THEME': {
      localStorage.setItem('theme', action.theme);
      document.documentElement.setAttribute('data-theme', action.theme);
      return { ...state, theme: action.theme };
    }
    case 'TICK_ALL': {
      const timers = state.timers.map(t => {
        if (t.status === 'running' && t.remaining > 0) {
          const newRemaining = t.remaining - 1;
          let halfwayFired = t.halfwayFired;
          // Halfway alert logic
          if (
            t.halfwayAlert &&
            !t.halfwayFired &&
            newRemaining === Math.floor(t.duration / 2)
          ) {
            window.dispatchEvent(
              new CustomEvent('halfwayAlert', { detail: t })
            );
            halfwayFired = true;
          }
          // Complete logic
          if (newRemaining <= 0) {
            window.dispatchEvent(
              new CustomEvent('timerComplete', { detail: t })
            );
          }
          return {
            ...t,
            remaining: Math.max(0, newRemaining),
            halfwayFired,
            status: newRemaining <= 0 ? 'completed' : 'running',
          };
        }
        return t;
      });
      return { ...state, timers };
    }
    default:
      return state;
  }
}

export default function useTimers() {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  const intervalRef = useRef();

  // Set up interval for ticking all timers
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'TICK_ALL' });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Persist timers and history to localStorage
  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(state.timers));
    localStorage.setItem('history', JSON.stringify(state.history));
  }, [state.timers, state.history]);

  // Set theme attribute on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Mark timers as completed in reducer when their status changes
  useEffect(() => {
    state.timers.forEach(t => {
      if (t.status === 'completed' && !state.history.find(h => h.id === t.id)) {
        dispatch({ type: 'COMPLETE_TIMER', id: t.id });
      }
    });
    // Only run when timers change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timers]);

  return [state, dispatch];
}
