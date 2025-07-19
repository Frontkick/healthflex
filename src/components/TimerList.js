import React, { useState } from 'react';
import useTimers from '../hooks/useTimers';
import CategoryGroup from './CategoryGroup';

function TimerList() {
  const [{ timers, filter }, dispatch] = useTimers();

  // Category filter dropdown
  const categories = Array.from(new Set(timers.map(t => t.category)));
  const [expanded, setExpanded] = useState({});

  function handleCategoryClick(cat) {
    setExpanded(exp => ({ ...exp, [cat]: !exp[cat] }));
  }

  // Apply category filtering
  const visibleCats = filter === 'All' ? categories : [filter];

  return (
    <div className="timers-container">
      <div className="filter-section">
        <label>
          Filter Category:{' '}
          <select value={filter} onChange={e => dispatch({ type: 'UPDATE_FILTER', filter: e.target.value })}>
            <option value="All">All</option>
            {categories.map(c => (
              <option value={c} key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      {visibleCats.map(cat => {
        const catTimers = timers.filter(t => t.category === cat);
        if (!cat || !catTimers.length) return null;
        return (
          <CategoryGroup
            key={cat}
            category={cat}
            timers={catTimers}
            expanded={expanded[cat] ?? true}
            onToggle={() => handleCategoryClick(cat)}
            dispatch={dispatch}
          />
        );
      })}
      {!timers.length && <div className="empty-msg">No timers. Add one!</div>}
    </div>
  );
}
export default TimerList;
