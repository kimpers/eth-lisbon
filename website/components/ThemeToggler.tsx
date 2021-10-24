import React, { useContext } from 'react';
import styled, { useTheme } from 'styled-components';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { BaseButton } from './BaseButton';
import { ToggleThemeContext } from '../contexts/toggle-theme';

interface ThemeTogglerProps {
  size?: number;
}
const ThemeToggler: React.FC<ThemeTogglerProps> = ({ size }) => {
  const { palette } = useTheme();
  const { toggleTheme, theme: mode } = useContext(ToggleThemeContext);
  return (
    <ToggleButton onClick={toggleTheme}>
      <DarkModeSwitch
        checked={mode === 'light'}
        onChange={toggleTheme}
        size={size || 16}
        moonColor={palette.black}
        sunColor={palette.white}
      />
    </ToggleButton>
  );
};

const ToggleButton = styled(BaseButton)`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  outline: none;
  z-index: 1;
  padding-bottom: 6px;
`;

const MemoizedThemeToggler = React.memo(ThemeToggler);

export { MemoizedThemeToggler as ThemeToggler };
