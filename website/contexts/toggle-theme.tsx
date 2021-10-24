import React from 'react';

const ToggleThemeContext = React.createContext({
  toggleTheme: () => {},
  theme: 'light', // Default to light theme
});

export { ToggleThemeContext };
