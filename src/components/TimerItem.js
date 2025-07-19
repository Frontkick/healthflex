import React, { useEffect, useState } from 'react';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function TimerItem({ timer, dispatch }) {
  const [showHalfway, setShowHalfway] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    function halfwayListener(e) {
      if (e.detail.id === timer.id) setShowHalfway(true);
    }
    function completeListener(e) {
      if (e.detail.id === timer.id) setShowCongrats(true);
    }
    window.addEventListener('halfwayAlert', halfwayListener);
    window.addEventListener('timerComplete', completeListener);
    return () => {
      window.removeEventListener('halfwayAlert', halfwayListener);
      window.removeEventListener('timerComplete', completeListener);
    };
  }, [timer.id]);

  function handle(status) {
    if (status === 'reset') {
      dispatch({ type: 'UPDATE_TIMER', id: timer.id, update: { status: 'idle', remaining: timer.duration, halfwayFired: false } });
    } else {
      dispatch({ type: 'UPDATE_TIMER', id: timer.id, update: { status } });
    }
  }

  return (
    <div className={`timer-item ${timer.status}`}>
      <div className="timer-head">
        <span className="timer-name">{timer.name}</span>
        <span className={`timer-status status-${timer.status}`}>{timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}</span>
      </div>
      <div className="timer-time">
        <span>{formatTime(timer.remaining)}</span> / <span>{formatTime(timer.duration)}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-inner"
          style={{ width: `${Math.max(0, (timer.remaining / timer.duration) * 100)}%` }}
        />
      </div>
      <div className="timer-controls">
        {timer.status !== 'running' && timer.status !== 'completed' && (
          <button onClick={() => handle('running')}>Start</button>
        )}
        {timer.status === 'running' && <button onClick={() => handle('paused')}>Pause</button>}
        <button onClick={() => handle('reset')}>Reset</button>
      </div>
      {showHalfway && (
        <div className="modal-alert" onClick={() => setShowHalfway(false)}>
          <div className="modal">
            <strong>Halfway!</strong>
            <div>{timer.name}</div>
            <button onClick={() => setShowHalfway(false)}>OK</button>
          </div>
        </div>
      )}
      {showCongrats && (
        <div className="modal-alert" onClick={() => setShowCongrats(false)}>
          <div className="modal">
            <strong>Timer Completed!</strong>
            <div>{timer.name}</div>
            <button onClick={() => setShowCongrats(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimerItem;
