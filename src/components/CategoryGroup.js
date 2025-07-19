import React from 'react';
import TimerItem from './TimerItem';

function CategoryGroup({ category, timers, expanded, onToggle, dispatch }) {
  function bulkAction(status) {
    let update;
    if (status === 'start') update = { status: 'running' };
    if (status === 'pause') update = { status: 'paused' };
    if (status === 'reset') update = t => ({
      status: 'idle',
      remaining: t.duration,
      halfwayFired: false,
    });
    timers.forEach(t =>
      dispatch({
        type: 'UPDATE_TIMER',
        id: t.id,
        update: typeof update === 'function' ? update(t) : update
      })
    );
  }

  return (
    <div className="cat-group">
      <div className="cat-header" onClick={onToggle}>
        <strong>{category}</strong>
        <span>
          [{expanded ? '-' : '+'}]
          <button className="bulk" onClick={e => { e.stopPropagation(); bulkAction('start'); }}>Start All</button>
          <button className="bulk" onClick={e => { e.stopPropagation(); bulkAction('pause'); }}>Pause All</button>
          <button className="bulk" onClick={e => { e.stopPropagation(); bulkAction('reset'); }}>Reset All</button>
        </span>
      </div>
      {expanded && (
        <div className="cat-timers">
          {timers.map(t =>
            <TimerItem key={t.id} timer={t} dispatch={dispatch} />
          )}
        </div>
      )}
    </div>
  );
}
export default CategoryGroup;
