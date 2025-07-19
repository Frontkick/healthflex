import React, { useState } from "react";
import { getStyles } from "../styles/styles";

export default function TimerForm({ onAddTimer, categories, theme }) {
  const styles = getStyles(theme);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const durSec = parseInt(duration, 10);
    if (!name.trim()) {
      alert("Please enter timer name");
      return;
    }
    if (!durSec || durSec <= 0) {
      alert("Please enter valid duration in seconds");
      return;
    }
    if (!category.trim()) {
      alert("Please select or enter category");
      return;
    }
    onAddTimer({
      id: Date.now().toString(),
      name: name.trim(),
      duration: durSec,
      remaining: durSec,
      category: category.trim(),
      status: "paused",
      alertedHalfway: false,
      halfwayAlert,
    });
    setName("");
    setDuration("");
    setHalfwayAlert(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ ...styles.card, marginBottom: 20 }}>
      <h3 style={{ marginTop: 0 }}>Add New Timer</h3>
      <input
        style={styles.input}
        type="text"
        placeholder="Name (e.g., Workout Timer)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Duration (seconds)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        list="categories-list"
        placeholder="Category (e.g., Workout, Study)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <datalist id="categories-list">
        {categories.map((cat) => (
          <option key={cat} value={cat} />
        ))}
      </datalist>
      <label style={{ marginBottom: 12, display: "block" }}>
        <input
          type="checkbox"
          checked={halfwayAlert}
          onChange={(e) => setHalfwayAlert(e.target.checked)}
        />{" "}
        Enable halfway alert (notification at 50%)
      </label>
      <button type="submit" style={styles.btn}>
        Add Timer
      </button>
    </form>
  );
}
