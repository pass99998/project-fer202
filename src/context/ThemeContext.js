import { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

// Provider: giữ state giao diện sáng/tối và chia sẻ cho mọi component bên trong
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('pokeshop_theme', 'light');

  // Bootstrap 5.3 hỗ trợ dark mode qua thuộc tính data-bs-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

ThemeProvider.propTypes = { children: PropTypes.node.isRequired };

// Hook rút gọn để component con dùng
export const useTheme = () => useContext(ThemeContext);
