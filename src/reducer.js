export const initialState = {
  timers: [],
  history: [],
  categoriesExpanded: {},
};

export function reducer(state, action) {
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
