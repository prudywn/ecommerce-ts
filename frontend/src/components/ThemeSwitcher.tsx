import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="bg-transparent text-white p-2 rounded hover:bg-gray-700 transition duration-300 absolute right-0 top-1"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />}
    </button>
  );
};

export default ThemeSwitcher;
