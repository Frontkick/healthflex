import React, { useState } from 'react';
import useTimers from '../hooks/useTimers';

const categories = [
  'Workout',
  'Study',
  'Break',
  'Reading',
  'Other'
];

function AddTimerModal({ onClose }) {
  const [form, setForm] = useState({
    name: '',
    duration: 60,
    category: categories[0],
    halfwayAlert: false,
  });
  const [, dispatch] = useTimers();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f =>
      ({ ...f, [name]: type === 'checkbox' ? checked : value })
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || form.duration < 1) return;
    dispatch({
      type: 'ADD_TIMER',
      timer: {
        id: Date.now() + Math.random().toString(36),
        name: form.name,
        duration: Number(form.duration),
        remaining: Number(form.duration),
        category: form.category,
        status: 'idle',
        halfwayAlert: form.halfwayAlert,
        halfwayFired: false,
        createdAt: new Date().toISOString(),
      },
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Add New Timer</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name: <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Duration (seconds):
            <input name="duration" type="number" min="1" value={form.duration} onChange={handleChange} required />
          </label>
          <label>
            Category:
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map(c => (
                <option value={c} key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            <input type="checkbox" name="halfwayAlert" checked={form.halfwayAlert} onChange={handleChange} />
            Halfway Alert
          </label>
          <div className="modal-actions">
            <button type="submit">Save Timer</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTimerModal;
