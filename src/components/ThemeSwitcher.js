import React from 'react';
import useTimers from '../hooks/useTimers';

function ThemeSwitcher() {
  const [{ theme }, dispatch] = useTimers();
  return (
    <div className="theme-switcher">
      <label>
        Theme:&nbsp;
        <select
          value={theme}
          onChange={e => dispatch({ type: 'SET_THEME', theme: e.target.value })}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
}
export default ThemeSwitcher;
