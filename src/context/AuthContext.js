import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';
import { loginRequest } from '../api/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('pokeshop_user', null);

  // async/await: gọi API, sai thông tin thì ném lỗi cho trang Login hiển thị
  const login = async (username, password) => {
    const found = await loginRequest(username, password);
    if (!found) throw new Error('Sai tên đăng nhập hoặc mật khẩu');
    const { password: removed, ...safeUser } = found; // không lưu mật khẩu vào state/localStorage
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => setUser(null);

  // Truyền cả giá trị lẫn hàm cập nhật xuống cho component con
  const value = { user, login, logout, isAdmin: user?.role === 'admin' };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

export const useAuth = () => useContext(AuthContext);
