
# React Multi-Timer App

A fully functional React web timer app with category grouping, progress bars, history, **dark/light theme**, category filtering, **bulk actions**, **export/import (backup) support**, and more!

Here is the Deployed link: https://healthflex-rho.vercel.app/

---

## 🚀 Features

### Core Timer Features

- **Add Timer**  
  - Name, duration (seconds), category, and optional halfway (50%) alert.
- **Timer List with Grouping**  
  - Timers displayed in **expandable categories**, each showing name, time, and status.
- **Timer Management**  
  - Start, pause, reset, and completed marking. "Completed" status when timer hits zero.
- **Progress Visualization**  
  - Each timer shows a progress bar based on its completion percentage.
- **Bulk Actions**
  - **Start All / Pause All / Reset All** for all timers in a category.
- **User Feedback**
  - When a timer finishes, an on-screen modal pops up with a congratulatory message and timer name.

### History & Logs

- **Timer History**
  - Log of completed timers with their names, categories, and completion timestamps.
  - Accessible from the navigation bar.

### Enhanced Functionality & Bonus Features

- **Export/Import Timers**
  - **Export** current timers and history to a JSON file for backup and restore.
  - **Import** data from a backup JSON file into the app.
- **Category Filtering**
  - Dropdown to show only timers from the selected category.
- **Customizable Themes**
  - **Light/Dark mode** toggle. Theme applies to the entire app.
- **Halfway Notification**
  - Modal notification appears if "halfway alert" is enabled and timer hits 50%.
- **Persistent Storage**
  - All timers/history are saved in your browser's `localStorage`—refresh-proof unless local data is cleared.

## ⭐ Extra Additions

- **Single Page Navigation**
  - No routing libraries are used; app navigation is handled by internal state (SPA mode).
- **Responsive UI**
  - Works well on both desktop and mobile browsers.
- **No third-party timer packages**
  - Timer logic is written in pure React using `setInterval` and state.

---

## ⚙️ Technical Details

- **Framework**: React (functional components)
- **State management**: `useReducer`
- **Timers**:  
  - Updates every second with `setInterval`
  - Accurately tracks remaining time, triggers status changes, and handles halfway/completion alerts.
- **Bulk actions**:  
  - Implemented via reducer logic for fastest response.
- **User Feedback**:  
  - Congratulatory modals, halfway point modal.
- **History**:  
  - Stored as a chronological array (most recent first) in localStorage.
- **Styling**:  
  - Hand-coded CSS-in-JS for theme support.
- **Theme engine**:  
  - Theme is persisted; changing the theme applies to the entire page dynamically.

---



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
