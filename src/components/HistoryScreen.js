import React from 'react';
import useTimers from '../hooks/useTimers';

function HistoryScreen() {
  const [{ history }] = useTimers();
  return (
    <div className="history-screen">
      <h2>Completed Timers</h2>
      {!history.length && <div>No timer completions yet.</div>}
      <ul>
        {history.slice().reverse().map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong>
            <span> completed at </span>
            <span>{new Date(item.completedAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => {
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'timer_history.json';
        a.click();
      }}>
        Export as JSON
      </button>
    </div>
  );
}

export default HistoryScreen;
