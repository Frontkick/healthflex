import React from "react";
import { getStyles } from "../styles/styles";

export default function CategoryFilter({ categories, filter, setFilter, theme }) {
  const styles = getStyles(theme);
  return (
    <select
      style={styles.select}
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    >
      <option value="All">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
